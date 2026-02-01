import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { ADMIN_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('marketing_plans')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: [] });
    }

     const plans = snapshot.docs.map((doc: any) => ({
      id: doc.id,
       ...doc.data(),
    }));
    
    return NextResponse.json({ data: plans });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
