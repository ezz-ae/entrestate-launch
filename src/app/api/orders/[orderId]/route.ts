export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { resolveWorkspaceEntitlements } from '@/lib/server/entitlements/resolve';

type Context = { params: Promise<{ orderId: string }> };

function nextAction(status: string) {
  if (status === 'pending_payment') return 'await_payment';
  if (status === 'paid' || status === 'provisioning' || status === 'in_build') return 'complete_build';
  if (status === 'ready_for_review') return 'review_preview';
  if (status === 'published') return 'delivery';
  if (status === 'delivered') return 'view_live';
  return 'complete_build';
}

export async function GET(_: Request, ctx: Context) {
  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      deployment: true,
      tenant: true,
    },
  });

  if (!order) {
    return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
  }

  const entitlements = await resolveWorkspaceEntitlements(orderId);

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      createdAt: order.createdAt,
      product: order.product,
      tenant: {
        id: order.tenant.id,
        name: order.tenant.name,
        email: order.tenant.email,
      },
    },
    deployment: order.deployment,
    entitlements,
    nextAction: nextAction(order.status),
  });
}
