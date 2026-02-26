import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { DEFAULT_MARKETING_METRICS } from '@/data/marketing-metrics';
import { ALL_ROLES } from '@/lib/server/roles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    return NextResponse.json({ data: DEFAULT_MARKETING_METRICS });
  } catch (error) {
    console.error('[marketing/metrics] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load marketing metrics' }, { status: 500 });
  }
}
