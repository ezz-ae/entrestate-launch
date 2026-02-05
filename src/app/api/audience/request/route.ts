export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  FeatureAccessError,
  featureAccessErrorResponse,
} from '@/lib/server/billing';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const payloadSchema = z.object({
  listType: z.enum(['imported', 'pilot']),
  goal: z.string().min(1),
  region: z.string().min(1),
  budget: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const scope = 'api/audience/request';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('audience_requests')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return respond({ ok: true, data: { request: null }, requestId });
    }

    const doc = snapshot.docs[0];
    return respond({
      ok: true,
      data: { request: { id: doc.id, ...doc.data() } },
      requestId,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}

export async function POST(req: NextRequest) {
  const scope = 'api/audience/request';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const db = getAdminDb();
    const requestRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('audience_requests')
      .doc();

    const requestData = {
      listType: payload.listType,
      goal: payload.goal,
      region: payload.region,
      budget: payload.budget ?? null,
      notes: payload.notes ?? null,
      status: 'requested',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await requestRef.set(requestData);

    return respond({
      ok: true,
      data: { request: { id: requestRef.id, ...requestData } },
      requestId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof FeatureAccessError) {
      return respond(
        { ok: false, requestId, ...featureAccessErrorResponse(error) },
        { status: 403 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
