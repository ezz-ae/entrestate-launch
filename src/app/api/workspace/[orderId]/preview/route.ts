export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { enqueueJob } from '@/lib/server/jobs/queue';
import { requireOrderEntitlement } from '@/lib/server/entitlements/guard';

type Context = { params: Promise<{ orderId: string }> };

export async function POST(_: Request, ctx: Context) {
  const { orderId } = await ctx.params;
  const denied = await requireOrderEntitlement(orderId, 'workspace.preview');
  if (denied) return denied;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { deployment: true } });
  if (!order || !order.deployment) {
    return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
  }

  const job = await enqueueJob({
    tenantId: order.tenantId,
    orderId: order.id,
    deploymentId: order.deployment.id,
    type: 'build_preview',
    payload: { trigger: 'manual_preview_request' },
  });

  return NextResponse.json({ ok: true, jobId: job.id, status: job.status });
}
