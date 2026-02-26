import Link from 'next/link';
import type { ProductCatalogItem } from '@/lib/server/commerce/products';

export function ProductPageTemplate({ product }: { product: ProductCatalogItem }) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          Back to marketplace
        </Link>
        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{product.description}</p>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <p className="text-3xl font-bold">AED {product.price.toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-500">Delivery SLA: {product.fulfillmentSlaHours} hours</p>
          <ul className="mt-5 list-disc space-y-2 pl-6 text-sm text-slate-700">
            {Object.entries(product.includes).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium">{key}:</span> {String(value)}
              </li>
            ))}
          </ul>
          <Link
            href={`/checkout/${product.slug}`}
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Buy now
          </Link>
        </div>
      </section>
    </main>
  );
}
