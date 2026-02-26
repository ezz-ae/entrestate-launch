export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const plans = await prisma.campaign.findMany({
      where: { tenantId, platform: 'marketing_plan' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (!plans.length) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({
      data: plans.map((plan) => ({
        id: plan.id,
        ...(plan.metaJson as Record<string, unknown>),
        createdAt: plan.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
