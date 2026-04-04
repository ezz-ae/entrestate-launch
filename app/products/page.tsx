import Link from "next/link"

import { AppverseFooter } from "@/components/appverse-footer"
import { ExecutionSteps } from "@/components/execution-steps"
import { MarketingMediaFrame } from "@/components/marketing-media-frame"
import { Pricing } from "@/components/pricing"
import { ProductFeatures } from "@/components/product-features"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"
import { getProducts } from "@/lib/products"

export const revalidate = 60

export default async function ProductsPage() {
  const [footer, products] = await Promise.all([getMarketingFooter(), getProducts()])
  const featuredSite = products.find((product) => product.slug === "ore-investor-intelligence-site")

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
              Explore the MTC product catalog
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base">
              Sell a ready-made brokerage site, launch a paid pilot module, or scope a broader intelligence rollout.
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

          {featuredSite && (
            <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.14),transparent_35%),rgba(13,24,49,0.88)] p-6 shadow-2xl backdrop-blur-xl lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#CBB57A]/20 bg-[#CBB57A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#CBB57A]">
                    Featured site for sale
                  </div>
                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">{featuredSite.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                    {featuredSite.description}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {featuredSite.highlights.slice(0, 4).map((highlight) => (
                      <div key={highlight} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200">
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button asChild className="rounded-full bg-[#CBB57A] px-6 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]">
                      <Link href={`/products/${featuredSite.slug}`}>View sale page</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10">
                      <a href={featuredSite.demoUrl} target="_blank" rel="noopener noreferrer">Open live site</a>
                    </Button>
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                    One-time acquisition · {featuredSite.price}
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1831] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10">
                    <MarketingMediaFrame
                      src={featuredSite.heroImage}
                      alt={featuredSite.title}
                      chrome
                      fit="contain"
                      className="h-full w-full"
                      contentClassName="p-4 pt-12"
                      sizes="(min-width: 1024px) 40rem, 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ProductFeatures
        title="Choose the offer that fits your brokerage"
        subtitle="Browse sellable brokerage sites, intelligence modules, and rollout paths designed to convert investor demand into qualified conversations."
        showCta={false}
      />
      <ExecutionSteps />
      <Pricing />
      <AppverseFooter content={footer} />
    </main>
  )
}
