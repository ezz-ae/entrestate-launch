import { ProductCard } from '@/components/market/ProductCard';
import { listCatalogItems } from '@/lib/server/commerce/products';

export function DecisionPage() {
  const products = listCatalogItems();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Entrestate Deployment Market</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">
          Buy real estate deployments that ship in 24 hours.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600">
          No SaaS setup. Pick a product, pay once, and open a controlled workspace tied to your order.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>
    </main>
  );
}
