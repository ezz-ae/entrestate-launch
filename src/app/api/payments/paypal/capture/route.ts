export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/server/paypal';
import { requireRole } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { BILLING_SKUS, resolveBillingSku, logBillingEvent } from '@/lib/server/billing';
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

    // 1.5. Idempotency check: Ensure we haven't already processed this order
    const db = getAdminDb();
    const subRef = db.collection('subscriptions').doc(tenantId);
    const subSnap = await subRef.get();
    if (subSnap.exists && subSnap.data()?.lastOrderId === orderId) {
      return jsonWithRequestId(requestId, { ok: true, message: 'Order already processed' });
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

    // 4. Resolve the SKU from the purchase unit reference_id
    const purchaseUnit = data.purchase_units?.[0];
    const sku = resolveBillingSku(purchaseUnit?.reference_id);
    const skuInfo = sku ? BILLING_SKUS[sku] : null;

    if (skuInfo) {
      // 5. Update the database based on the product type
      if (skuInfo.type === 'plan' && skuInfo.plan) {
        await subRef.set({
          plan: skuInfo.plan,
          status: 'active',
          updatedAt: FieldValue.serverTimestamp(),
          lastOrderId: orderId,
        }, { merge: true });
      } else if (skuInfo.type === 'addon' && skuInfo.addOns) {
        const updates: Record<string, any> = {
          updatedAt: FieldValue.serverTimestamp(),
          lastOrderId: orderId,
        };
        // Use FieldValue.increment for thread-safe add-on stacking
        Object.entries(skuInfo.addOns).forEach(([key, val]) => {
          updates[`addOns.${key}`] = FieldValue.increment(val);
        });
        await subRef.update(updates);
      }

      // 6. Log the successful monetization event
      await logBillingEvent(db, tenantId, {
        type: 'payment_captured',
        orderId,
        sku,
        amount: purchaseUnit?.payments?.captures?.[0]?.amount,
      });
    }

    return jsonWithRequestId(requestId, { ok: true, data });
  } catch (error: any) {
    console.error(`[${scope}] unexpected error`, error);
    return errorResponse(requestId, scope);
  }
}