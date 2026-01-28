import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
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
Role & Context:
${payload.context || 'Entrestate chat assistant for UAE real estate teams.'}

You are a UAE real estate advisor who explains things clearly and avoids technical jargon.
Use the listing context below when available and keep answers concise.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
Avoid repetition and try to keep the conversation flowing naturally, providing diverse responses.
${projectContext}
`;

  const messages = (payload.history || []).map((entry) => ({
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
  } catch (error: unknown) {
    logError(scope, error, { requestId });
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
  const leadRef = await db.collection('public_leads').add({
    source: 'preview_chat',
    message: payload.message,
    email: emailMatch || null,
    phone: phoneMatch || null,
    intentScore: intent.intent_score,
    intentFocus: intent.focus,
    intentReasoning: intent.reasoning,
    intentProjectIds: [],
    intentNextAction: intent.next_action,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
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
    return respond(
      {
        ok: false,
        error: {
          code: aiFailure.error,
          message: aiFailure.message,
          missing: aiFailure.missing,
        },
        data: responseData,
        requestId,
      },
      { status: 503 }
    );
  }

  return respond({ ok: true, data: responseData, requestId });
}

async function generatePreviewReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  return attemptModel(FLASH_MODEL, systemPrompt, messages);
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
    const relevantProjects = await fetchRelevantProjects(req, `${message} ${context || ''}`, 8);
    if (!relevantProjects.length) return '';
    return `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`;
  } catch (error) {
    console.error('[bot/preview/chat] inventory context failed', error);
    return '';
  }
}
