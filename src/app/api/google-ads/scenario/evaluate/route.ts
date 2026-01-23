import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { evaluateScenario } from '@/modules/googleAds/scenarios';
import { getCampaign, getScenarioConfig, recordLearningSignal } from '@/server/googleAds/repo';
import type { LearningSignal } from '@/modules/googleAds/types';

const requestSchema = z.object({
  campaignId: z.string().min(1),
  metrics: z.object({
    spend: z.number().nonnegative(),
    leads: z.number().nonnegative(),
    cpl: z.number().nonnegative(),
    conversionRate: z.number().optional(),
    landingPageScore: z.number().optional(),
  }),
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

    const thresholds = await getScenarioConfig();
    const outcome = evaluateScenario(payload.metrics, thresholds);

    const signal: LearningSignal = {
      id: nanoid(),
      tenantId: campaign.tenantId,
      campaignId: campaign.id,
      cpl: payload.metrics.cpl,
      conversionRate: payload.metrics.conversionRate ?? null,
      landingPageScore: payload.metrics.landingPageScore ?? null,
      occalizerMode: campaign.occalizerMode,
      scenario: outcome.scenario,
      recordedAt: new Date().toISOString(),
    };

    await recordLearningSignal(signal);

    return NextResponse.json({
      campaignId: campaign.id,
      scenario: outcome.scenario,
      actions: outcome.actions,
    });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to evaluate scenario.');
  }
}
