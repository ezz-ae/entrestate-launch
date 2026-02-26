export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { compileEditRequest } from '@/lib/server/edits/compiler';
import { enqueueJob } from '@/lib/server/jobs/queue';
import { requireOrderEntitlement } from '@/lib/server/entitlements/guard';

type Context = { params: Promise<{ orderId: string }> };

export async function POST(req: NextRequest, ctx: Context) {
  const { orderId } = await ctx.params;
  const denied = await requireOrderEntitlement(orderId, 'workspace.edits');
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const rawText = String(body?.rawText || '').trim();
  if (!rawText) {
    return NextResponse.json({ ok: false, error: 'raw_text_required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { deployment: true } });
  if (!order || !order.deployment) {
    return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
  }

  const compiled = compileEditRequest(rawText);

  const edit = await prisma.editRequest.create({
    data: {
      tenantId: order.tenantId,
      orderId: order.id,
      deploymentId: order.deployment.id,
      status: 'submitted',
      rawText,
      compiledTasks: compiled,
      inputsJson: body?.inputs || {},
      submittedAt: new Date(),
    },
  });

  const job = await enqueueJob({
    tenantId: order.tenantId,
    orderId: order.id,
    deploymentId: order.deployment.id,
    type: 'apply_edit_batch',
    payload: { editRequestId: edit.id },
  });

  return NextResponse.json({ ok: true, editRequestId: edit.id, jobId: job.id, compiled });
}
