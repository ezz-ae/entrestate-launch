export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { createDeployment, getCampaign, updateCampaignStatus } from '@/server/googleAds/repo';
import type { AdsDeployment } from '@/modules/googleAds/types';

const requestSchema = z.object({
  campaignId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    await requireGoogleAdsAccess(req);
    const payload = requestSchema.parse(await req.json());

    const campaign = await getCampaign(payload.campaignId);
    if (!campaign) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Campaign not found.' } }, { status: 404 });
    }
    if (campaign.status !== 'approved' && campaign.status !== 'deploying' && campaign.status !== 'active') {
      return NextResponse.json({ error: { code: 'INVALID_STATUS', message: 'Campaign must be approved before sync.' } }, { status: 409 });
    }

    const now = new Date().toISOString();
    const deployment: AdsDeployment = {
      id: nanoid(),
      campaignId: campaign.id,
      status: 'queued',
      payload: {
        plan: campaign.plan,
        occalizerMode: campaign.occalizerMode,
      },
      createdAt: now,
      updatedAt: now,
    };

    await createDeployment(deployment);
    await updateCampaignStatus(campaign.id, 'deploying');

    return NextResponse.json({ deploymentId: deployment.id, status: deployment.status });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to sync campaign.', 'api/google-ads/sync');
  }
}
