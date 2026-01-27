import { NextRequest } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, getRequestIp } from '@/lib/rate-limit';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { createApiLogger } from '@/lib/logger';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  checkUsageLimit,
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';
import { FIREBASE_AUTH_ENABLED, IS_SMS_ENABLED } from '@/lib/server/env';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const payloadSchema = z.object({
  to: z.string().min(5),
  message: z.string().min(1).max(800),
  siteId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/sms/send';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  const enableDev = !FIREBASE_AUTH_ENABLED || process.env.NODE_ENV !== 'production';
  if (!IS_SMS_ENABLED && !enableDev) {
    return respond(
      { ok: false, error: 'SMS is not enabled.', requestId },
      { status: 501 }
    );
  }
  const logger = createApiLogger(req, { route: 'POST /api/sms/send' });
  try {
    const { tenantId, uid } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    const entitlements = await resolveEntitlementsForTenant(db, tenantId);
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
    if (!IS_SMS_ENABLED) {
      // Dev-mode simulation for SMS
      logger.setTenant(tenantId);
      logger.setActor(uid);
      logger.logSuccess(200, { simulated: true });
      return respond({
        ok: true,
        data: { simulated: true, sid: `dev-sms-${Date.now()}` },
        requestId,
      });
    }
    if (!CAP.twilio || !ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
      if (enableDev) {
        logger.setTenant(tenantId);
        logger.setActor(uid);
        logger.logSuccess(200, { simulated: true, note: 'twilio missing' });
        return respond({
          ok: true,
          data: { simulated: true, sid: `dev-sms-${Date.now()}` },
          requestId,
        });
      }
      logger.logError('Twilio not configured', 500);
      return respond(
        { ok: false, error: 'Twilio is not configured', requestId },
        { status: 500 }
      );
    }

    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`sms:send:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
      logger.logRateLimit();
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }

    const payload = payloadSchema.parse(await req.json());
    await checkUsageLimit(db, tenantId, 'sms_sends');
    logger.setTenant(tenantId);
    logger.setActor(uid);

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: payload.to,
        From: FROM_NUMBER,
        Body: payload.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.logError('Twilio send failed', 500, { twilioStatus: data?.status });
      return respond(
        { ok: false, error: 'Twilio send failed', details: data, requestId },
        { status: 500 }
      );
    }

    try {
      await enforceUsageLimit(db, tenantId, 'sms_sends', 1);
    } catch (usageError) {
      // SMS already sent; log and continue without failing the request.
      logger.logError(usageError, 200, { metric: 'sms_sends' });
    }

    logger.logSuccess(200, { to: payload.to });
    return respond({
      ok: true,
      data: { sid: data?.sid, to: payload.to },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId });
    logger.logError(error);
    if (error instanceof PlanLimitError) {
      return respond(
        { ok: false, requestId, ...planLimitErrorResponse(error) },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond(
        { ok: false, error: 'Unauthorized', requestId },
        { status: 401 }
      );
    }
    if (error instanceof ForbiddenError) {
      return respond(
        { ok: false, error: 'Forbidden', requestId },
        { status: 403 }
      );
    }
    return errorResponse(requestId, scope);
  }
}
