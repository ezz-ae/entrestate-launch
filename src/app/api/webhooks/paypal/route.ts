export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/server/paypal';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import { parsePaypalWebhook } from '@/lib/server/commerce/payments/paypal';
import { finalizePaidOrder } from '@/lib/server/commerce/finalize';
import { prisma } from '@/server/db';

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

function resolveTenantId(event: any) {
  const resource = event?.resource || {};
  const purchaseUnit = Array.isArray(resource.purchase_units) ? resource.purchase_units[0] : null;
  return (
    purchaseUnit?.custom_id ||
    resource.custom_id ||
    resource.subscriber?.custom_id ||
    null
  );
}

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/webhooks/paypal' });
  const ip = getRequestIp(req);
  if (!(await enforceRateLimit(`webhook:paypal:${ip}`, 60, 60_000))) {
    logger.logRateLimit();
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!PAYPAL_WEBHOOK_ID) {
    logger.logError('PayPal webhook id not configured', 500);
    return NextResponse.json({ error: 'PayPal webhook id not configured' }, { status: 500 });
  }

  const verificationPayload = {
    auth_algo: req.headers.get('paypal-auth-algo'),
    cert_url: req.headers.get('paypal-cert-url'),
    transmission_id: req.headers.get('paypal-transmission-id'),
    transmission_sig: req.headers.get('paypal-transmission-sig'),
    transmission_time: req.headers.get('paypal-transmission-time'),
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: event,
  };

  const verifyResponse = await paypalRequest('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify(verificationPayload),
  });
  const verifyData = await verifyResponse.json().catch(() => null);

  if (!verifyResponse.ok || verifyData?.verification_status !== 'SUCCESS') {
    logger.logError('PayPal signature invalid', 400);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Deployment commerce webhook path (Neon)
  const payment = parsePaypalWebhook(event);
  if (payment.orderId && payment.providerRef) {
    const existingOrder = await prisma.order.findUnique({ where: { id: payment.orderId } });
    if (existingOrder) {
      try {
        const finalized = await finalizePaidOrder({
          provider: payment.provider,
          providerRef: payment.providerRef,
          orderId: payment.orderId,
          isPaid: payment.isPaid,
          status: payment.status,
          amountMinor: payment.amountMinor,
          currency: payment.currency,
          raw: payment.raw,
        });
        logger.logSuccess(200, {
          outcome: 'deployment_order_processed',
          orderId: payment.orderId,
          duplicate: (finalized as any)?.duplicate ?? false,
        });
        return NextResponse.json({ received: true, deploymentOrder: true });
      } catch (error) {
        logger.logError(error, 500, { outcome: 'deployment_order_failed' });
        return NextResponse.json({ error: 'Failed to process deployment payment' }, { status: 500 });
      }
    }
  }

  const tenantId = resolveTenantId(event);
  if (!tenantId) {
    logger.logSuccess(200, { outcome: 'no_tenant' });
    return NextResponse.json({ received: true });
  }
  logger.logSuccess(200, { outcome: 'neon_noop', tenantId });
  return NextResponse.json({ received: true });

  logger.logSuccess(200, { outcome: 'subscription_updated', tenantId });
  return NextResponse.json({ received: true });
}
