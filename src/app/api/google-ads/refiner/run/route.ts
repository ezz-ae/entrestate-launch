import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runRefiner } from '@/modules/googleAds/refiner';
import { guardGoogleAdsEnabled, handleGoogleAdsError, requireGoogleAdsAccess } from '@/modules/googleAds/api';
import { saveRefinerResult, FirestoreUnavailableError } from '@/server/googleAds/repo';
import { tryGetAdminDb } from '@/server/firebase-admin';
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

    const db = tryGetAdminDb();
    if (!db) {
      throw new FirestoreUnavailableError();
    }

    const snap = await db.collection('sites').doc(payload.siteId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Landing page not found.' } }, { status: 404 });
    }

    const page = { id: snap.id, ...(snap.data() || {}) } as SitePage;
    const result = runRefiner(page);
    const refId = await saveRefinerResult({ tenantId, siteId: payload.siteId, result });

    return NextResponse.json({ refinerId: refId, result });
  } catch (error) {
    return handleGoogleAdsError(error, 'Failed to run refiner.');
  }
}
