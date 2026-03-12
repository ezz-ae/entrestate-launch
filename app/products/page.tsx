import { SiteHeader } from "@/components/site-header"
import { ProductFeatures } from "@/components/product-features"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"

export const dynamic = "force-static"

export default function ProductsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <ProductFeatures />
      <Pricing />
      <AppverseFooter />
    </main>
  )
}
