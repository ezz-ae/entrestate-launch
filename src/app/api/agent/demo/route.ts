import { NextRequest } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { generateText } from 'ai';
import type { ModelMessage } from 'ai';
import { getGoogleModel } from '@/lib/ai/google';
import { formatProjectContext } from '@/server/inventory';
import { fetchRelevantProjects } from '@/lib/server/inventory-search';
import { mainSystemPrompt } from '@/config/prompts';
import { getAdminDb } from '@/server/firebase-admin';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { logError } from '@/lib/server/log';
import { FieldValue } from 'firebase-admin/firestore';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { scoreLeadIntent } from '@/lib/server/lead-intent';
import { requireRole } from '@/server/auth';
import { enforceUsageLimit, PlanLimitError, planLimitErrorResponse } from '@/lib/server/billing';
import { normalizeEmail, normalizePhone } from '@/lib/server/lead-dedupe';

const NIL_HISTORY: Array<{ role: 'user' | 'agent'; content: string }> = [];

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

const LEAD_INTENT_KEYWORDS = [
  'interested',
  'ready to buy',
  'contact',
  'call me',
  'whatsapp',
  'email me',
  'book',
  'visit',
  'show me',
  'proposal',
  'quote',
  'price',
  'schedule',
  'demo',
  'send brochure',
  'rate',
  'availability',
  'call back',
  'follow up',
];

class MissingAIKeyError extends Error {}

