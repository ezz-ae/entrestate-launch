import { getAppUrl } from '@/lib/app-url';
import { paypalRequest } from '@/server/paypal';

export type PaypalCheckoutInput = {
  orderId: string;
  tenantId: string;
  amountAed: number;
  title: string;
  productSlug: string;
  returnUrl?: string;
  cancelUrl?: string;
};

export async function createPaypalCheckout(input: PaypalCheckoutInput) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return null;

  const response = await paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: input.orderId,
          reference_id: input.productSlug,
          amount: {
            currency_code: 'AED',
            value: input.amountAed.toFixed(2),
          },
          description: input.title,
        },
      ],
      application_context: {
        return_url: input.returnUrl || `${getAppUrl()}/success/${input.orderId}`,
        cancel_url: input.cancelUrl || `${getAppUrl()}/checkout/${input.productSlug}`,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create PayPal checkout');
  }

  const approve = Array.isArray(data?.links)
    ? data.links.find((link: any) => link.rel === 'approve')?.href || null
    : null;

  return {
    providerRef: data?.id || null,
    checkoutUrl: approve,
    raw: data,
  };
}

export function parsePaypalWebhook(raw: any) {
  const resource = raw?.resource || {};
  const purchaseUnit = Array.isArray(resource.purchase_units) ? resource.purchase_units[0] : null;
  const capture = Array.isArray(resource?.payments?.captures) ? resource.payments.captures[0] : null;
  const eventType = String(raw?.event_type || '').toUpperCase();
  const providerRef = capture?.id || resource?.id || raw?.id || null;
  const status = String(capture?.status || resource?.status || eventType || '').toLowerCase();
  const isPaid =
    eventType.includes('PAYMENT.CAPTURE.COMPLETED') || status.includes('completed') || status.includes('paid');

  return {
    provider: 'paypal',
    providerRef,
    orderId: purchaseUnit?.custom_id || resource?.custom_id || null,
    tenantId: purchaseUnit?.custom_id || resource?.subscriber?.custom_id || null,
    isPaid,
    status: isPaid ? 'paid' : status || 'failed',
    amountMinor: Math.round(Number(capture?.amount?.value || purchaseUnit?.amount?.value || 0) * 100),
    currency: String(capture?.amount?.currency_code || purchaseUnit?.amount?.currency_code || 'AED').toUpperCase(),
    raw,
  };
}
