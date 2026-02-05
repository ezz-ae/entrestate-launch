import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

// Placeholder: Integrate with Vercel or deployment provider
export async function POST(request: NextRequest) {
  const scope = 'api/publish';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const db = getAdminDb();
    const entitlements = await resolveEntitlementsForTenant(db, tenantId);
    if (!entitlements.features.builderPublish.allowed) {
      return respond(
        {
          ok: false,
          error:
            entitlements.features.builderPublish.reason ||
            'Publishing requires an active Builder plan.',
          requestId,
        },
        { status: 403 }
      );
    }
    const { siteId, action } = await request.json();
    if (!siteId || !['publish', 'unpublish'].includes(action)) {
      return respond(
        { ok: false, error: 'Missing or invalid parameters', requestId },
        { status: 400 }
      );
    }
    // Simulate publish/unpublish
    const siteRef = db.collection('sites').doc(siteId);
    await siteRef.set({
      status: action === 'publish' ? 'published' : 'draft',
      publishedAt: action === 'publish' ? new Date() : null,
      updatedAt: new Date(),
    }, { merge: true });
    
    // Note: For dynamic sites (ISR/SSR), updating the database is sufficient to "publish" content.
    // If static generation (SSG) was used, we would call Vercel Deploy Hooks here.
    
    return respond({
      ok: true,
      data: { status: action === 'publish' ? 'published' : 'draft' },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: request.url });
    return errorResponse(requestId, scope);
  }
}
