import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ProductFeatures } from "@/components/product-features"
import { LogoMarquee } from "@/components/logo-marquee"
import { BuilderCta } from "@/components/builder-cta"
import { ExecutionSteps } from "@/components/execution-steps"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { getMarketingFooter, getMarketingLogos } from "@/lib/marketing"

export const revalidate = 60

export default async function Page() {
  const [logos, footer] = await Promise.all([getMarketingLogos(), getMarketingFooter()])

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <LogoMarquee firstRow={logos.first} secondRow={logos.second} />
        <Features />
        <BuilderCta />
        <ProductFeatures />
        <ExecutionSteps />
        <Pricing />
        <AppverseFooter content={footer} />
      </main>
    </>
  )
}
