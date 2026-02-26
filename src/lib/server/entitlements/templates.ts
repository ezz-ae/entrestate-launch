import type { ProductCatalogItem } from '@/lib/server/commerce/products';

export function entitlementTemplateForProduct(product: ProductCatalogItem) {
  return product.entitlements.map((entry) => ({
    key: entry.key,
    valueJson: entry.value,
  }));
}
