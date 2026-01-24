import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';

const querySchema = z.object({
  campaignId: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    await requireGoogleAdsAccess(req);
    const params = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));

    return NextResponse.json({
      campaignId: params.campaignId,
      from: params.from,
      to: params.to,
      tiles: {
        ads: [
          { label: 'Spend', value: 0 },
          { label: 'Leads', value: 0 },
          { label: 'CPL', value: 0 },
        ],
        leads: [
          { label: 'New', value: 0 },
          { label: 'Contacted', value: 0 },
          { label: 'Revived', value: 0 },
        ],
        sender: [
          { label: 'Delivered', value: 0 },
          { label: 'Opened', value: 0 },
          { label: 'Replied', value: 0 },
        ],
      },
    });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to load report.', 'api/google-ads/report');
  }
}
