import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCatalogItem } from '@/lib/server/commerce/products';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';

type Props = { params: Promise<{ productSlug: string }> };

export default async function CheckoutPage({ params }: Props) {
  const { productSlug } = await params;
  const product = getCatalogItem(productSlug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/deployments/${product.slug}`} className="text-sm text-slate-500 hover:text-slate-900">
          Back to product
        </Link>
        <div className="mt-4">
          <CheckoutSummary product={product} />
        </div>
      </section>
    </main>
  );
}
