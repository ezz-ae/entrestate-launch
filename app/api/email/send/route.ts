'use server';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, getRequestIp } from '@/lib/rate-limit';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { createApiLogger } from '@/lib/logger';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  checkUsageLimit,
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';
import { FIREBASE_AUTH_ENABLED, IS_EMAIL_ENABLED } from '@/lib/server/env';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const payloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const scope = 'api/email/send';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  // Allow simulated sends in dev when email provider isn't configured.
  const enableDev = !FIREBASE_AUTH_ENABLED || process.env.NODE_ENV !== 'production';
  if (!IS_EMAIL_ENABLED && !enableDev) {
    return respond(
      { ok: false, error: 'Email is not enabled.', requestId },
      { status: 501 }
    );
  }
  const logger = createApiLogger(req, { route: 'POST /api/email/send' });
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
            'Email senders are locked on your plan.',
          requestId,
        },
        { status: 403 }
      );
    }
    if (!IS_EMAIL_ENABLED) {
      // Dev-mode simulation: log and return a fake messageId so the UI can proceed.
      logger.setTenant(tenantId);
      logger.setActor(uid);
      logger.logSuccess(200, { simulated: true });
      return respond({
        ok: true,
        data: { simulated: true, messageId: `dev-email-${Date.now()}` },
        requestId,
      });
    }
    if (!CAP.resend || !resend) {
      // If running in dev allow simulated sends even when the provider integration
      // isn't present so local QA can exercise flows.
      if (enableDev) {
        logger.setTenant(tenantId);
        logger.setActor(uid);
        logger.logSuccess(200, { simulated: true, note: 'resend missing' });
        return respond({
          ok: true,
          data: { simulated: true, messageId: `dev-email-${Date.now()}` },
          requestId,
        });
      }
      logger.logError('Resend not configured', 500);
      return respond(
        { ok: false, error: 'Email provider is not configured', requestId },
        { status: 500 }
      );
    }

    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`email:send:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
      logger.logRateLimit();
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }

    const payload = payloadSchema.parse(await req.json());
    await checkUsageLimit(db, tenantId, 'email_sends');
    logger.setTenant(tenantId);
    logger.setActor(uid);

    const { data, error } = await resend.emails.send({
      from: `Entrelead <${fromEmail()}>`,
      to: payload.to,
      subject: payload.subject,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${payload.body}</div>`,
    });

    if (error) {
      logger.logError(new Error(error.message), 500, { provider: 'resend', details: error });
      return respond(
        { ok: false, error: 'Failed to send email', details: error, requestId },
        { status: 500 }
      );
    }

    try {
      await enforceUsageLimit(db, tenantId, 'email_sends', 1);
    } catch (usageError) {
      // Email already sent; log and continue without failing the request.
      logger.logError(usageError, 200, { metric: 'email_sends' });
    }
    
    logger.logSuccess(200, { to: payload.to, resend_id: data?.id });
    return respond({
      ok: true,
      data: { messageId: data?.id },
      requestId,
    });

  } catch (error: any) {
    if (error instanceof PlanLimitError) {
      logger.logError(error, 402, { metric: error.metric, limit: error.limit });
      return respond(
        { ok: false, requestId, ...planLimitErrorResponse(error) },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      logger.logError(error, 400, { validation_errors: error.errors })
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError) {
        logger.logError(error, 401)
      return respond(
        { ok: false, error: 'Unauthorized', requestId },
        { status: 401 }
      );
    }
    if (error instanceof ForbiddenError) {
        logger.logError(error, 403)
      return respond(
        { ok: false, error: 'Forbidden', requestId },
        { status: 403 }
      );
    }

    logError(scope, error, { requestId });
    logger.logError(error, 500);
    return errorResponse(requestId, scope);
  }
}
