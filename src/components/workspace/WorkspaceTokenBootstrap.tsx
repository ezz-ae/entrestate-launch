'use client';

import { useEffect } from 'react';

type Props = {
  orderId: string;
  token: string;
};

export function WorkspaceTokenBootstrap({ orderId, token }: Props) {
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch('/api/workspace/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderId, token }),
      signal: controller.signal,
    }).catch(() => null);
    return () => controller.abort();
  }, [orderId, token]);

  return null;
}
