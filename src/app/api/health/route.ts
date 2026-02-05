export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { SUPER_ADMIN_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

export async function GET(req: NextRequest) {
  const scope = 'api/health';
  const requestId = createRequestId();
  const path = req.url;
  try {
    await requireRole(req, SUPER_ADMIN_ROLES);
  } catch (error) {
    logError(scope, error, { phase: 'auth', requestId, path });
    if (error instanceof UnauthorizedError) {
      return jsonWithRequestId(requestId, { error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return jsonWithRequestId(requestId, { error: 'Forbidden' }, { status: 403 });
    }
    return jsonWithRequestId(requestId, { error: 'Unauthorized' }, { status: 401 });
  }

  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebase: 'disconnected',
    env_check: {
      firebase_project: !!process.env.FIREBASE_PROJECT_ID,
      firebase_email: !!process.env.FIREBASE_CLIENT_EMAIL,
      firebase_key: !!process.env.FIREBASE_PRIVATE_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    }
  };

  try {
    const db = getAdminDb();
    await db.collection('health').limit(1).get();
    status.firebase = 'connected';
  } catch (error) {
    logError(scope, error, { phase: 'database', requestId, path });
    return errorResponse(requestId, scope);
  }

  return jsonWithRequestId(requestId, status);
}
