export const dynamic = 'force-dynamic';

import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

export async function GET() {
  const scope = 'api/health/env';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
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
