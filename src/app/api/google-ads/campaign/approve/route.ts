import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { updateCampaignStatus } from '@/server/googleAds/repo';

const requestSchema = z.object({
  campaignId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    await requireGoogleAdsAccess(req);
    const payload = requestSchema.parse(await req.json());
    await updateCampaignStatus(payload.campaignId, 'approved');
    return NextResponse.json({ campaignId: payload.campaignId, status: 'approved' });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to approve campaign.');
  }
}
