export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

// GET: Fetch wallet balance and transactions
export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const wallet = await prisma.wallet.findUnique({
      where: { tenantId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    const balance = wallet?.balance ? Number(wallet.balance) : 0;
    const transactions = wallet?.transactions?.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: Number(tx.amount),
      createdAt: tx.createdAt,
    })) || [];
    return NextResponse.json({ balance, transactions });
  } catch (error) {
    console.error('[wallet] error', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}

// POST: Fund wallet (simulate payment)
export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { amount } = await request.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: { tenantId },
        update: { balance: { increment: amount } },
        create: { tenantId, balance: amount },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'fund',
          amount,
        },
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[wallet] fund error', error);
    return NextResponse.json({ error: 'Failed to fund wallet' }, { status: 500 });
  }
}
