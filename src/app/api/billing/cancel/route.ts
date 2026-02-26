export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ADMIN_ROLES);
    return NextResponse.json({ success: true, cancelAtPeriodEnd: true });
  } catch (error) {
    console.error('[billing/cancel] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
