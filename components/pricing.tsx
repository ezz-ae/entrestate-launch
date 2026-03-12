"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

type Feature = { text: string; muted?: boolean }

const ACCENT = "#C6FF3A"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-300" : "text-neutral-100"}`}>{text}</span>
    </li>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="text-white" itemScope itemType="https://schema.org/PriceSpecification">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", border: `1px solid ${ACCENT}` }}
          >
            Our Pricing and Packages
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            Our Pricing.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-300" itemProp="description">
            Buy a ready template once, or start from scratch with the AI builder.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="rounded-full px-5 text-neutral-900 hover:brightness-95"
              style={{ backgroundColor: "#f2f2f2" }}
            >
              <a href="#products">See products</a>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Template Purchase */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100" itemProp="name">
                Gold Century Template
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  AED 2,399
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-300">one-time</span>
                <meta itemProp="priceCurrency" content="AED" />
              </div>
              <Button className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors">
                Buy template
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "Luxury Dubai investment layout",
                  "Live subdomain included",
                  "AI builder customization",
                  "Lead capture + chat widgets",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Builder Subscription */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100" itemProp="name">
                AI Builder (from scratch)
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  $20
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-300">/ month</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors">
                Start builder
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "Start from a blank canvas",
                  "AI-assisted content + layout",
                  "Publish to a live subdomain",
                  "Upgrade to a template anytime",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Custom Templates */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-[0_16px_50px_rgba(0,0,0,0.4)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="relative space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100" itemProp="name">
                More templates
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight" itemProp="price">
                  Custom pricing
                </div>
                <span className="pb-0.5 text-[11px] text-neutral-300">per template</span>
                <meta itemProp="priceCurrency" content="AED" />
              </div>
              <Button className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors">
                Request catalog
              </Button>
            </CardHeader>
            <CardContent className="relative pt-0">
              <ul className="grid gap-2" itemProp="description">
                {[
                  "Broker sites, bio links, and AI agents",
                  "Each template includes subdomain",
                  "Customize instantly with AI builder",
                  "Ask for pricing per template",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
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
