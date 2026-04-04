import Link from "next/link"
import { ArrowRight, BookOpen, CircleHelp, LayoutPanelTop } from "lucide-react"

import { AppverseFooter } from "@/components/appverse-footer"
import { BuilderCta } from "@/components/builder-cta"
import { ExecutionSteps } from "@/components/execution-steps"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { Pricing } from "@/components/pricing"
import { ProductFeatures } from "@/components/product-features"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

const quickPaths = [
  {
    href: brand.productsHref,
    title: "Browse the module catalog",
    description: "Compare inventory, lead intelligence, developer scorecards, heatmaps, and rollout paths.",
    icon: LayoutPanelTop,
  },
  {
    href: "/docs",
    title: "Read the rollout guide",
    description: "See implementation notes, planning docs, and launch checklists before you commit.",
    icon: BookOpen,
  },
  {
    href: "/faq",
    title: "Resolve buying questions",
    description: "Answer common questions around deployment, pricing, ownership, and what ships first.",
    icon: CircleHelp,
  },
]

export const revalidate = 60

export default async function Page() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-[100dvh] bg-[#081225] text-white">
      <SiteHeader />
      <Hero />
      <Features />
      <BuilderCta />
      <ProductFeatures />

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Use the site</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              More than a landing page.
            </h2>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base">
              Buyers can compare offers, try the builder, read rollout docs, and move into a paid engagement with less
              back-and-forth.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {quickPaths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#CBB57A]/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102347] text-[#CBB57A]">
                  <path.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-white">{path.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">{path.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#CBB57A]">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="rounded-full bg-[#CBB57A] px-6 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]">
              <Link href={brand.builderHref}>Try the live builder</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10">
              <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                {brand.ctaLabel}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ExecutionSteps />
      <Pricing />
      <AppverseFooter content={footer} />
    </main>
  )
}
