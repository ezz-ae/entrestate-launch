export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import {
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { prisma } from '@/server/db';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const MAX_RECIPIENTS = 50;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const payloadSchema = z.object({
  message: z.string().min(1).max(800),
  list: z.enum(['imported', 'pilot', 'manual']),
  recipients: z.array(z.string().min(5)).optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/sms/campaign';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  const logger = createApiLogger(req, { route: 'POST /api/sms/campaign' });
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const entitlements = await resolveEntitlementsForTenant(null, tenantId);
    if (!entitlements.features.senders.allowed) {
      return respond(
        {
          ok: false,
          error:
            entitlements.features.senders.reason ||
            'SMS senders are locked on your plan.',
          requestId,
        },
        { status: 403 }
      );
    }
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`sms:campaign:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
      logger.logRateLimit();
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }

    if (!CAP.twilio || !ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
      logger.logError('Twilio not configured', 500);
      return respond(
        { ok: false, error: 'SMS provider is not configured', requestId },
        { status: 500 }
      );
    }

    let recipients: string[] = [];
    logger.setTenant(tenantId);

    if (payload.list === 'manual') {
      recipients = payload.recipients || [];
    } else {
      const listTenant = payload.list === 'pilot' ? 'pilot' : tenantId;
      const contacts = await prisma.contact.findMany({
        where: { tenantId: listTenant, channel: 'sms' },
        take: MAX_RECIPIENTS,
      });
      recipients = contacts
        .map((contact) => String(contact.phone || '').trim())
        .filter(Boolean);
    }

    if (!recipients.length) {
      logger.logError('No recipients', 400);
      return respond(
        { ok: false, error: 'No recipients found for this list.', requestId },
        { status: 400 }
      );
    }

    let sentCount = 0;
    const failures: string[] = [];

    for (const phone of recipients) {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: FROM_NUMBER,
          Body: payload.message,
        }),
      });

      if (!response.ok) {
        failures.push(phone);
      } else {
        sentCount += 1;
      }
    }

    logger.logSuccess(200, {
      sentCount,
      failedCount: failures.length,
      requestedCount: recipients.length,
    });
    return respond({
      ok: true,
      data: {
        list: payload.list,
        sentCount,
        requestedCount: recipients.length,
        failedCount: failures.length,
        limited: recipients.length >= MAX_RECIPIENTS,
      },
      requestId,
    });
  } catch (error) {
    if (error instanceof PlanLimitError) {
      logger.logError(error, 402, { metric: error.metric, limit: error.limit });
      return respond(
        { ok: false, requestId, ...planLimitErrorResponse(error) },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      logger.logError(error, 400, { validation_errors: error.errors });
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError) {
      logger.logError(error, 401);
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.logError(error, 403);
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    logError(scope, error, { requestId });
    logger.logError(error, 500);
    return errorResponse(requestId, scope);
  }
}
