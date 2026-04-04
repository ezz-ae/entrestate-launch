"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { brand } from "@/lib/brand"

const primaryLinks = [
  { href: brand.productsHref, label: "Products" },
  { href: brand.builderHref, label: "Builder", accent: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/About", label: "About" },
  { href: "/faq", label: "FAQ" },
]

function HeaderCta() {
  return (
    <Button
      asChild
      className="rounded-full bg-[#CBB57A] px-5 text-sm font-semibold text-[#102347] hover:bg-[#d8c590]"
    >
      <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
        {brand.ctaLabel}
      </a>
    </Button>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <div className="flex h-16 items-center justify-between rounded-full border border-white/10 bg-[#0d1831]/85 px-6 shadow-2xl backdrop-blur-2xl">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 p-1.5 transition-transform group-hover:scale-110">
            <Image src="/icons/mtc-logo.svg" alt={`${brand.shortName} logo`} width={36} height={36} className="h-full w-full" />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#CBB57A]">
              {brand.shortName}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.28em] text-white/45 lg:block">
              Intelligence Engine
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/72 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.accent ? "inline-flex items-center gap-2 text-[#CBB57A] transition-colors hover:text-white" : "transition-colors hover:text-white"}
            >
              {link.accent && <Sparkles className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <HeaderCta />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-[#081225] p-8 text-white">
              <div className="mt-8 flex flex-col gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Navigate</p>
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={link.accent ? "flex items-center gap-2 text-2xl font-bold text-[#CBB57A] transition-colors hover:text-white" : "block text-2xl font-bold transition-colors hover:text-[#CBB57A]"}
                    >
                      {link.accent && <Sparkles className="h-5 w-5" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
                <HeaderCta />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
