export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

const payloadSchema = z.object({
  firstName: z.string().trim().min(1).optional().nullable(),
  lastName: z.string().trim().min(1).optional().nullable(),
  companyName: z.string().trim().min(1).optional().nullable(),
  officeAddress: z.string().trim().min(1).optional().nullable(),
  notifications: z
    .object({
      leadAlerts: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
      productUpdates: z.boolean().optional(),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { profileJson: true },
    });

    return NextResponse.json({ profile: tenant?.profileJson || null });
  } catch (error) {
    console.error('[profile] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const existing = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { profileJson: true },
    });
    const updateData: Record<string, unknown> = {
      ...(existing?.profileJson as Record<string, unknown> | null),
      updatedAt: new Date().toISOString(),
    };

    if (payload.firstName !== undefined) updateData.firstName = payload.firstName || null;
    if (payload.lastName !== undefined) updateData.lastName = payload.lastName || null;
    if (payload.companyName !== undefined) updateData.companyName = payload.companyName || null;
    if (payload.officeAddress !== undefined) updateData.officeAddress = payload.officeAddress || null;
    if (payload.notifications) {
      updateData.notifications = {
        leadAlerts: payload.notifications.leadAlerts ?? false,
        weeklyReport: payload.notifications.weeklyReport ?? false,
        productUpdates: payload.notifications.productUpdates ?? false,
      };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { profileJson: updateData },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[profile] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
