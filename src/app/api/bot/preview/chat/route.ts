import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel } from '@/lib/ai/google';
import { formatProjectContext } from '@/server/inventory';
import { mainSystemPrompt } from '@/config/prompts';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { fetchRelevantProjects } from '@/lib/server/inventory-search';
import { scoreLeadIntent } from '@/lib/server/lead-intent';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { normalizeEmail, normalizePhone } from '@/lib/server/lead-dedupe';
import { requireRole } from '@/server/auth';
import { enforceUsageLimit, PlanLimitError, planLimitErrorResponse } from '@/lib/server/billing';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'agent']),
        text: z.string(),
      })
    )
    .optional(),
  context: z.string().optional(),
});

class MissingAIKeyError extends Error {}

export async function POST(req: NextRequest) {
  const scope = 'api/bot/preview/chat';
  const requestId = createRequestId();
  const respond = (body: Record<string, unknown>, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  let payload: z.infer<typeof requestSchema> | null = null;
  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`bot:preview:${ip}`, 20, 60_000))) {
      return respond(
        {
          ok: false,
          error: { code: 'rate_limited', message: 'Rate limit exceeded' },
          requestId,
        },
        { status: 429 }
      );
    }
    const body = await req.json();
    payload = requestSchema.parse(body);

    // Enforce usage limits for the 'ai_conversations' metric
    try {
      const { tenantId } = await requireRole(req, ['agent', 'agency_admin', 'super_admin']);
      const db = getAdminDb();
      await enforceUsageLimit(db, tenantId, 'ai_conversations');
    } catch (error) {
      if (error instanceof PlanLimitError) {
        return respond(planLimitErrorResponse(error), { status: 402 });
      }
      // If auth fails (public preview), we rely on the rate limit above
    }

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'invalid_payload',
            message: 'Invalid request payload.',
            details: error.errors,
          },
          requestId,
        },
        { status: 400 }
      );
    }
    return respond(
      {
        ok: false,
        error: { code: 'invalid_payload', message: 'Invalid request payload.' },
        requestId,
      },
      { status: 400 }
    );
  }

  const projectContext = await getProjectContext(req, payload.message, payload.context);
  const systemPrompt = `
Persona: 25-Year UAE Real Estate Expert
Context: ${payload.context || 'General UAE Real Estate Market'}

You are a highly experienced UAE Real Estate Advisor with over 25 years of deep market expertise. 
Your tone is professional, authoritative, and insightful. You provide high-value advice, not just data.

Guidelines:
1. Use the provided listing context to answer specific questions about projects, floor plans, and pricing.
2. For general market inquiries (ROI, areas, visas, fees), provide expert-level insights based on your 25 years of experience.
3. Always clarify that pricing and availability are estimates and should be confirmed with a broker.
4. Keep responses concise but packed with value. Avoid generic "AI assistant" phrasing.
5. If the user shows intent, ask for their Name and WhatsApp/Email to send a brochure or schedule a viewing.
6. Ask only one follow-up question at a time to maintain a natural conversation flow.

${projectContext}
`;

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = (payload.history || []).map((entry) => ({
    role: entry.role === 'user' ? 'user' : 'assistant',
    content: entry.text,
  }));
  messages.push({ role: 'user', content: payload.message });

  const historyText = (payload.history || [])
    .map((entry) => entry.text)
    .join(' ');
  const contactText = `${payload.message} ${historyText}`;
  const emailMatch = contactText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phoneMatch = contactText.match(/\+?\d[\d\s-]{6,}\d/)?.[0];
  const intent = scoreLeadIntent({
    text: contactText,
    hasEmail: Boolean(emailMatch),
    hasPhone: Boolean(phoneMatch),
    projectIds: [],
  });

  let reply = '';
  let aiFailure: { error: string; message: string; missing?: string[] } | null = null;
  try {
    reply = await generatePreviewReply(messages, systemPrompt);
  } catch (error: any) {
    console.error('[bot/preview/chat] Actual AI Error:', error);
    if (error instanceof MissingAIKeyError) {
      aiFailure = {
        error: 'missing_api_key',
        message: 'AI is not configured. Set GEMINI_API_KEY to enable preview responses.',
        missing: ['GEMINI_API_KEY'],
      };
    } else {
      aiFailure = {
        error: 'ai_unavailable',
        message: 'AI is temporarily unavailable. Please try again later.',
      };
    }
    reply =
      'Thanks for your message. Share your budget, preferred area, and timeline, and we will follow up.';
  }

  const db = getAdminDb();
  // Save to the 'public' tenant collection for dashboard visibility
  const leadRef = await db.collection('tenants').doc('public').collection('leads').add({
    source: 'preview_chat',
    message: payload.message,
    name: null,
    email: emailMatch || null,
    emailNormalized: normalizeEmail(emailMatch),
    phone: phoneMatch || null,
    phoneNormalized: normalizePhone(phoneMatch),
    intentScore: intent.intent_score,
    intentFocus: intent.focus,
    intentReasoning: intent.reasoning,
    intentProjectIds: [],
    intentNextAction: intent.next_action,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    metadata: {
      requestId,
      context: payload.context
    }
  });
  console.log(
    JSON.stringify({
      event: 'lead.created',
      source: 'preview_chat',
      leadId: leadRef.id,
      requestId,
    })
  );

  const responseData = {
    reply,
    lead_id: leadRef.id,
    intent_score: intent.intent_score,
    focus: intent.focus,
    project_ids: [],
    next_action: intent.next_action,
  };

  if (aiFailure) {
    // Log the failure for the developer but return the fallback reply to the user with 200 OK
    console.error(`[bot/preview/chat] AI Failure: ${aiFailure.message}`, { requestId });
    return respond({ ok: true, data: responseData, requestId });
  }

  return respond({ ok: true, data: responseData, requestId });
}

async function generatePreviewReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  return attemptModel('gemini-2.0-flash', systemPrompt, messages);
}

async function attemptModel(
  modelId: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  const model = resolveModel(modelId);
  try {
    const { text } = await generateText({
      model,
      system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${systemPrompt}`,
      messages,
    });
    return text;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      throw new MissingAIKeyError(error.message);
    }
    throw error;
  }
}

function resolveModel(modelId: string) {
  try {
    return getGoogleModel(modelId);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      throw new MissingAIKeyError(error.message);
    }
    throw error;
  }
}

async function getProjectContext(req: NextRequest, message: string, context?: string) {
  try {
    const cleanQuery = message.replace(/[?]/g, '').trim();
    const relevantProjects = await fetchRelevantProjects(req, cleanQuery || 'Dubai', 8);
    console.log(`[bot/preview/chat] Inventory search for "${message}" found ${relevantProjects.length} projects.`);
    if (!relevantProjects.length) return '';
    return `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`;
  } catch (error) {
    console.error('[bot/preview/chat] inventory context failed', error);
    return '';
  }
}
