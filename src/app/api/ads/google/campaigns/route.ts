export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  requirePlanFeature,
  FeatureAccessError,
  featureAccessErrorResponse,
  PlanLimitError,
  planLimitErrorResponse
} from '@/lib/server/billing';
import { prisma } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    await requirePlanFeature({} as any, tenantId, 'google_ads');

    const campaigns = await prisma.adsCampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (!campaigns.length) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({
      data: campaigns.map((campaign) => ({
        id: campaign.id,
        ...(campaign.dataJson as Record<string, unknown>),
      })),
    });
  } catch (error) {
    if (error instanceof PlanLimitError) {
        return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof FeatureAccessError) {
        return NextResponse.json(featureAccessErrorResponse(error), { status: 403 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
