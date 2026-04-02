import { SiteHeader } from "@/components/site-header"
import { ProductFeatures } from "@/components/product-features"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { ExecutionSteps } from "@/components/execution-steps"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export default async function ProductsPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-[100dvh] bg-[#081225] text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.18),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Catalog</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Explore the MTC module catalog
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base">
              Choose a module, compare the two launch paths, and map the intelligence layer that fits your brokerage.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[#CBB57A] px-6 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]"
              >
                <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">{brand.ctaLabel}</a>
              </Button>
              <Button
                asChild
                className="rounded-full border border-white/20 bg-white/5 px-6 text-sm text-white hover:bg-white/10"
              >
                <Link href="/pricing">View launch paths</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProductFeatures
        title="Choose the module that fits your brokerage"
        subtitle="Every module is designed to qualify intent, surface trust, and move serious buyers toward action."
        showCta={false}
      />
      <ExecutionSteps />
      <Pricing />
      <AppverseFooter content={footer} />
    </main>
  )
}
