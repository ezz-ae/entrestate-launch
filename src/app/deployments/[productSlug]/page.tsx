import { notFound } from 'next/navigation';
import { getCatalogItem } from '@/lib/server/commerce/products';
import { ProductPageTemplate } from '@/components/market/ProductPageTemplate';

type Props = { params: Promise<{ productSlug: string }> };

export default async function DeploymentProductPage({ params }: Props) {
  const { productSlug } = await params;
  const product = getCatalogItem(productSlug);

  if (!product) {
    notFound();
  }

  return <ProductPageTemplate product={product} />;
}
