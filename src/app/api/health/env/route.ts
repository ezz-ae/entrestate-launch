import { logError } from '@/lib/server/log';
import { envBool } from '@/lib/env';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const FIREBASE_API_KEY_REGEX = /^AIza[0-9A-Za-z_-]{35}$/;

function hasFirebasePublicConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '';
  if (!FIREBASE_API_KEY_REGEX.test(apiKey)) {
    return false;
  }
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || '';
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || '';
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || '';
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || '';
  return Boolean(authDomain && projectId && storageBucket && messagingSenderId && appId);
}

export async function GET() {
  const scope = 'api/health/env';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const publicFirebaseAuthEnabled = envBool(
      'NEXT_PUBLIC_ENABLE_FIREBASE_AUTH',
      process.env.NODE_ENV === 'production'
    );
    const firebasePublicConfigReady = hasFirebasePublicConfig();
    const firebaseAuthEnabled = publicFirebaseAuthEnabled && firebasePublicConfigReady;
    const supabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );
    const appUrlConfigured = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());
    const rootDomainConfigured = Boolean(process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim());
    const googleAdsConnectConfigured = Boolean(
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_URI
    );
    const facebookAppConfigured = Boolean(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
    const nodeEnvProduction = process.env.NODE_ENV === 'production';
    const onVercel = Boolean(process.env.VERCEL);

    const missing: string[] = [];
    const warnings: string[] = [];
    const reasons: Record<string, string> = {};

    if (publicFirebaseAuthEnabled && !firebasePublicConfigReady) {
      missing.push(
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      );
      reasons.firebasePublicConfigReady = 'Firebase auth enabled but public config is incomplete.';
    }

    if (!supabaseConfigured) {
      warnings.push('NEXT_PUBLIC_SUPABASE_URL or publishable key missing; Supabase client will be mocked.');
      reasons.supabaseConfigured = 'Supabase public credentials are missing.';
    }

    if (!appUrlConfigured) {
      warnings.push('NEXT_PUBLIC_APP_URL missing; using NEXT_PUBLIC_ROOT_DOMAIN fallback.');
      reasons.appUrlConfigured = 'NEXT_PUBLIC_APP_URL is not set.';
    }

    if (!rootDomainConfigured) {
      warnings.push('NEXT_PUBLIC_ROOT_DOMAIN missing; defaulting to entrestate.com.');
      reasons.rootDomainConfigured = 'NEXT_PUBLIC_ROOT_DOMAIN is not set.';
    }

    if (!googleAdsConnectConfigured) {
      warnings.push('Google Ads connect is disabled until NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID and redirect URI are set.');
      reasons.googleAdsConnectConfigured = 'Google Ads OAuth env values are missing.';
    }

    if (!facebookAppConfigured) {
      warnings.push('NEXT_PUBLIC_FACEBOOK_APP_ID missing; Facebook Open Graph tags will be minimal.');
      reasons.facebookAppConfigured = 'Facebook app ID not configured.';
    }

    const ok = missing.length === 0;

    return respond({
      ok,
      flags: {
        publicFirebaseAuthEnabled,
        firebasePublicConfigReady,
        firebaseAuthEnabled,
        supabaseConfigured,
        appUrlConfigured,
        rootDomainConfigured,
        googleAdsConnectConfigured,
        facebookAppConfigured,
        nodeEnvProduction,
        onVercel,
      },
      reasons,
      missing,
      warnings,
      requestId,
    });
  } catch (error) {
    logError(scope, error);
    return errorResponse(requestId, scope);
  }
}
