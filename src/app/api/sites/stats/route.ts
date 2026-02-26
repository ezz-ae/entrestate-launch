export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  siteIds: z.array(z.string().min(1)).min(1),
});

type SiteStats = {
  leads: number;
  views: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteIds } = payloadSchema.parse(body);
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const entries = await Promise.all(
      siteIds.map(async (siteId) => {
        const leads = await prisma.lead.count({
          where: { tenantId, siteId },
        });
        const views = 0;
        const stats: SiteStats = {
          leads,
          views,
        };
        return [siteId, stats] as const;
      }),
    );

    return NextResponse.json({ data: Object.fromEntries(entries) as Record<string, SiteStats> });
  } catch (error) {
    console.error('[sites/stats] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to load site stats' }, { status: 500 });
  }
}
