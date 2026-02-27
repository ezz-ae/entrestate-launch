import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db';
import { getCatalogItem, listCatalogItems } from '@/lib/server/commerce/products';
import { createZiinaCheckout } from '@/lib/server/commerce/payments/ziina';
import { createPaypalCheckout } from '@/lib/server/commerce/payments/paypal';
import { finalizePaidOrder } from '@/lib/server/commerce/finalize';
import { getAppUrl } from '@/lib/app-url';
import { generateWorkspaceToken } from '@/lib/server/workspace-access';

type CheckoutProvider = 'ziina' | 'paypal' | 'dev';

export type CreateCheckoutInput = {
  productSlug: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  brokerageName?: string;
  provider?: CheckoutProvider;
  returnUrl?: string;
  cancelUrl?: string;
};

export async function seedProductCatalogRows() {
  for (const item of listCatalogItems()) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        currency: item.currency,
        price: item.price,
        fulfillmentSlaHours: item.fulfillmentSlaHours,
        fulfillmentType: item.fulfillmentType,
        includesJson: item.includes as Prisma.InputJsonValue,
      },
      update: {
        title: item.title,
        description: item.description,
        currency: item.currency,
        price: item.price,
        fulfillmentSlaHours: item.fulfillmentSlaHours,
        fulfillmentType: item.fulfillmentType,
        includesJson: item.includes as Prisma.InputJsonValue,
      },
    });
  }
}

export async function createCheckout(input: CreateCheckoutInput) {
  const productConfig = getCatalogItem(input.productSlug);
  if (!productConfig) {
    throw new Error('Unknown product');
  }

  await seedProductCatalogRows();

  const product = await prisma.product.findUnique({ where: { slug: input.productSlug } });
  if (!product) {
    throw new Error('Product unavailable');
  }

  const existingTenant = await prisma.tenant.findFirst({
    where: { email: input.customerEmail.toLowerCase() },
    orderBy: { createdAt: 'desc' },
  });

  const tenant =
    existingTenant ||
    (await prisma.tenant.create({
      data: {
        name: input.brokerageName || input.customerName || 'Brokerage Workspace',
        email: input.customerEmail.toLowerCase(),
        phone: input.customerPhone,
      },
    }));

  const amount = new Prisma.Decimal(product.price);
  const { token: workspaceToken, tokenHash } = generateWorkspaceToken();
  const order = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      productId: product.id,
      status: 'pending_payment',
      amount,
      currency: product.currency,
      customerEmail: input.customerEmail.toLowerCase(),
      customerPhone: input.customerPhone,
      metaJson: {
        productSlug: product.slug,
        customerName: input.customerName || null,
        brokerageName: input.brokerageName || null,
        workspaceTokenHash: tokenHash,
      } as Prisma.InputJsonValue,
    },
    include: { product: true },
  });

  const appUrl = getAppUrl();
  const returnUrl = (() => {
    const base = input.returnUrl
      ? new URL(input.returnUrl, appUrl)
      : new URL(`/success/${order.id}`, appUrl);
    base.searchParams.set('t', workspaceToken);
    return base.toString();
  })();

  const provider = input.provider || 'ziina';

  if (provider === 'ziina') {
    const session = await createZiinaCheckout({
      orderId: order.id,
      tenantId: tenant.id,
      amountAed: product.price,
      title: product.title,
      productSlug: product.slug,
      returnUrl,
    });

    if (session?.providerRef) {
      await prisma.payment.upsert({
        where: {
          provider_providerRef: {
            provider: 'ziina',
            providerRef: session.providerRef,
          },
        },
        create: {
          tenantId: tenant.id,
          orderId: order.id,
          provider: 'ziina',
          providerRef: session.providerRef,
          status: 'initiated',
          amount,
          currency: product.currency,
          rawWebhook: session.raw as Prisma.InputJsonValue,
        },
        update: {
          status: 'initiated',
          rawWebhook: session.raw as Prisma.InputJsonValue,
        },
      });
    }

    if (!session?.checkoutUrl) {
      await finalizePaidOrder({
        provider: 'dev',
        providerRef: `dev-fallback-${order.id}`,
        orderId: order.id,
        isPaid: true,
        status: 'paid',
        amountMinor: Math.round(product.price * 100),
        currency: product.currency,
        raw: { source: 'ziina_fallback' },
      });
    }

    return {
      order,
      tenant,
      provider: session?.checkoutUrl ? ('ziina' as const) : ('dev' as const),
      checkoutUrl: session?.checkoutUrl || returnUrl,
      providerRef: session?.providerRef,
      successUrl: returnUrl,
      workspaceToken,
    };
  }

  if (provider === 'paypal') {
    const session = await createPaypalCheckout({
      orderId: order.id,
      tenantId: tenant.id,
      amountAed: product.price,
      title: product.title,
      productSlug: product.slug,
      returnUrl,
      cancelUrl: input.cancelUrl,
    });

    if (session?.providerRef) {
      await prisma.payment.upsert({
        where: {
          provider_providerRef: {
            provider: 'paypal',
            providerRef: session.providerRef,
          },
        },
        create: {
          tenantId: tenant.id,
          orderId: order.id,
          provider: 'paypal',
          providerRef: session.providerRef,
          status: 'initiated',
          amount,
          currency: product.currency,
          rawWebhook: session.raw as Prisma.InputJsonValue,
        },
        update: {
          status: 'initiated',
          rawWebhook: session.raw as Prisma.InputJsonValue,
        },
      });
    }

    if (!session?.checkoutUrl) {
      await finalizePaidOrder({
        provider: 'dev',
        providerRef: `dev-fallback-${order.id}`,
        orderId: order.id,
        isPaid: true,
        status: 'paid',
        amountMinor: Math.round(product.price * 100),
        currency: product.currency,
        raw: { source: 'paypal_fallback' },
      });
    }

    return {
      order,
      tenant,
      provider: session?.checkoutUrl ? ('paypal' as const) : ('dev' as const),
      checkoutUrl: session?.checkoutUrl || returnUrl,
      providerRef: session?.providerRef,
      successUrl: returnUrl,
      workspaceToken,
    };
  }

  await finalizePaidOrder({
    provider: 'dev',
    providerRef: `dev-${order.id}`,
    orderId: order.id,
    isPaid: true,
    status: 'paid',
    amountMinor: Math.round(product.price * 100),
    currency: product.currency,
    raw: { source: 'dev_checkout' },
  });

  return {
    order,
    tenant,
    provider: 'dev' as const,
    checkoutUrl: returnUrl,
    providerRef: null,
    successUrl: returnUrl,
    workspaceToken,
  };
}
