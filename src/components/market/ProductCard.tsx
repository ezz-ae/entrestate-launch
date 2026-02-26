import Link from 'next/link';
import type { ProductCatalogItem } from '@/lib/server/commerce/products';

export function ProductCard({ product }: { product: ProductCatalogItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{product.fulfillmentType}</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{product.description}</p>
      <p className="mt-4 text-3xl font-bold text-slate-900">AED {product.price.toLocaleString()}</p>
      <p className="mt-1 text-xs text-slate-500">SLA: {product.fulfillmentSlaHours}h</p>
      <div className="mt-6 flex gap-3">
        <Link
          href={`/deployments/${product.slug}`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          View details
        </Link>
        <Link
          href={`/checkout/${product.slug}`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Buy now
        </Link>
      </div>
    </article>
  );
}
