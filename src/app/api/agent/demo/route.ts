import { NextRequest } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { generateText } from 'ai';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { mainSystemPrompt } from '@/config/prompts';
import { getAdminDb } from '@/server/firebase-admin';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

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
  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`agent:demo:${ip}`, 30, 60_000))) {
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }
    parsed = requestSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: 'Invalid request payload.',
          details: error.errors,
          requestId,
        },
        { status: 400 }
      );
    }
    return respond(
      { ok: false, error: 'Invalid request payload.', requestId },
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

  const systemPrompt = buildSystemPrompt(parsed.context);

  let reply = '';
  try {
    reply = await generateReply(recentMessages, systemPrompt);
  } catch (error) {
    if (error instanceof MissingAIKeyError) {
      const missing = ['GEMINI_API_KEY'];
      return respond(
        {
          ok: false,
          error: 'missing_api_key',
          message: 'AI is not configured.',
          missing,
          requestId,
        },
        { status: 503 }
      );
    }
    logError(scope, error, { requestId });
    return respond(
      {
        ok: false,
        error: 'ai_unavailable',
        message: 'AI is temporarily unavailable. Please try again shortly.',
        requestId,
      },
      { status: 503 }
    );
  }

  const storedMessages = [...conversation, { role: 'agent', content: reply }];

  try {
    const db = getAdminDb();
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
      ip,
    });
    return respond({
      ok: true,
      data: {
        reply,
        threadId,
        leadIntent,
        history: storedMessages,
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId });
    return respond(
      {
        ok: false,
        error: 'thread_persist_failed',
        message: 'Could not persist conversation.',
        requestId,
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(context?: string) {
  const base = `
Role & Context:
${context || 'Entrestate chat assistant for UAE real estate teams.'}

You are a UAE real estate advisor who explains things clearly and avoids jargon.
Use the listing context below when available and keep answers concise.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
Avoid repetition and keep the conversation flowing naturally.
`;
  return `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.\n${base}`;
}

async function generateReply(
  messages: Array<{ role: 'user' | 'agent'; content: string }>,
  systemPrompt: string
) {
  return attemptModel(FLASH_MODEL, systemPrompt, messages);
}

async function attemptModel(
  modelId: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'agent'; content: string }>
) {
  const model = resolveModel(modelId);
  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages,
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
