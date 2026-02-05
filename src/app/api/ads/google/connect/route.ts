export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getAppUrl } from '@/lib/app-url';

import { exchangeAuthCodeForTokens, saveGoogleAdsTokensToFirestore } from '@/lib/google-ads';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(request, ALL_ROLES);
    const { authCode } = await request.json();
    if (!authCode) {
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 });
    }

  // Exchange authCode for tokens
  const redirectUri =
    process.env.GOOGLE_ADS_REDIRECT_URI || `${getAppUrl()}/api/ads/google/connect`;
  const tokens = await exchangeAuthCodeForTokens(authCode, redirectUri);
  // Store tokens securely in Firestore
  const db = (await import('@/server/firebase-admin')).getAdminDb();
  await saveGoogleAdsTokensToFirestore(tenantId, tokens, db);
  // Log the connection event
  console.log(`[GoogleAds] Connected for tenant ${tenantId} by user ${uid}`);
  return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[GoogleAds] Connect error', error);
    return NextResponse.json({ error: 'Failed to connect Google Ads' }, { status: 500 });
  }
}
