import { NextResponse } from 'next/server';
import { hasEntitlement } from '@/lib/server/entitlements/resolve';

export async function requireOrderEntitlement(orderId: string, key: string) {
  const allowed = await hasEntitlement(orderId, key);
  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'entitlement_required',
        entitlement: key,
      },
      { status: 403 },
    );
  }

  return null;
}
