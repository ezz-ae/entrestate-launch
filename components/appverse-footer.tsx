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
          <div className="mt-16 border-t border-white/5 pt-8 text-center text-sm text-neutral-500">
            {safeContent.copyright}
          </div>
        </div>
      </div>
    </footer>
  )
}
