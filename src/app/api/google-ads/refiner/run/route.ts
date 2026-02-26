export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runRefiner } from '@/modules/googleAds/refiner';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { saveRefinerResult, FirestoreUnavailableError } from '@/server/googleAds/repo';
import { prisma } from '@/server/db';
import type { SitePage } from '@/lib/types';

const requestSchema = z.object({
  siteId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const gate = guardGoogleAdsEnabled();
  if (gate) return gate;

  try {
    const { tenantId } = await requireGoogleAdsAccess(req);
    const payload = requestSchema.parse(await req.json());

    const site = await prisma.site.findUnique({ where: { id: payload.siteId } });
    if (!site) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Landing page not found.' } }, { status: 404 });
    }

    if (!site.dataJson) {
      throw new FirestoreUnavailableError();
    }

    const page = { id: site.id, ...(site.dataJson as Record<string, any>) } as SitePage;
    const result = runRefiner(page);
    const refId = await saveRefinerResult({ tenantId, siteId: payload.siteId, result });

    return NextResponse.json({ refinerId: refId, result });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to run refiner.', 'api/google-ads/refiner/run');
  }
}
