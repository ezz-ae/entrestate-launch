import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import {
  checkUsageLimit,
  enforceUsageLimits,
  getBillingSummary,
  getSuggestedUpgrade,
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

const MAX_RECIPIENTS = 50;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const payloadSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  list: z.enum(['imported', 'pilot', 'manual']),
  recipients: z.array(z.string().email()).optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/email/campaign';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  const logger = createApiLogger(req, { route: 'POST /api/email/campaign' });
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
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
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`email:campaign:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
      logger.logRateLimit();
      return respond(
        { ok: false, error: 'Rate limit exceeded', requestId },
        { status: 429 }
      );
    }

    if (!CAP.resend || !resend) {
      logger.logError('Resend not configured', 500);
      return respond(
        { ok: false, error: 'Email provider is not configured', requestId },
        { status: 500 }
      );
    }

    logger.setTenant(tenantId);
    let recipients: string[] = [];

    if (payload.list === 'manual') {
      recipients = payload.recipients || [];
    } else {
      const listTenant = payload.list === 'pilot' ? 'pilot' : tenantId;
      const snapshot = await db
        .collection('contacts')
        .where('tenantId', '==', listTenant)
        .where('channel', '==', 'email')
        .limit(MAX_RECIPIENTS)
        .get();

      recipients = snapshot.docs
        .map((doc: any) => String(doc.data().email || '').trim())
        .filter(Boolean);
    }

    if (!recipients.length) {
      logger.logError('No recipients', 400);
      return respond(
        { ok: false, error: 'No recipients found for this list.', requestId },
        { status: 400 }
      );
    }

    await checkUsageLimit(db, tenantId, 'campaigns');
    await checkUsageLimit(db, tenantId, 'email_sends');
    const summary = await getBillingSummary(db, tenantId);
    const emailLimit = summary.limits.email_sends;
    if (emailLimit !== null && summary.usage.email_sends + recipients.length > emailLimit) {
      throw new PlanLimitError({
        metric: 'email_sends',
        limit: emailLimit,
        currentUsage: summary.usage.email_sends,
        plan: summary.subscription.plan,
        status: summary.subscription.status,
        suggestedUpgrade: getSuggestedUpgrade(summary.subscription.plan),
      });
    }

    const formattedBody = payload.body.replace(/\n/g, '<br/>');
    let sentCount = 0;
    const failures: string[] = [];

    for (const email of recipients) {
      const { error } = await resend.emails.send({
        from: `Entrestate <${fromEmail()}>`,
        to: email,
        subject: payload.subject,
        html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${formattedBody}</div>`,
      });

      if (error) {
        failures.push(email);
      } else {
        sentCount += 1;
      }
    }

    if (sentCount > 0) {
      try {
        await enforceUsageLimits(db, tenantId, [
          { metric: 'campaigns', increment: 1 },
          { metric: 'email_sends', increment: sentCount },
        ]);
      } catch (usageError) {
        console.error('[email/campaign] usage update failed', usageError);
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
