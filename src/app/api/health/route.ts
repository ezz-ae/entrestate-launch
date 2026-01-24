import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { SUPER_ADMIN_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';

export async function GET(req: NextRequest) {
  const scope = 'api/health';
  try {
    await requireRole(req, SUPER_ADMIN_ROLES);
  } catch (error) {
    logError(scope, error, { phase: 'auth' });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    logError(scope, error, { phase: 'database' });
    return NextResponse.json({ ok: false, error: 'INTERNAL', scope }, { status: 500 });
  }

  return NextResponse.json(status);
}
