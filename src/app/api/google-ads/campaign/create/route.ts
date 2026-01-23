import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { evaluateOccalizer } from '@/modules/googleAds/occalizer';
import { buildCampaignPlan } from '@/modules/googleAds/decisionZipper';
import type { AdsCampaign, OccalizerMode } from '@/modules/googleAds/types';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { createCampaign, getBlueprint } from '@/server/googleAds/repo';

const requestSchema = z.object({
  blueprintId: z.string().min(1),
  occalizerMode: z.enum(['TOP', 'FAIR', 'RISKY']),
  dailyBudgetCap: z.number().positive(),
  totalBudgetCap: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    const { tenantId } = await requireGoogleAdsAccess(req);
    const payload = requestSchema.parse(await req.json());

    const blueprint = await getBlueprint(payload.blueprintId);
    if (!blueprint) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Blueprint not found.' } }, { status: 404 });
    }

    const occalizer = evaluateOccalizer(payload.occalizerMode as OccalizerMode);
    const zipper = buildCampaignPlan({
      siteIntent: blueprint.summary,
      blueprint,
      occalizer,
      budgetCaps: { daily: payload.dailyBudgetCap, total: payload.totalBudgetCap },
    });

    const now = new Date().toISOString();
    const campaign: AdsCampaign = {
      id: nanoid(),
      tenantId,
      blueprintId: blueprint.id,
      status: 'draft',
      occalizerMode: payload.occalizerMode as OccalizerMode,
      budgetCaps: { daily: payload.dailyBudgetCap, total: payload.totalBudgetCap },
      plan: zipper.plan,
      refiner: null,
      createdAt: now,
      updatedAt: now,
    };

    await createCampaign(campaign);

    return NextResponse.json({
      campaignId: campaign.id,
      status: campaign.status,
      plan: campaign.plan,
    });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to create campaign.');
  }
}
