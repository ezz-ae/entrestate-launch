export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { FLASH_MODEL, getGoogleModel } from '@/lib/ai/google';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const requestSchema = z.object({
  topic: z.string().min(1),
  context: z.string().optional(),
  maxChars: z.number().optional(),
});


const stripNonAscii = (value: string) => value.replace(/[^\x20-\x7E]/g, '').trim();

const clampLength = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return value.slice(0, maxChars).trim();
};

export async function POST(req: NextRequest) {
  const scope = 'api/sms/generate';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`sms:generate:${tenantId}:${ip}`, 30, 60_000))) {
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }
    const payload = requestSchema.parse(await req.json());
    const maxChars = payload.maxChars && payload.maxChars > 0 ? payload.maxChars : 260;

    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system:
        'You write SMS messages for UAE real estate agents. Keep it concise, professional, and clear. No emojis, no hashtags, no jargon.',
      prompt: `Write one SMS about: ${payload.topic}. Context: ${payload.context || 'UAE real estate listings'}. Include a simple call to action.`,
    });

    const sanitized = stripNonAscii(text.replace(/\s+/g, ' '));
    const message = clampLength(sanitized, maxChars);

    return respond({
      ok: true,
      data: { message },
      requestId,
    });
  } catch (error: any) {
    if (
      error instanceof Error &&
      error.message.includes('Google Generative AI API key is not configured')
    ) {
      return respond(
        {
          ok: false,
          error: 'missing_api_key',
          message: 'AI is not configured.',
          missing: ['GEMINI_API_KEY'],
          requestId,
        },
        { status: 503 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
