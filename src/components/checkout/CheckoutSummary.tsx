'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductCatalogItem } from '@/lib/server/commerce/products';

export function CheckoutSummary({ product }: { product: ProductCatalogItem }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'ziina' | 'paypal' | 'dev'>('ziina');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [brokerage, setBrokerage] = useState('');

  const canSubmit = useMemo(() => Boolean(email.trim()), [email]);

  async function submit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          brokerageName: brokerage,
          provider,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Checkout failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      router.push(data.successUrl || `/success/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Checkout</h2>
      <p className="mt-1 text-sm text-slate-600">{product.title}</p>
      <p className="mt-4 text-3xl font-bold text-slate-900">AED {product.price.toLocaleString()}</p>

      <div className="mt-6 grid gap-3">
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Work email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Brokerage" value={brokerage} onChange={(event) => setBrokerage(event.target.value)} />

        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={provider}
          onChange={(event) => setProvider(event.target.value as 'ziina' | 'paypal' | 'dev')}
        >
          <option value="ziina">Ziina</option>
          <option value="paypal">PayPal</option>
          <option value="dev">Dev pay</option>
        </select>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={submit}
        className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay and continue'}
      </button>
    </div>
  );
}
