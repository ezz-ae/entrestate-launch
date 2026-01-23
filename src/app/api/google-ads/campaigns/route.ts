import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { listCampaigns } from '@/server/googleAds/repo';

const querySchema = z.object({
  clientId: z.string().optional(),
  status: z.enum(['draft', 'approved', 'deploying', 'active', 'paused', 'completed']).optional(),
  page: z.coerce.number().optional().default(1),
});

export async function GET(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    const { tenantId } = await requireGoogleAdsAccess(req);
    const params = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));

    const data = await listCampaigns({
      tenantId,
      status: params.status,
      limit: 25,
    });

    return NextResponse.json({
      page: params.page,
      data,
    });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to load campaigns.');
  }
}
