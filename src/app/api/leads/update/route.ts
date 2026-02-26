export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { USE_NEON } from '@/lib/server/env';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  priority: z.enum(['Hot', 'Warm', 'Cold']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ALL_ROLES);

    if (USE_NEON) {
      const result = await prisma.lead.updateMany({
        where: { id: payload.leadId, tenantId },
        data: {
          status: payload.status,
        },
      });
      if (result.count === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    const { FieldValue } = await import('firebase-admin/firestore');
    const db = (await import('@/server/firebase-admin')).getAdminDb();
    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (payload.status) updates.status = payload.status;
    if (payload.priority) updates.priority = payload.priority;

    const leadRef = db.collection('tenants').doc(tenantId).collection('leads').doc(payload.leadId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await leadRef.update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[leads/update] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
