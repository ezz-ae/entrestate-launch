import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { brand } from "@/lib/brand"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: brand.tagline,
  copyright: `Copyright 2025 - ${brand.name}`,
}

function isLegacyFooterTagline(value: string) {
  const normalized = value.trim().toLowerCase()
  return (
    !normalized ||
    normalized.includes("launches real estate websites") ||
    normalized.includes("templates") ||
    normalized.includes("ai builder")
  )
}

function isLegacyFooterCopyright(value: string) {
  const normalized = value.trim().toLowerCase()
  return !normalized || (normalized.includes("copyright") && !normalized.includes("mtc"))
}

export function AppverseFooter({ content = defaultContent }: { content?: FooterContent }) {
  const safeContent: FooterContent = {
    tagline: isLegacyFooterTagline(content.tagline) ? defaultContent.tagline : content.tagline,
    copyright: isLegacyFooterCopyright(content.copyright) ? defaultContent.copyright : content.copyright,
  }

  return (
    <footer className="border-t border-white/5 bg-[#081225] text-white">
      <div className="container mx-auto px-4 pb-12 pt-16 sm:pt-24">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.16),transparent_40%),#0d1831] px-6 py-10 text-center shadow-2xl sm:px-10 sm:py-12">
          <h2 className="text-3xl font-extrabold sm:text-5xl">Ready to turn your site into an intelligence engine?</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
            Deploy live inventory, AI lead qualification, developer scorecards, and hyper-local heatmaps without
            rebuilding your workflow from scratch.
          </p>
          <Button
            asChild
            className="mt-8 rounded-full bg-[#CBB57A] px-8 py-6 text-lg font-bold text-[#102347] shadow-[0_0_30px_rgba(203,181,122,0.25)] transition-all hover:scale-105 hover:bg-[#d8c590]"
          >
            <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
              {brand.ctaLabel}
            </a>
          </Button>
        </div>
        <div className="py-16">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 p-1.5">
                  <Image src="/icons/mtc-logo.svg" alt={`${brand.shortName} logo`} width={24} height={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">{brand.shortName}</span>
              </div>
              <p className="max-w-sm text-lg leading-relaxed text-neutral-400">{safeContent.tagline}</p>
            </div>

            <div>
              <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Company</h5>
              <ul className="space-y-4 text-neutral-400">
                {[
                  { label: "Products", href: brand.productsHref },
                  { label: "Builder", href: brand.builderHref },
                  { label: "Pricing", href: "/pricing" },
                  { label: "About", href: "/About" },
                  { label: "Docs", href: "/docs" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Terms", href: "/t&c" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition-colors hover:text-[#CBB57A]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Support</h5>
              <ul className="space-y-4 text-neutral-400">
                <li>{brand.location}</li>
                <li>
                  <a href={`mailto:${brand.email}`} className="transition-colors hover:text-[#CBB57A]">
                    {brand.email}
                  </a>
                </li>
                <li>
                  <a href={brand.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#CBB57A]">
                    {brand.domain}
                  </a>
                </li>
                <li>
                  <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#CBB57A]">
                    {brand.ctaLabel}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Featured offer</p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">ORE investor intelligence site is live and for sale.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                Sell a fully designed real-estate experience with live market storytelling, investor positioning, and a
                ready-made acquisition flow instead of sending buyers to a dead brochure.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="rounded-full bg-[#CBB57A] px-6 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]">
                <Link href="/products/ore-investor-intelligence-site">View sale page</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10">
                <a href="https://ore-mu.vercel.app/" target="_blank" rel="noopener noreferrer">
                  Open live site
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-16 border-t border-white/5 pt-8 text-center text-sm text-neutral-500">
            {safeContent.copyright}
          </div>
        </div>
      </div>
    </footer>
  )
}
