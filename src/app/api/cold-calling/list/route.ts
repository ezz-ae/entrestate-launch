import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const MAX_RESULTS = 100;

export async function GET(req: NextRequest) {
  const scope = 'api/cold-calling/list';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('cold_call_leads')
      .orderBy('updatedAt', 'desc')
      .limit(MAX_RESULTS)
      .get();

    const items: Array<{ id: string; status?: string }> = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { status?: string }),
    }));
    const ignoredCount = items.filter((item) => item.status === 'ignored').length;

    return respond({
      ok: true,
      data: {
        items,
        returnedCount: items.length,
        ignoredCount,
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