export async function POST(req: NextRequest) {
  const scope = 'api/agent/demo';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  let parsed: z.infer<typeof requestSchema> | null = null;
  let ip: string | null = null;
  try {
    ip = getRequestIp(req);
    if (!(await enforceRateLimit(`agent:demo:${ip}`, 30, 60_000))) {
      return respond(
        {
          ok: false,
          error: { code: 'rate_limited', message: 'Rate limit exceeded' },
          requestId,
        },
        { status: 429 }
      );
    }
    parsed = requestSchema.parse(await req.json());

    // Enforce usage limits for the 'ai_conversations' metric
    try {
      const { tenantId } = await requireRole(req, ['agent', 'agency_admin', 'super_admin']);
      const db = getAdminDb();
      await enforceUsageLimit(db, tenantId, 'ai_conversations');
    } catch (error) {
      if (error instanceof PlanLimitError) {
        return respond(planLimitErrorResponse(error), { status: 402 });
      }
      // If auth fails (public demo), we rely on the rate limit above
    }
  } catch (error) {
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

  const history = (parsed.history || []).map((entry) => ({
    role: entry.role,
    content: entry.text,
  }));
  const conversation: Array<{ role: 'user' | 'agent'; content: string }> = [
    ...history,
    { role: 'user', content: parsed.message },
  ];
  const recentMessages = conversation.slice(-6);

  const leadIntent = analyzeLeadIntent(
    conversation.map((entry) => entry.content)
  );
  const contactText = conversation.map((entry) => entry.content).join(' ');
  const emailMatch = contactText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phoneMatch = contactText.match(/\+?\d[\d\s-]{6,}\d/)?.[0];
  const intent = scoreLeadIntent({
    text: contactText,
    hasEmail: Boolean(emailMatch),
    hasPhone: Boolean(phoneMatch),
    projectIds: [],
  });

  const projectContext = await getProjectContext(req, parsed.message, parsed.context);
  const systemPrompt = buildSystemPrompt(parsed.context, projectContext);

  let reply = '';
  let aiFailure: { error: string; message: string; missing?: string[] } | null = null;
  try {
    reply = await generateReply(recentMessages, systemPrompt);
  } catch (error: any) {
    console.error('[api/agent/demo] Actual AI Error:', error);
    if (error instanceof MissingAIKeyError) {
      aiFailure = {
        error: 'missing_api_key',
        message: 'AI is not configured.',
        missing: ['GEMINI_API_KEY'],
      };
    } else {
      aiFailure = {
        error: 'ai_unavailable',
        message: 'AI is temporarily unavailable. Please try again shortly.',
      };
    }
  }

  if (aiFailure) {
    reply =
      'Thanks for reaching out. Share your budget, preferred area, and timeline, and I will follow up.';
  }

  const storedMessages = [...conversation, { role: 'agent', content: reply }];
  let leadId: string | null = null;
  const db = getAdminDb();
  try {
    const now = new Date().toISOString();
    const threadId = nanoid();
    await db.collection('public_agent_threads').doc(threadId).set({
      id: threadId,
      messages: storedMessages.map((entry) => ({ role: entry.role, text: entry.content })),
      leadIntent: leadIntent.flag,
      leadIntentReason: leadIntent.reason ?? null,
      context: parsed.context || null,
      lastUserMessage: parsed.message,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      ip: ip ?? 'unknown',
    });

    // Save to the 'public' tenant collection so it appears in the dashboard during dev bypass
    const leadRef = await db.collection('tenants').doc('public').collection('leads').add({
      threadId,
      source: 'agent_demo',
      message: parsed.message,
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
        userAgent: req.headers.get('user-agent'),
      }
    });
    leadId = leadRef.id;
    console.log(
      JSON.stringify({
        event: 'lead.created',
        source: 'agent_demo',
        leadId,
        requestId,
      })
    );

    const responseData = {
      reply,
      threadId,
      leadIntent,
      lead_id: leadId,
      intent_score: intent.intent_score,
      focus: intent.focus,
      project_ids: [],
      next_action: intent.next_action,
      history: storedMessages,
    };

    if (aiFailure) {
      // Log the failure for the developer but return the fallback reply to the user with 200 OK
      console.error(`[api/agent/demo] AI Failure: ${aiFailure.message}`, { requestId });
      return respond({ ok: true, data: responseData, requestId });
    }

    return respond({
      ok: true,
      data: responseData,
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}

function buildSystemPrompt(context?: string, projectContext?: string) {
  const base = `
Persona: 25-Year UAE Real Estate Expert
Context: ${context || 'General UAE Real Estate Market'}

You are a highly experienced UAE Real Estate Advisor with over 25 years of deep market expertise. 
Your tone is professional, authoritative, and insightful. You provide high-value advice, not just data.

Guidelines:
1. For general market inquiries (ROI, areas, visas, fees), provide expert-level insights based on your 25 years of experience.
2. Always clarify that pricing and availability are estimates and should be confirmed with a broker.
3. Keep responses concise but packed with value. Avoid generic "AI assistant" phrasing.
4. If the user shows intent, ask for their Name and WhatsApp/Email to send a brochure or schedule a viewing.
5. Ask only one follow-up question at a time to maintain a natural conversation flow.

${projectContext || ''}
`;
  return `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${base}`;
}

async function generateReply(
  messages: Array<{ role: 'user' | 'agent'; content: string }>,
  systemPrompt: string
) {
  return attemptModel('gemini-2.0-flash', systemPrompt, messages);
}

async function attemptModel(
  modelId: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'agent'; content: string }>
) {
  const model = resolveModel(modelId);
  const modelMessages: ModelMessage[] = messages.map((message) => ({
    role: message.role === 'agent' ? 'assistant' : 'user',
    content: message.content,
  }));
  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages: modelMessages,
    });
    return text.trim();
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

function analyzeLeadIntent(candidates: string[]) {
  const normalized = candidates
    .map((value) => value.toLowerCase())
    .join(' ');
  for (const keyword of LEAD_INTENT_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return { flag: true, reason: `Detected intent: ${keyword}` };
    }
  }
  const phoneMatch = normalized.match(/\b\d{7,}\b/);
  if (phoneMatch) {
    return { flag: true, reason: 'Phone number detected' };
  }
  return { flag: false };
}

async function getProjectContext(req: NextRequest, message: string, context?: string) {
  try {
    // Clean the message to remove short words/punctuation for better search results
    const cleanQuery = message.replace(/[?]/g, '').trim();
    const relevantProjects = await fetchRelevantProjects(req, cleanQuery || 'Dubai', 8);
    console.log(`[api/agent/demo] Inventory search for "${message}" found ${relevantProjects.length} projects.`);
    if (!relevantProjects.length) return '';
    return `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`;
  } catch (error) {
    console.error('[api/agent/demo] inventory context failed', error);
    return '';
  }
}
