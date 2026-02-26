export const dynamic = 'force-dynamic';

import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { verifyFirebaseIdToken } from '@/lib/server/auth';

export async function GET(req: Request) {
  const scope = 'api/auth/me';
  const requestId = createRequestId();
  const path = req.url;
  try {
    try {
      const { uid, email, claims } = await verifyFirebaseIdToken(req);
      const rolesArray = Array.isArray(claims.roles)
        ? claims.roles
        : claims.role
        ? [claims.role]
        : [];

      return jsonWithRequestId(requestId, {
        user: { uid, email, roles: rolesArray },
        mode: claims.dev ? 'dev' : 'authenticated',
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[api/auth/me] token verification failed', error);
      }
    }

    return jsonWithRequestId(requestId, { user: null, mode: 'anonymous' });
  } catch (error) {
    logError(scope, error, { requestId, path });
    return errorResponse(requestId, scope);
  }
}
