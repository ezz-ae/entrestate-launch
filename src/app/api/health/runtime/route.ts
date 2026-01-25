import { NextRequest } from 'next/server';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';
import { envBool } from '@/lib/env';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

export async function GET(req: NextRequest) {
  const scope = 'api/health/runtime';
  const requestId = createRequestId();
  const path = req.url;

  try {
    const hasFirebaseAdminCreds =
      Boolean(process.env.FIREBASE_ADMIN_CREDENTIALS) ||
      Boolean(
        (process.env.FIREBASE_ADMIN_PROJECT_ID ||
          process.env.FIREBASE_PROJECT_ID ||
          process.env.project_id) &&
          (process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
            process.env.FIREBASE_CLIENT_EMAIL ||
            process.env.client_email) &&
          (process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
            process.env.FIREBASE_PRIVATE_KEY ||
            process.env.private_key)
      );

    const hasSupabasePublic =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

    const hasAppUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());

    const firebaseAuthPublic = envBool(
      'NEXT_PUBLIC_ENABLE_FIREBASE_AUTH',
      process.env.NODE_ENV === 'production'
    );

    return jsonWithRequestId(requestId, {
      hasFirebaseAdminCreds,
      hasSupabasePublic,
      hasAppUrl,
      firebaseAuthEnabled: {
        server: FIREBASE_AUTH_ENABLED,
        public: firebaseAuthPublic,
      },
    });
  } catch (error) {
    logError(scope, error, { requestId, path });
    return errorResponse(requestId, scope);
  }
}
