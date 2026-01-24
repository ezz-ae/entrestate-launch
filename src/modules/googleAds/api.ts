import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES, PUBLIC_ROLES } from '@/lib/server/roles';
import { FIREBASE_AUTH_ENABLED, IS_GOOGLE_ADS_ENABLED } from '@/lib/server/env';
import { FeatureAccessError, featureAccessErrorResponse } from '@/lib/server/billing';
import { FirestoreUnavailableError } from '@/server/googleAds/repo';
import { logError } from '@/lib/server/log';

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
  scope?: string
) {
  const body: Record<string, unknown> = { error: { code, message } };
  if (details) {
    (body.error as Record<string, unknown>).details = details;
  }
  if (scope) {
    body.scope = scope;
  }
  return NextResponse.json(body, { status });
}

export function guardGoogleAdsEnabled() {
  if (!IS_GOOGLE_ADS_ENABLED) {
    return errorResponse('GOOGLE_ADS_DISABLED', 'Google Ads is not enabled.', 501, undefined, 'api/google-ads');
  }
  return null;
}

export async function requireGoogleAdsAccess(req: NextRequest) {
  const roles = FIREBASE_AUTH_ENABLED ? ALL_ROLES : [...ALL_ROLES, ...PUBLIC_ROLES];
  return requireRole(req, roles);
}

export function handleGoogleAdsError(
  error: unknown,
  fallbackMessage: string,
  scope: string = 'api/google-ads'
) {
  logError(scope, error);
  if (error instanceof z.ZodError) {
    return errorResponse('INVALID_PAYLOAD', 'Invalid request payload.', 400, error.errors, scope);
  }
  if (error instanceof FeatureAccessError) {
    return NextResponse.json(featureAccessErrorResponse(error), { status: 403 });
  }
  if (error instanceof UnauthorizedError) {
    return errorResponse('UNAUTHORIZED', 'Unauthorized.', 401, undefined, scope);
  }
  if (error instanceof ForbiddenError) {
    return errorResponse('FORBIDDEN', 'Forbidden.', 403, undefined, scope);
  }
  if (error instanceof FirestoreUnavailableError) {
    return errorResponse('FIRESTORE_UNAVAILABLE', 'Firestore is not configured.', 503, undefined, scope);
  }
  return NextResponse.json({ ok: false, error: 'INTERNAL', scope }, { status: 500 });
}
