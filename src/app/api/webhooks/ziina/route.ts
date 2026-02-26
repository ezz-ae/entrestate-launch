export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import { parseZiinaWebhook } from '@/lib/server/commerce/payments/ziina';
import { finalizePaidOrder } from '@/lib/server/commerce/finalize';

const ZIINA_WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET;

function verifySignature(rawBody: string, signature?: string | null) {
  if (!ZIINA_WEBHOOK_SECRET || !signature) return false;
  const digest = createHmac('sha256', ZIINA_WEBHOOK_SECRET).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

function resolveTenantId(payload: any) {
  return (
    payload?.metadata?.tenantId ||
    payload?.data?.metadata?.tenantId ||
    payload?.tenantId ||
    payload?.data?.tenantId ||
    null
  );
}

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/webhooks/ziina' });
  const ip = getRequestIp(req);
  if (!(await enforceRateLimit(`webhook:ziina:${ip}`, 60, 60_000))) {
    logger.logRateLimit();
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-ziina-signature') || req.headers.get('ziina-signature');

  if (!verifySignature(rawBody, signature)) {
    logger.logError('Ziina signature invalid', 400);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Deployment commerce webhook path (Neon)
  const payment = parseZiinaWebhook(event);
  if (payment.orderId && payment.providerRef) {
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

  const tenantId = resolveTenantId(event);
  if (!tenantId) {
    logger.logSuccess(200, { outcome: 'no_tenant' });
    return NextResponse.json({ received: true });
  }
  logger.logSuccess(200, { outcome: 'neon_noop', tenantId });
  return NextResponse.json({ received: true });
}
