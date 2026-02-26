export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { requireOrderEntitlement } from '@/lib/server/entitlements/guard';
import { listLeadsForOrder } from '@/lib/server/leads/list';
import { captureLead } from '@/lib/server/leads/capture';
import { exportLeadsCsv } from '@/lib/server/leads/export';

type Context = { params: Promise<{ orderId: string }> };

async function findOrder(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId }, include: { deployment: true } });
}

export async function GET(req: NextRequest, ctx: Context) {
  const { orderId } = await ctx.params;
  const denied = await requireOrderEntitlement(orderId, 'lead.capture');
  if (denied) return denied;

  const format = req.nextUrl.searchParams.get('format');

  if (format === 'csv') {
    const csv = await exportLeadsCsv(orderId);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="order-${orderId}-leads.csv"`,
      },
    });
  }

  const leads = await listLeadsForOrder(orderId);
  return NextResponse.json({ ok: true, leads });
}

export async function POST(req: NextRequest, ctx: Context) {
  const { orderId } = await ctx.params;
  const denied = await requireOrderEntitlement(orderId, 'lead.capture');
  if (denied) return denied;

  const order = await findOrder(orderId);
  if (!order || !order.deployment) {
    return NextResponse.json({ ok: false, error: 'deployment_not_found' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  const lead = await captureLead({
    tenantId: order.tenantId,
    orderId: order.id,
    deploymentId: order.deployment.id,
    name: body?.name,
    phone: body?.phone,
    email: body?.email,
    source: body?.source,
    notes: body?.notes,
  });

  return NextResponse.json({ ok: true, lead });
}
