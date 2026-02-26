import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';
import { entitlementTemplateForProduct } from '@/lib/server/entitlements/templates';
import { getCatalogItem } from '@/lib/server/commerce/products';

type FinalizeInput = {
  provider: string;
  providerRef: string;
  orderId: string;
  isPaid: boolean;
  status: string;
  amountMinor?: number;
  currency?: string;
  raw?: unknown;
};

export async function finalizePaidOrder(input: FinalizeInput) {
  if (!input.providerRef || !input.orderId) {
    return { ok: false, reason: 'missing_reference' as const };
  }

  const existing = await prisma.payment.findUnique({
    where: {
      provider_providerRef: {
        provider: input.provider,
        providerRef: input.providerRef,
      },
    },
  });

  if (existing?.status === 'paid') {
    return { ok: true, duplicate: true as const, orderId: input.orderId };
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      include: { product: true, tenant: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const paymentAmount =
      typeof input.amountMinor === 'number'
        ? new Prisma.Decimal(input.amountMinor / 100)
        : order.amount;

    await tx.payment.upsert({
      where: {
        provider_providerRef: {
          provider: input.provider,
          providerRef: input.providerRef,
        },
      },
      create: {
        tenantId: order.tenantId,
        orderId: order.id,
        provider: input.provider,
        providerRef: input.providerRef,
        status: input.isPaid ? 'paid' : input.status || 'failed',
        amount: paymentAmount,
        currency: input.currency || order.currency || 'AED',
        rawWebhook: (input.raw as Prisma.InputJsonValue) || Prisma.JsonNull,
      },
      update: {
        status: input.isPaid ? 'paid' : input.status || 'failed',
        amount: paymentAmount,
        currency: input.currency || order.currency || 'AED',
        rawWebhook: (input.raw as Prisma.InputJsonValue) || Prisma.JsonNull,
      },
    });

    if (!input.isPaid) {
      return { orderId: order.id, paid: false, tenantId: order.tenantId };
    }

    if (order.status === 'paid' || order.status === 'delivered' || order.status === 'published') {
      return { orderId: order.id, paid: true, tenantId: order.tenantId, duplicate: true as const };
    }

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: 'paid' },
    });

    const productSlug = order.product?.slug;
    const catalogProduct = productSlug ? getCatalogItem(productSlug) : null;
    if (!order.productId) {
      throw new Error('Order product is missing');
    }

    const deployment = await tx.deployment.upsert({
      where: { orderId: order.id },
      create: {
        tenantId: order.tenantId,
        orderId: order.id,
        productId: order.productId,
        status: 'created',
      },
      update: {},
    });

    const entitlementRows = catalogProduct ? entitlementTemplateForProduct(catalogProduct) : [];

    if (entitlementRows.length) {
      await tx.entitlement.createMany({
        data: entitlementRows.map((row) => ({
          tenantId: order.tenantId,
          orderId: order.id,
          productId: order.productId,
          key: row.key,
          valueJson: row.valueJson as Prisma.InputJsonValue,
        })),
      });
    }

    await tx.job.createMany({
      data: [
        {
          tenantId: order.tenantId,
          orderId: order.id,
          deploymentId: deployment.id,
          type: 'provision_workspace',
          payload: { orderId: order.id } as Prisma.InputJsonValue,
        },
        {
          tenantId: order.tenantId,
          orderId: order.id,
          deploymentId: deployment.id,
          type: 'build_preview',
          payload: { orderId: order.id } as Prisma.InputJsonValue,
        },
        {
          tenantId: order.tenantId,
          orderId: order.id,
          deploymentId: deployment.id,
          type: 'send_delivery',
          payload: { orderId: order.id } as Prisma.InputJsonValue,
        },
      ],
    });

    return {
      orderId: updatedOrder.id,
      tenantId: updatedOrder.tenantId,
      paid: true,
      deploymentId: deployment.id,
    };
  });

  return { ok: true, ...result };
}
