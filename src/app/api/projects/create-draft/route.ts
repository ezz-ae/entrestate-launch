import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';

const CLAMP = (value?: string, fallback = 'Untitled Project'): string =>
  (value?.trim()?.slice(0, 100) || fallback);

export async function POST(req: NextRequest) {
  const scope = 'api/projects/create-draft';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const body = await req.json().catch(() => ({}));
    const db = getAdminDb();
    const now = new Date().toISOString();
    const draftRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('drafts')
      .doc();

    const draft = {
      id: draftRef.id,
      owner: tenantId,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      title: CLAMP(body?.title || body?.prompt),
      prompt: body?.prompt || null,
    };

    await draftRef.set(draft);

    return respond({ ok: true, data: { draftId: draftRef.id, draft }, requestId });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
