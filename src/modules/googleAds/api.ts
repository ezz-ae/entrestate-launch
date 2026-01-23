import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { FIREBASE_AUTH_ENABLED, IS_GOOGLE_ADS_ENABLED } from '@/lib/server/env';
import { FeatureAccessError, featureAccessErrorResponse } from '@/lib/server/billing';
import { FirestoreUnavailableError } from '@/server/googleAds/repo';

export function errorResponse(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function guardGoogleAdsEnabled() {
  if (!IS_GOOGLE_ADS_ENABLED) {
    return errorResponse('GOOGLE_ADS_DISABLED', 'Google Ads is not enabled.', 501);
  }
  return null;
}

export async function requireGoogleAdsAccess(req: NextRequest) {
  const roles = FIREBASE_AUTH_ENABLED ? ALL_ROLES : [...ALL_ROLES, 'public'];
  return requireRole(req, roles);
}

export function handleGoogleAdsError(error: unknown, fallbackMessage: string) {
  if (error instanceof z.ZodError) {
    return errorResponse('INVALID_PAYLOAD', 'Invalid request payload.', 400, error.errors);
  }
  if (error instanceof FeatureAccessError) {
    return NextResponse.json(featureAccessErrorResponse(error), { status: 403 });
  }
  if (error instanceof UnauthorizedError) {
    return errorResponse('UNAUTHORIZED', 'Unauthorized.', 401);
  }
  if (error instanceof ForbiddenError) {
    return errorResponse('FORBIDDEN', 'Forbidden.', 403);
  }
  if (error instanceof FirestoreUnavailableError) {
    return errorResponse('FIRESTORE_UNAVAILABLE', 'Firestore is not configured.', 503);
  }
  return errorResponse('SERVER_ERROR', fallbackMessage, 500);
}
