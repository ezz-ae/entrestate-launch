export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  notificationEmail: z.string().email().optional().nullable(),
  crmWebhookUrl: z.string().url().optional().nullable(),
  crmProvider: z.enum(['hubspot', 'custom']).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const settings = await prisma.leadSetting.findUnique({
      where: { tenantId },
    });
    return NextResponse.json({
      settings,
      hubspotAvailable: CAP.hubspot,
    });
  } catch (error) {
    console.error('[leads/settings] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    await prisma.leadSetting.upsert({
      where: { tenantId },
      update: {
        notificationEmail: payload.notificationEmail || null,
        crmWebhookUrl: payload.crmWebhookUrl || null,
        crmProvider: payload.crmProvider || null,
      },
      create: {
        tenantId,
        notificationEmail: payload.notificationEmail || null,
        crmWebhookUrl: payload.crmWebhookUrl || null,
        crmProvider: payload.crmProvider || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[leads/settings] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
