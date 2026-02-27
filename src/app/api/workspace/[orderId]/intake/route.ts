export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { enqueueJob } from '@/lib/server/jobs/queue';
import { requireOrderEntitlement } from '@/lib/server/entitlements/guard';
import { requireWorkspaceAccess } from '@/lib/server/workspace-access';

type Context = { params: Promise<{ orderId: string }> };

export async function POST(req: NextRequest, ctx: Context) {
  const { orderId } = await ctx.params;
  const accessDenied = await requireWorkspaceAccess(req, orderId);
  if (accessDenied) return accessDenied;
  const denied = await requireOrderEntitlement(orderId, 'workspace.build');
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const enqueuePreview = Boolean(body?.enqueuePreview);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { deployment: true },
  });

  if (!order || !order.deployment) {
    return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
  }

  const deployment = await prisma.deployment.update({
    where: { id: order.deployment.id },
    data: {
      intakeJson: body,
      status: 'building',
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'in_build' },
  });

  if (enqueuePreview) {
    await enqueueJob({
      tenantId: order.tenantId,
      orderId: order.id,
      deploymentId: deployment.id,
      type: 'build_preview',
      payload: { trigger: 'intake_submit' },
    });
  }

  return NextResponse.json({ ok: true, deploymentId: deployment.id });
}
