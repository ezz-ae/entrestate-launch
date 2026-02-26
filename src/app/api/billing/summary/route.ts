export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getBillingSummary } from '@/lib/server/billing';
import { prisma } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const summary = await getBillingSummary({} as any, tenantId);
    const usersCount = await prisma.user.count({ where: { tenantId } });
    const seatsUsed = Math.max(1, usersCount);
    const seatsLimit = summary.limits.seats ?? null;

    const providers = {
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      ziina: Boolean(process.env.ZIINA_API_KEY),
    };

    return NextResponse.json({
      ...summary,
      seats: {
        used: seatsUsed,
        limit: seatsLimit,
      },
      providers,
    });
  } catch (error) {
    console.error('[billing/summary] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load billing summary' }, { status: 500 });
  }
}
