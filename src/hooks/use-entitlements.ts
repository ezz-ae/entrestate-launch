'use client';

import { useEffect, useState } from 'react';
import { AuthError, authorizedFetch } from '@/lib/auth-fetch';

export type EntitlementGate = {
  allowed: boolean;
  reason?: string | null;
};

export type EntitlementSummary = {
  plan: string;
  planId: string;
  planName: string;
  status: string;
  isTrial: boolean;
  addOns: Record<string, unknown> | null;
  features: {
    inventoryAccess: EntitlementGate;
    builderPublish: EntitlementGate;
    leadExports: EntitlementGate;
    senders: EntitlementGate;
  };
  reason?: string | null;
};

export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<EntitlementSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEntitlements = async () => {
      setLoading(true);
      try {
        const response = await authorizedFetch('/api/me/entitlements', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);
        if (!mounted) return;
        if (!payload?.ok) {
          const message =
            payload?.error ||
            (payload?.message ? String(payload.message) : 'Unable to load your access level.');
          setEntitlements(null);
          setError(message);
          return;
        }
        setEntitlements(payload.data ?? null);
        setError(null);
      } catch (fetchError) {
        if (!mounted) return;
        const message =
          fetchError instanceof AuthError
            ? 'Log in to view your plan details.'
            : fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load your entitlements.';
        setEntitlements(null);
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchEntitlements();
    return () => {
      mounted = false;
    };
  }, []);

  return { entitlements, error, loading };
}
