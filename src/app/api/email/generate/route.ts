export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { generateText } from 'ai';
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

/**
 * AI Email Content Generator
 * COST OPTIMIZED: Switched to 1.5-FLASH
 */


export async function POST(req: NextRequest) {
    const scope = 'api/email/generate';
    const requestId = createRequestId();
    const respond = (body: unknown, init?: ResponseInit) =>
        jsonWithRequestId(requestId, body, init);
    try {
        const { tenantId } = await requireRole(req, ALL_ROLES);
        const ip = getRequestIp(req);
        if (!(await enforceRateLimit(`email:generate:${tenantId}:${ip}`, 20, 60_000))) {
          return respond({ ok: false, error: 'Rate limit exceeded', requestId }, { status: 429 });
        }
        const { topic, context } = await req.json();

        if (!topic) {
            return respond({ ok: false, error: 'Topic required', requestId }, { status: 400 });
        }

        const { text } = await generateText({
            model: getGoogleModel(FLASH_MODEL),
            system: "You are a real estate expert. Write a concise, professional email. Include 'Subject: ' on the first line.",
            prompt: `Email about: ${topic}. Context: ${context}.`,
        });

        const lines = text.split('\n');
        const subjectLine = lines.find(l => l.toLowerCase().includes('subject:')) || 'Subject: Entrestate OS Update';
        const body = text.replace(subjectLine, '').trim();

        return respond({
            ok: true,
            data: {
                subject: subjectLine.replace(/subject:/i, '').trim(),
                body,
            },
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
        logError(scope, error, { requestId });
        return errorResponse(requestId, scope);
    }
}
