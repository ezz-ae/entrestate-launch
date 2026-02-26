export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

// Placeholder for Google Ads API campaign creation
// import { createGoogleAdsCampaign } from '@/lib/google-ads';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { budget, campaignDetails } = await request.json();
    if (!budget || budget <= 0) {
      return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });
    }
    try {
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.upsert({
          where: { tenantId },
          update: {},
          create: { tenantId, balance: 0 },
        });
        const balance = Number(wallet.balance || 0);
        if (balance < budget) {
          throw new Error('INSUFFICIENT_WALLET_BALANCE');
        }
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: budget } },
        });
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'spend',
            amount: budget,
          },
        });
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'INSUFFICIENT_WALLET_BALANCE') {
        return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 402 });
      }
      throw error;
    }
    // TODO: Call Google Ads API to create campaign
    // const campaignResult = await createGoogleAdsCampaign(tenantId, campaignDetails, budget);
    // return NextResponse.json({ success: true, campaign: campaignResult });
    return NextResponse.json({ success: true, message: 'Campaign created (API call placeholder)' });
  } catch (error) {
    console.error('[google-ads-campaign] error', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
