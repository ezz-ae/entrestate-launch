"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Mashroi launches real estate websites fast — templates, AI builder, and conversion-ready pages.",
  copyright: "© 2025 — Mashroi.com",
}

export function AppverseFooter() {
  const content = defaultContent;

  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-24 pb-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold sm:text-5xl mb-6">Ready to launch?</h2>
          <Button
            asChild
            className="rounded-full bg-lime-400 px-8 py-6 text-lg font-bold text-black shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:bg-lime-300 transition-all hover:scale-105"
          >
            <a href="#pricing">Get Started Now</a>
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="container mx-auto px-4 py-16">
        <Card className="relative overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900/40 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none" />
          <div className="relative grid items-center gap-12 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-[0.3em] text-lime-400 uppercase">Seamless Launch</p>
              <h3 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                The fastest way to build your real estate presence.
              </h3>
              <p className="mt-6 text-lg text-neutral-400 leading-relaxed">
                Pick a professional template, customize every pixel with AI, and go live on your own domain in minutes. No coding, no headaches.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                  Live in 10 mins
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                  AI-Powered Copy
                </div>
              </div>
            </div>

            {/* Right mockup */}
            <div className="relative mx-auto w-full max-w-[340px]">
              <div className="relative rounded-[40px] border-8 border-neutral-800 bg-black p-1 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[32px]">
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                  />
                  <div className="relative z-10 h-full p-6 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="text-4xl font-black text-lime-400 leading-tight">Instant Builder</div>
                    <p className="mt-2 text-sm text-white/70">Transform your brand with AI-first design.</p>
                  </div>
                </div>
              </div>
              {/* Floating elements for depth */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-2xl bg-lime-400/10 blur-2xl" />
              <div className="absolute -left-12 bottom-12 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 pb-12 mt-12">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-lime-400 rounded-xl p-2 flex items-center justify-center">
                  <Image src="/icons/skitbit-white.svg" alt="Mashroi logo" width={24} height={24} className="invert" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Mashroi</span>
              </div>
              <p className="max-w-sm text-lg text-neutral-400 leading-relaxed">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div>
              <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Company</h5>
              <ul className="space-y-4 text-neutral-400">
                {[
                  { label: "Products", href: "/products" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "About Us", href: "/About" },
                  { label: "Terms", href: "/t&c" },
                  { label: "Privacy", href: "/PRIVACY_POLICY.md" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-lime-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Support</h5>
              <ul className="space-y-4 text-neutral-400">
                <li>
                  <Link href="/faq" className="hover:text-lime-300 transition-colors">Documentation</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-lime-300 transition-colors">Help Center</Link>
                </li>
                <li>
                  <a href="mailto:hello@mashroi.com" className="hover:text-lime-300 transition-colors">Contact Support</a>
                </li>
                <li className="flex gap-4 pt-4">
                  <a href="#" className="hover:text-lime-300 transition-colors"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="hover:text-lime-300 transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="#" className="hover:text-lime-300 transition-colors"><Youtube className="h-5 w-5" /></a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-neutral-500">
            {content.copyright}
          </div>
        </div>
      </footer>
    </section>
  )
}
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Subscribe to Mashroi on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Follow Mashroi on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://threads.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Follow Mashroi on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/revisions" className="hover:text-lime-300">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-lime-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
