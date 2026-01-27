import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { mainSystemPrompt } from '@/config/prompts';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  jsonWithRequestId,
} from '@/lib/server/request-id';

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
    jsonWithRequestId(requestId, { ...body, requestId }, init);

  let payload: z.infer<typeof requestSchema> | null = null;
  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`bot:preview:${ip}`, 20, 60_000))) {
      return respond(
        { ok: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    const body = await req.json();
    payload = requestSchema.parse(body);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid request payload.', details: error.errors },
        { status: 400 }
      );
    }
    return respond(
      { ok: false, error: 'Invalid request payload.' },
      { status: 400 }
    );
  }

  const projectContext = await getProjectContext(payload.message, payload.context);
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

  try {
    const reply = await generatePreviewReply(messages, systemPrompt);
    return respond({ ok: true, data: { reply } });
  } catch (error: unknown) {
    logError(scope, error, { requestId });
    if (error instanceof MissingAIKeyError) {
      return respond(
        {
          ok: false,
          error: 'missing_api_key',
          message: 'AI is not configured. Set GEMINI_API_KEY to enable preview responses.',
          missing: ['GEMINI_API_KEY'],
        },
        { status: 503 }
      );
    }
    return respond(
      {
        ok: false,
        error: 'ai_unavailable',
        message: 'AI is temporarily unavailable. Please try again later.',
      },
      { status: 503 }
    );
  }
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

async function getProjectContext(message: string, context?: string) {
  try {
    const relevantProjects = await getRelevantProjects(message, context, 8);
    if (!relevantProjects.length) return '';
    return `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`;
  } catch (error) {
    console.error('[bot/preview/chat] inventory context failed', error);
    return '';
  }
}
