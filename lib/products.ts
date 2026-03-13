import {
  getMarketingProductBySlug,
  getMarketingProducts,
  type Product,
  type ProductOutcome,
  type ProductTimelineStep,
} from "@/lib/marketing"

export type { Product, ProductOutcome, ProductTimelineStep }

export async function getProducts() {
  return getMarketingProducts()
}

export async function getProductBySlug(slug: string) {
  return getMarketingProductBySlug(slug)
}
