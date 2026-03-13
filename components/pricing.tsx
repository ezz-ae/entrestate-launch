"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

type Feature = { text: string; muted?: boolean }

const ACCENT = "var(--color-lime-300)"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-lime-400" />
      <span className={`text-sm ${muted ? "text-neutral-400" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="text-white relative overflow-hidden" itemScope itemType="https://schema.org/PriceSpecification">
       <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Pricing</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-300 sm:text-base" itemProp="description">
            Buy a ready template once, or start from scratch with the AI builder. No hidden fees, just high-performance results.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Builder Subscription */}
          <Card
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl transition-all duration-300 hover:border-white/20"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-2 p-6">
              <div className="text-sm font-semibold text-neutral-400 uppercase tracking-widest" itemProp="name">
                AI Builder
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-bold" itemProp="price">$20</span>
                <span className="text-sm text-neutral-400">/mo</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">Perfect for DIYers starting fresh.</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="space-y-3" itemProp="description">
                {[
                  "Start from a blank canvas",
                  "AI-assisted content + layout",
                  "Publish to a live subdomain",
                  "Full control over every page",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 py-6">
                Start builder
              </Button>
            </CardContent>
          </Card>

          {/* Template Purchase */}
          <Card
            className="relative overflow-hidden rounded-3xl border-2 border-lime-400/50 bg-neutral-900/50 p-2 shadow-[0_0_50px_rgba(132,204,22,0.15)] transition-all duration-300 scale-105 z-10"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div className="absolute top-4 right-4 bg-lime-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
              Popular
            </div>
            <CardHeader className="space-y-2 p-6">
              <div className="text-sm font-semibold text-lime-300 uppercase tracking-widest" itemProp="name">
                Ready Templates
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-sm text-neutral-400">from</span>
                <span className="text-4xl font-bold" itemProp="price">AED 2,399</span>
                <meta itemProp="priceCurrency" content="AED" />
              </div>
              <p className="text-xs text-neutral-400 mt-2">One-time purchase. Professional setup.</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="space-y-3" itemProp="description">
                {[
                  "Luxury Dubai-ready layouts",
                  "Live subdomain + hosting",
                  "AI builder customization",
                  "Lead capture + CRM wiring",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-full bg-lime-400 text-black hover:bg-lime-300 py-6 font-bold">
                Buy a template
              </Button>
            </CardContent>
          </Card>

          {/* Custom / Enterprise */}
          <Card
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl transition-all duration-300 hover:border-white/20"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-2 p-6">
              <div className="text-sm font-semibold text-neutral-400 uppercase tracking-widest" itemProp="name">
                Custom Solutions
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-bold" itemProp="price">Custom</span>
                <meta itemProp="priceCurrency" content="AED" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">For large teams and custom needs.</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="space-y-3" itemProp="description">
                {[
                  "Bulk template licenses",
                  "White-label options",
                  "Custom AI agent training",
                  "Dedicated support channel",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 py-6">
                Request Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
                    <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
                    <span className="text-sm text-neutral-100">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>
        </div>
      </div>
    </section>
  )
}
