import Link from "next/link"
import { Bot, Database, MapPinned, ShieldCheck } from "lucide-react"

import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

const pillars = [
  {
    title: "Structured inventory",
    description: "A live, organized project database that lets brokerages look bigger than the portals.",
    icon: Database,
  },
  {
    title: "AI market veteran",
    description: "Intent qualification, guided discovery, and recommendation flows powered by real market context.",
    icon: Bot,
  },
  {
    title: "Developer trust layer",
    description: "Scorecards, delivery history, and buyer-facing confidence signals built directly into discovery.",
    icon: ShieldCheck,
  },
  {
    title: "Hyper-local context",
    description: "Map-based ROI intelligence and zone-level visibility that makes decisions faster for serious buyers.",
    icon: MapPinned,
  },
]

export default async function AboutPage() {
  const footer = await getMarketingFooter()

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    logo: `${brand.url}/icons/mtc-logo.svg`,
    description: brand.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: brand.email,
        contactType: "customer support",
      },
    ],
    areaServed: [{ "@type": "Place", name: "UAE" }],
  }

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.16),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">About {brand.shortName}</p>
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">Built for brokerages that need more than a brochure site.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/72 sm:text-xl">
              {brand.description} We help brokerages modernize the buyer journey with a system that qualifies intent,
              exposes real market data, and keeps momentum moving toward booked conversations.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Mission</p>
              <h2 className="mt-4 text-3xl font-bold">Turn passive traffic into qualified opportunity.</h2>
              <p className="mt-4 text-base leading-relaxed text-white/72">
                MTC exists to help real estate teams stop relying on static pages, manual spreadsheets, and delayed follow-up.
                We design intelligent brokerage experiences that respond instantly, show their work, and earn buyer confidence.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#CBB57A]/20 bg-[#102347] p-8 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Operating model</p>
              <h2 className="mt-4 text-3xl font-bold">Modular when you need speed. Exclusive when you need edge.</h2>
              <p className="mt-4 text-base leading-relaxed text-white/72">
                Some teams want to upgrade the site they already have. Others want the full exclusive platform. MTC is built
                for both paths so you can deploy what matters now and expand later.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102347] text-[#CBB57A]">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/72">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.16),transparent_40%),#0d1831] p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">What makes MTC different</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">A brokerage growth system, not a design template.</h2>
                <p className="mt-4 text-base leading-relaxed text-white/72">
                  We combine real estate data, AI qualification, developer proof points, and hyper-local visibility into a
                  single operating layer that can sit inside your current presence or power an entirely new platform.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button asChild className="rounded-full bg-[#CBB57A] px-8 py-6 text-base font-semibold text-[#102347] hover:bg-[#d8c590]">
                  <Link href="/pricing">View launch paths</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-8 py-6 text-base text-white hover:bg-white/10">
                  <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                    {brand.ctaLabel}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
