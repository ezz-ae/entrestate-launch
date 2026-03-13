"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Why Mashroi closes deals faster.",
  subtitle: "Real estate websites, launched fast and optimized for leads.",
}

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Features</p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Why Mashroi closes deals faster.
        </h2>
        <p className="mt-4 text-sm text-neutral-300 sm:text-base">
          Real estate websites, launched fast and optimized for leads. Our platform combines the speed of AI with the polish of high-end templates.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Launch Speed */}
        <Card className="liquid-glass border border-white/10 group hover:border-lime-300/30 transition-all duration-300">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-lime-300/80 font-semibold uppercase">Launch Speed</p>
            <CardTitle className="mt-1 text-xl text-white">Ready templates + AI builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/intuitive-1.png"
                  alt="Intuitive UI 1"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/intuitive-2.png"
                  alt="Intuitive UI 2"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Capture */}
        <Card className="liquid-glass border border-white/10 group hover:border-lime-300/30 transition-all duration-300">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-lime-300/80 font-semibold uppercase">Lead Gen</p>
            <CardTitle className="mt-1 text-xl text-white">Conversion-first architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="h-2 w-2/3 bg-lime-300/20 rounded-full mb-2" />
                <div className="h-2 w-full bg-white/10 rounded-full mb-2" />
                <div className="h-8 w-1/3 bg-lime-400 rounded-lg mt-4" />
              </div>
              <p className="text-sm text-neutral-400">
                Every page is wired with lead capture forms, WhatsApp routing, and tracking pixels.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Client Love Card */}
        <Card className="liquid-glass border border-white/10 group hover:border-lime-300/30 transition-all duration-300">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-lime-300/80 font-semibold uppercase">Reliability</p>
            <CardTitle className="mt-1 text-xl text-white">
              Trusted by top brokers.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-4">
              <div className="text-5xl font-bold text-lime-300">4.9</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-lime-300 text-lime-300 shadow-[0_0_10px_rgba(132,204,22,0.4)]" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/top-rated-1.png"
                  fill
                  alt="Top rated product"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/top-rated-2.png"
                  fill
                  alt="Top rated project"
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
