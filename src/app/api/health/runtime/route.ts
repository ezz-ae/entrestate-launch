import { NextRequest } from 'next/server';
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
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

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

    const firebaseAuthEnabledServer = envBool(
      'ENABLE_FIREBASE_AUTH',
      process.env.NODE_ENV === 'production'
    );

    const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
    const hasResend = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.FROM_EMAIL?.trim());
    const hasTwilio = Boolean(
      process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        process.env.TWILIO_FROM_NUMBER?.trim()
    );
    const hasHubspot = Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());
    const hasVercelPublish = Boolean(
      process.env.VERCEL_API_TOKEN?.trim() && process.env.VERCEL_PROJECT_ID?.trim()
    );
    const hasAwsUpload = Boolean(
      process.env.AWS_ACCESS_KEY_ID?.trim() &&
        process.env.AWS_SECRET_ACCESS_KEY?.trim() &&
        process.env.AWS_BUCKET_NAME?.trim() &&
        process.env.AWS_REGION?.trim()
    );

    const missing: string[] = [];
    const warnings: string[] = [];
    const reasons: Record<string, string> = {};

    if (!hasFirebaseAdminCreds) {
      missing.push('FIREBASE_ADMIN_CREDENTIALS or FIREBASE_ADMIN_* keys');
      reasons.hasFirebaseAdminCreds = 'Firebase admin credentials are missing.';
    }

    if (!hasGemini) {
      missing.push('GEMINI_API_KEY');
      reasons.hasGemini = 'AI chat replies require GEMINI_API_KEY.';
    }

    if (!hasResend) {
      warnings.push('RESEND_API_KEY or FROM_EMAIL missing; email notifications are disabled.');
      reasons.hasResend = 'Email provider configuration missing.';
    }

    if (!hasTwilio) {
      warnings.push('Twilio credentials missing; SMS notifications are disabled.');
      reasons.hasTwilio = 'SMS provider configuration missing.';
    }

    if (!hasVercelPublish) {
      warnings.push('Vercel publish credentials missing; domain publishing is disabled.');
      reasons.hasVercelPublish = 'Missing Vercel API token or project ID.';
    }

    if (!hasAwsUpload) {
      warnings.push('AWS upload credentials missing; brochure upload storage is disabled.');
      reasons.hasAwsUpload = 'Missing AWS S3 credentials or bucket/region.';
    }

    const ok = missing.length === 0;

    return respond({
      ok,
      flags: {
        hasFirebaseAdminCreds,
        hasFirebasePublicConfigReady,
        hasSupabasePublic,
        hasAppUrl,
        firebaseAuthEnabledServer,
        firebaseAuthEnabledPublic,
        hasGemini,
        hasResend,
        hasTwilio,
        hasHubspot,
        hasVercelPublish,
        hasAwsUpload,
      },
      reasons,
      missing,
      warnings,
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path });
    return errorResponse(requestId, scope);
  }
}
