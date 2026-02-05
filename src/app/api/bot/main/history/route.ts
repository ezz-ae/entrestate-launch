export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';

export async function GET(req: NextRequest) {
  const scope = 'api/bot/main/history';
  const requestId = createRequestId();
  const path = req.url;
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('chatThreads')
      .orderBy('updatedAt', 'desc')
      .limit(20)
      .get();
    const threads = snapshot.docs.map((doc) => doc.data());
    return respond({ ok: true, data: { threads }, requestId });
  } catch (error) {
    logError(scope, error, { url: path, requestId });
    return errorResponse(requestId, scope);
  }
}
