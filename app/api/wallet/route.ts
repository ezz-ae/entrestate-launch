import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

// GET: Fetch wallet balance and transactions
export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const db = getAdminDb();
    const walletRef = db.collection('tenants').doc(tenantId).collection('wallet').doc('main');
    const walletSnap = await walletRef.get();
    const walletData = walletSnap.data();
    const balance = walletData?.balance ?? 0;
    const txRef = db.collection('tenants').doc(tenantId).collection('wallet').doc('main').collection('transactions');
    const txSnap = await txRef.orderBy('createdAt', 'desc').limit(20).get();
    const transactions = txSnap.docs.map(doc => doc.data());
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
    const db = getAdminDb();
    const walletRef = db.collection('tenants').doc(tenantId).collection('wallet').doc('main');
    await walletRef.set({
      balance: FieldValue.increment(amount),
      updatedAt: new Date(),
    }, { merge: true });
    await walletRef.collection('transactions').add({
      type: 'fund',
      amount,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[wallet] fund error', error);
    return NextResponse.json({ error: 'Failed to fund wallet' }, { status: 500 });
  }
}
