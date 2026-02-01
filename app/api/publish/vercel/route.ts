
import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  checkUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
  recordTrialEvent,
} from '@/lib/server/billing';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const normalizeDomain = (domain: string) => domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export async function POST(request: NextRequest) {
  const scope = 'api/publish/vercel';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { siteId } = await request.json();
    if (!siteId) {
      return respond({ ok: false, error: 'Site ID is required', requestId }, { status: 400 });
    }

    const { tenantId, uid } = await requireRole(request, ALL_ROLES);
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
    const siteRef = db.collection('sites').doc(siteId);
    const siteSnap = await siteRef.get();

    if (!siteSnap.exists) {
      return respond({ ok: false, error: 'Site not found', requestId }, { status: 404 });
    }

    const siteData = siteSnap.data() || {};
    const ownerUid = siteData.ownerUid as string | undefined;
    const siteTenantId = siteData.tenantId as string | undefined;
    if (siteTenantId && siteTenantId !== tenantId) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    if (!siteTenantId && ownerUid && ownerUid !== uid) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }

    const rootDomain = normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com');
    const siteDomain = normalizeDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${rootDomain}`);
    const existingSubdomain = typeof siteData.subdomain === 'string' ? siteData.subdomain : '';
    const suffix = siteId.slice(0, 4);
    const baseSlug = slugify(String(siteData.title || 'site'));
    const subdomain = existingSubdomain || (baseSlug ? `${baseSlug}-${suffix}` : `site-${suffix}`);
    const customDomain = typeof siteData.customDomain === 'string' ? siteData.customDomain : '';
    const publishedUrl = customDomain ? `https://${customDomain}` : `https://${subdomain}.${siteDomain}`;

    await checkUsageLimit(db, tenantId, 'landing_pages');

    await siteRef.set(
      {
        published: true,
        publishedUrl,
        subdomain,
        lastPublishedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await recordTrialEvent(db, tenantId, 'landing_page_published');

    return respond({
      ok: true,
      data: {
        siteId,
        publishedUrl,
        subdomain,
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: request.url });
    if (error instanceof PlanLimitError) {
      return respond(
        { ok: false, requestId, ...planLimitErrorResponse(error) },
        { status: 402 }
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
