import { NextRequest } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import {
  buildLeadTouchUpdate,
  findExistingLead,
  normalizeEmail,
  normalizePhone,
} from '@/lib/server/lead-dedupe';

const payloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/leads/create';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const db = getAdminDb();
    const emailNormalized = normalizeEmail(payload.email);
    const phoneNormalized = normalizePhone(payload.phone);
    const existingLead = await findExistingLead(db, tenantId, {
      email: emailNormalized,
      phone: phoneNormalized,
    });

    if (existingLead) {
      await existingLead.ref.update(
        buildLeadTouchUpdate({
          name: payload.name,
          email: payload.email,
          phone: payload.phone || null,
          message: payload.message || null,
          source: 'Manual Entry',
        })
      );
      return respond({
        ok: true,
        data: { id: existingLead.id, deduped: true },
        requestId,
      });
    }

    await enforceUsageLimit(db, tenantId, 'leads', 1);
    const leadRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .add({
        tenantId,
        name: payload.name,
        email: payload.email,
        emailNormalized,
        phone: payload.phone || null,
        phoneNormalized,
        message: payload.message || null,
        status: 'New',
        priority: 'Warm',
        source: 'Manual Entry',
        touches: 1,
        lastSeenAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return respond(
      { ok: true, data: { id: leadRef.id, deduped: false }, requestId },
      { status: 201 }
    );
  } catch (error) {
    logError(scope, error, { requestId });
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
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    return errorResponse(requestId, scope);
  }
}
