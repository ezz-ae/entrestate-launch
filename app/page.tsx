import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ProductFeatures } from "@/components/product-features"
import { LogoMarquee } from "@/components/logo-marquee"
import { BuilderCta } from "@/components/builder-cta"
import { ExecutionSteps } from "@/components/execution-steps"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <LogoMarquee />
        <Features />
        <BuilderCta />
        <ProductFeatures />
        <ExecutionSteps />
        <Pricing />
        <AppverseFooter />
      </main>
    </>
  )
}
