export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { SUPER_ADMIN_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import { prisma } from '@/server/db';

export async function GET(req: NextRequest) {
  const scope = 'api/health/monetization';
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
    providers: {
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      ziina: Boolean(process.env.ZIINA_API_KEY),
    },
    webhooks: {
      paypal: Boolean(process.env.PAYPAL_WEBHOOK_ID),
      ziina: Boolean(process.env.ZIINA_WEBHOOK_SECRET),
    },
    firestore: 'disabled',
    neon: 'disconnected',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.neon = 'connected';
  } catch (error) {
    logError(scope, error, { phase: 'database' });
    return NextResponse.json({ ok: false, error: 'INTERNAL', scope }, { status: 500 });
  }

  return NextResponse.json(status);
}
