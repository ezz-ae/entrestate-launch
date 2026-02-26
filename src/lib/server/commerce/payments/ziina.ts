import { getAppUrl } from '@/lib/app-url';

const ZIINA_API_KEY = process.env.ZIINA_API_KEY;
const ZIINA_BASE_URL = process.env.ZIINA_BASE_URL || 'https://api.sandbox.ziina.com';

export type ZiinaCheckoutInput = {
  orderId: string;
  tenantId: string;
  amountAed: number;
  title: string;
  productSlug: string;
  returnUrl?: string;
};

export async function createZiinaCheckout(input: ZiinaCheckoutInput) {
  if (!ZIINA_API_KEY) return null;

  const response = await fetch(`${ZIINA_BASE_URL}/v1/charges`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ZIINA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(input.amountAed * 100),
      currency: 'AED',
      description: input.title,
      return_url: input.returnUrl || `${getAppUrl()}/success/${input.orderId}`,
      metadata: {
        orderId: input.orderId,
        tenantId: input.tenantId,
        productSlug: input.productSlug,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to create Ziina checkout');
  }

  return {
    providerRef: data?.id || data?.charge_id || null,
    checkoutUrl: data?.redirect_url || data?.payment_url || null,
    raw: data,
  };
}

export function parseZiinaWebhook(raw: any) {
  const providerRef = raw?.id || raw?.data?.id || raw?.charge_id || null;
  const status = String(raw?.status || raw?.data?.status || '').toLowerCase();
  const isPaid = ['paid', 'captured', 'successful', 'succeeded', 'completed'].some((value) =>
    status.includes(value),
  );
  const orderId =
    raw?.metadata?.orderId || raw?.data?.metadata?.orderId || raw?.orderId || raw?.data?.orderId || null;
  const tenantId =
    raw?.metadata?.tenantId || raw?.data?.metadata?.tenantId || raw?.tenantId || raw?.data?.tenantId || null;

  return {
    provider: 'ziina',
    providerRef,
    orderId,
    tenantId,
    isPaid,
    status: isPaid ? 'paid' : status || 'failed',
    amountMinor: Number(raw?.amount || raw?.data?.amount || 0),
    currency: String(raw?.currency || raw?.data?.currency || 'AED').toUpperCase(),
    raw,
  };
}
