import Link from 'next/link';
import type { ProductCatalogItem } from '@/lib/server/commerce/products';

export function ProductCard({ product }: { product: ProductCatalogItem }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm shadow-black/5 dark:shadow-black/30">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.fulfillmentType}</p>
      <h3 className="mt-2 text-2xl font-semibold text-foreground">{product.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-4 text-3xl font-bold text-foreground">AED {product.price.toLocaleString()}</p>
      <p className="mt-1 text-xs text-muted-foreground">SLA: {product.fulfillmentSlaHours}h</p>
      <div className="mt-6 flex gap-3">
        <Link
          href={`/deployments/${product.slug}`}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          View details
        </Link>
        <Link
          href={`/checkout/${product.slug}`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Buy now
        </Link>
      </div>
    </article>
  );
}
