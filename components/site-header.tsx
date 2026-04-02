"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu } from "lucide-react"
import { brand } from "@/lib/brand"

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
  const links = [
    { href: "/#engine", label: "Engine" },
    { href: "/#superpowers", label: "Superpowers" },
    { href: "/pricing", label: "Pricing" },
    { href: "/About", label: "About" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="flex h-16 items-center justify-between rounded-full border border-white/10 bg-[#0d1831]/85 px-6 shadow-2xl backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/10 p-1.5 transition-transform group-hover:scale-110">
            <Image src="/icons/mtc-logo.svg" alt={`${brand.shortName} logo`} width={36} height={36} className="h-full w-full" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#CBB57A]">{brand.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/72 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <HeaderCta />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-[#081225] p-8 text-white">
              <div className="mt-8 flex flex-col gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Navigation</p>
                  {links.map((link) => (
                    <Link key={link.href} href={link.href} className="block text-2xl font-bold transition-colors hover:text-[#CBB57A]">
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
