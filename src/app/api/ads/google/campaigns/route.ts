export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  requirePlanFeature,
  FeatureAccessError,
  featureAccessErrorResponse,
  PlanLimitError,
  planLimitErrorResponse
} from '@/lib/server/billing';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    
    // Check if the plan allows this feature
    await requirePlanFeature(db, tenantId, 'google_ads');
    
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('ads_campaigns')
      .limit(50)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: [] });
    }

     const campaigns = snapshot.docs.map((doc: any) => ({
      id: doc.id,
       ...doc.data(),
    }));
    
    return NextResponse.json({ data: campaigns });
  } catch (error) {
    if (error instanceof PlanLimitError) {
        return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof FeatureAccessError) {
        return NextResponse.json(featureAccessErrorResponse(error), { status: 403 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
