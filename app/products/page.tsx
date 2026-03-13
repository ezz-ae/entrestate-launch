import { SiteHeader } from "@/components/site-header"
import { ProductFeatures } from "@/components/product-features"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { ExecutionSteps } from "@/components/execution-steps"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-static"

export default function ProductsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,255,58,0.18),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Catalog</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pick a product, launch in days
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base">
              Each product is built for a specific sales workflow — listings, lead capture, and automated follow-up.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-lime-400 px-6 text-sm font-semibold text-black hover:bg-lime-300"
              >
                <Link href="/products/gold-century-luxury">Start with a Template</Link>
              </Button>
              <Button
                asChild
                className="rounded-full border border-white/20 bg-white/5 px-6 text-sm text-white hover:bg-white/10"
              >
                <Link href="/#pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProductFeatures
        title="Choose the product that fits your pipeline"
        subtitle="Every package includes conversion wiring, lead capture, and AI-ready customization."
        showCta={false}
      />
      <ExecutionSteps />
      <Pricing />
      <AppverseFooter />
    </main>
  )
}
