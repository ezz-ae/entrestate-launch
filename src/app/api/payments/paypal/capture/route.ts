export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/server/paypal';
import { requireRole } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { createRequestId, jsonWithRequestId, errorResponse } from '@/lib/server/request-id';

/**
 * PayPal Order Capture Route
 * Finalizes the payment and updates the tenant's subscription or add-ons.
 */
export async function POST(req: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/payments/paypal/capture';
  
  try {
    // 1. Ensure the user is an admin for their tenant
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const { orderId } = await req.json();

    if (!orderId) {
      return errorResponse(requestId, scope, 400);
    }

    // 2. Call PayPal to capture the funds
    const response = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[paypal/capture] PayPal API error', data);
      return jsonWithRequestId(requestId, { error: 'PayPal capture failed', details: data }, { status: 500 });
    }

    // 3. Verify the payment status
    const status = data.status; // Expected: 'COMPLETED'
    if (status !== 'COMPLETED') {
      return jsonWithRequestId(requestId, { 
        ok: true, 
        message: `Payment status is ${status}. Fulfillment will happen via webhook.`,
        data 
      });
    }

    return jsonWithRequestId(requestId, { ok: true, data });
  } catch (error: any) {
    console.error(`[${scope}] unexpected error`, error);
    return errorResponse(requestId, scope);
  }
}
