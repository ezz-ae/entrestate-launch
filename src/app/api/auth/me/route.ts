export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';
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
    const hasClientConfig = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
    if (!FIREBASE_AUTH_ENABLED || !hasClientConfig) {
      return jsonWithRequestId(requestId, { user: null, mode: 'guest' });
    }

    const cookieHeader = req.headers.get('cookie') || '';
    let devUser: string | null = null;
    let devUid: string | null = null;
    let devRoles: string | null = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map((c) => c.trim());
      for (const c of cookies) {
        if (c.startsWith('dev_user=')) devUser = decodeURIComponent(c.slice('dev_user='.length));
        if (c.startsWith('dev_uid=')) devUid = decodeURIComponent(c.slice('dev_uid='.length));
        if (c.startsWith('dev_roles=')) devRoles = decodeURIComponent(c.slice('dev_roles='.length));
      }
    }

    try {
      const { uid, email, claims } = await verifyFirebaseIdToken(req);
      const roles = Array.isArray(claims.roles)
        ? (claims.roles as string[])
        : typeof claims.roles === 'string'
        ? claims.roles.split(',').map((role) => role.trim()).filter(Boolean)
        : [];

      const normalizedRoles = roles.length ? roles : [];

      return jsonWithRequestId(requestId, {
        user: { uid, email, roles: normalizedRoles },
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
