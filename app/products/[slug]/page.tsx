import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"

const products = {
  "ready-broker-site": {
    title: "Ready-Made Broker Site",
    description: "A complete broker website with listings, lead capture, and AI customization.",
  },
  "realtor-bio-link": {
    title: "Realtor Bio Link",
    description: "Personal brand link with inventory, AI chat, and lead capture in one place.",
  },
  "brochure-to-landing": {
    title: "Brochure to Landing",
    description: "Upload a brochure and get a high-converting landing page in minutes.",
  },
  "instagram-dm-ai": {
    title: "Instagram DM AI Agent",
    description: "Turn DMs into booked viewings with an AI property expert.",
  },
} as const

type ProductKey = keyof typeof products

export const dynamic = "force-static"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products[params.slug as ProductKey]
  if (!product) notFound()

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lime-300/80">Mashroi</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{product.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-300">{product.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#pricing"
              className="rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-black hover:bg-lime-300"
            >
              View pricing
            </a>
            <Link
              href="/products"
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white hover:border-white/40"
            >
              Back to products
            </Link>
          </div>
        </div>
      </section>
      <Pricing />
      <AppverseFooter />
    </main>
  )
}
