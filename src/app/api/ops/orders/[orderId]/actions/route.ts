export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enqueueJob } from '@/lib/server/jobs/queue';

const schema = z.object({
  action: z.enum(['requeue_preview', 'mark_needs_human', 'update_checklist', 'save_case_study_note']),
  checklist: z.record(z.boolean()).optional(),
  note: z.string().optional(),
});

type Context = { params: Promise<{ orderId: string }> };

function toMetaJson(existing: unknown) {
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
    return { ...(existing as Record<string, unknown>) };
  }
  return {};
}

export async function POST(req: NextRequest, ctx: Context) {
  try {
    await requireRole(req, ADMIN_ROLES);
    const { orderId } = await ctx.params;
    const body = schema.parse(await req.json());

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { deployment: true },
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
    }

    if (body.action === 'requeue_preview') {
      if (!order.deployment) {
        return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
      }
      const job = await enqueueJob({
        tenantId: order.tenantId,
        orderId: order.id,
        deploymentId: order.deployment.id,
        type: 'build_preview',
        payload: { trigger: 'ops_requeue' },
      });
      return NextResponse.json({ ok: true, jobId: job.id });
    }

    if (body.action === 'mark_needs_human') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'needs_human' },
      });
      if (order.deployment) {
        await prisma.deployment.update({
          where: { id: order.deployment.id },
          data: { status: 'needs_human' },
        });
      }
      return NextResponse.json({ ok: true, status: 'needs_human' });
    }

    const metaJson = toMetaJson(order.metaJson);

    if (body.action === 'update_checklist') {
      metaJson.opsChecklist = {
        ...(metaJson.opsChecklist as Record<string, boolean> | undefined),
        ...(body.checklist || {}),
      };
      await prisma.order.update({
        where: { id: orderId },
        data: { metaJson: JSON.parse(JSON.stringify(metaJson)) as Prisma.InputJsonValue },
      });
      return NextResponse.json({ ok: true, checklist: metaJson.opsChecklist });
    }

    if (body.action === 'save_case_study_note') {
      metaJson.opsCaseStudyNote = body.note || '';
      metaJson.opsCaseStudyUpdatedAt = new Date().toISOString();
      await prisma.order.update({
        where: { id: orderId },
        data: { metaJson: JSON.parse(JSON.stringify(metaJson)) as Prisma.InputJsonValue },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'unsupported_action' }, { status: 400 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }
    console.error('[api/ops/orders/actions] error', error);
    return NextResponse.json({ ok: false, error: 'ops_action_failed' }, { status: 500 });
  }
}
