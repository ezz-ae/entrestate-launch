export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  FeatureAccessError,
  featureAccessErrorResponse,
  requirePlanFeature,
} from '@/lib/server/billing';
import { prisma } from '@/server/db';

const payloadSchema = z.object({
  listType: z.enum(['imported', 'pilot']).default('imported'),
  goal: z.string().min(1),
  region: z.string().min(1),
  budget: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    if (payload.listType === 'imported') {
      await requirePlanFeature({} as any, tenantId, 'meta_custom_audiences');
    }
    const requestData = {
      listType: payload.listType,
      goal: payload.goal,
      region: payload.region,
      budget: payload.budget ?? null,
      notes: payload.notes ?? null,
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const record = await prisma.campaign.create({
      data: {
        tenantId,
        platform: 'audience_request',
        name: `${payload.goal} - ${payload.region}`.slice(0, 120),
        metaJson: requestData,
      },
    });

    return NextResponse.json({ success: true, request: { id: record.id, ...requestData } });
  } catch (error) {
    console.error('[audience/build] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
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
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
