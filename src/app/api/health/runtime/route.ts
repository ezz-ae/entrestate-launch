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

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '';
    const apiKeyLooksValid = /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey);
    const hasFirebasePublicConfigReady =
      apiKeyLooksValid &&
      Boolean(
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      );

    const hasSupabasePublic =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

    const hasAppUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());

    const firebaseAuthEnabledPublic = envBool(
      'NEXT_PUBLIC_ENABLE_FIREBASE_AUTH',
      process.env.NODE_ENV === 'production'
    );

    return jsonWithRequestId(requestId, {
      hasFirebaseAdminCreds,
      hasFirebasePublicConfigReady,
      hasSupabasePublic,
      hasAppUrl,
      firebaseAuthEnabledServer: FIREBASE_AUTH_ENABLED,
      firebaseAuthEnabledPublic,
    });
  } catch (error) {
    logError(scope, error, { requestId, path });
    return errorResponse(requestId, scope);
  }
}
