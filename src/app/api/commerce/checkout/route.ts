export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckout } from '@/lib/server/commerce/checkout';

const schema = z.object({
  productSlug: z.string().min(1),
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  brokerageName: z.string().optional(),
  provider: z.enum(['ziina', 'paypal', 'dev']).optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = schema.parse(await req.json());
    const checkout = await createCheckout(payload);

    return NextResponse.json({
      ok: true,
      orderId: checkout.order.id,
      checkoutUrl: checkout.checkoutUrl,
      workspaceUrl: `/w/${checkout.order.id}`,
      successUrl: checkout.successUrl || `/success/${checkout.order.id}`,
      provider: checkout.provider,
      status: checkout.order.status,
    });
  } catch (error) {
    console.error('[api/commerce/checkout] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'checkout_failed' }, { status: 500 });
  }
}
