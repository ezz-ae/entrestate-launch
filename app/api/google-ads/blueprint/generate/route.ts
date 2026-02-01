import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createBlueprint } from '@/server/googleAds/repo';
import type { StrategicBlueprint } from '@/modules/googleAds/types';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';

const requestSchema = z.object({
  siteId: z.string().optional(),
  rawInputs: z
    .object({
      targetLocation: z.string().min(1),
      audience: z.string().min(1),
      goal: z.string().min(1),
      language: z.string().min(1),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    const { tenantId } = await requireGoogleAdsAccess(req);
    const payload = requestSchema.parse(await req.json());
    const inputs = payload.rawInputs ?? {
      targetLocation: 'Dubai',
      audience: 'Investors',
      goal: 'Lead Generation',
      language: 'English',
    };

    const now = new Date().toISOString();
    const blueprint: StrategicBlueprint = {
      id: nanoid(),
      tenantId,
      siteId: payload.siteId ?? null,
      summary: `Target ${inputs.audience} in ${inputs.targetLocation} with a ${inputs.goal} focus.`,
      checklist: [
        'Confirm landing page conversion goal',
        'Validate tracking readiness',
        'Approve Occalizer stance',
      ],
      trackingPlan: ['Install lead conversion events', 'Verify form submissions', 'Enable call tracking if needed'],
      inputs,
      createdAt: now,
      updatedAt: now,
    };

    await createBlueprint(blueprint);

    return NextResponse.json({
      blueprintId: blueprint.id,
      summary: blueprint.summary,
      checklist: blueprint.checklist,
      trackingPlan: blueprint.trackingPlan,
    });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to generate blueprint.', 'api/google-ads/blueprint/generate');
  }
}
