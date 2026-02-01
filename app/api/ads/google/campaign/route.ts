import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { ALL_ROLES } from '@/lib/server/roles';

// Placeholder for Google Ads API campaign creation
// import { createGoogleAdsCampaign } from '@/lib/google-ads';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { budget, campaignDetails } = await request.json();
    if (!budget || budget <= 0) {
      return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });
    }
    const db = getAdminDb();
    const walletRef = db.collection('tenants').doc(tenantId).collection('wallet').doc('main');
    const walletSnap = await walletRef.get();
    const walletData = walletSnap.data();
    const balance = walletData?.balance ?? 0;
    if (balance < budget) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 402 });
    }
    // Deduct budget from wallet
    await walletRef.set({
      balance: FieldValue.increment(-budget),
      updatedAt: new Date(),
    }, { merge: true });
    await walletRef.collection('transactions').add({
      type: 'spend',
      amount: budget,
      description: 'Google Ads campaign',
      createdAt: new Date(),
    });
    // TODO: Call Google Ads API to create campaign
    // const campaignResult = await createGoogleAdsCampaign(tenantId, campaignDetails, budget);
    // return NextResponse.json({ success: true, campaign: campaignResult });
    return NextResponse.json({ success: true, message: 'Campaign created (API call placeholder)' });
  } catch (error) {
    console.error('[google-ads-campaign] error', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
