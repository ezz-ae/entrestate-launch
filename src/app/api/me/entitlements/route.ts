export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';

export async function GET(req: NextRequest) {
  const scope = 'api/me/entitlements';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const entitlements = await resolveEntitlementsForTenant(null, tenantId);
    return respond({ ok: true, data: entitlements, requestId });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
