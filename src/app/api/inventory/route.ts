import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

// Inventory API: GET (list), POST (create), PATCH (update), DELETE (remove)
export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const db = getAdminDb();
    const snap = await db.collection('tenants').doc(tenantId).collection('inventory').get();
    const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const data = await request.json();
    const db = getAdminDb();
    const ref = await db.collection('tenants').doc(tenantId).collection('inventory').add({
      ...data,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const db = getAdminDb();
    await db.collection('tenants').doc(tenantId).collection('inventory').doc(id).set({
      ...data,
      updatedAt: new Date(),
    }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const db = getAdminDb();
    await db.collection('tenants').doc(tenantId).collection('inventory').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
}
