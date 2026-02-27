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
  const baseDenied = await requireOrderEntitlement(orderId, 'workspace.publish');
  if (baseDenied) return baseDenied;

  const body = await req.json().catch(() => ({}));
  const mode = body?.mode === 'domain' ? 'domain' : 'subdomain';

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { deployment: true } });
  if (!order || !order.deployment) {
    return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
  }

  if (mode === 'domain') {
    const domainDenied = await requireOrderEntitlement(orderId, 'publish.domainConnect');
    if (domainDenied) return domainDenied;
    const domain = String(body?.domain || '').trim();
    if (!domain) {
      return NextResponse.json({ ok: false, error: 'domain_required' }, { status: 400 });
    }

    const job = await enqueueJob({
      tenantId: order.tenantId,
      orderId: order.id,
      deploymentId: order.deployment.id,
      type: 'connect_domain',
      payload: { domain },
    });

    return NextResponse.json({ ok: true, jobId: job.id, mode: 'domain' });
  }

  const job = await enqueueJob({
    tenantId: order.tenantId,
    orderId: order.id,
    deploymentId: order.deployment.id,
    type: 'publish_subdomain',
    payload: { trigger: 'workspace_publish' },
  });

  return NextResponse.json({ ok: true, jobId: job.id, mode: 'subdomain' });
}
