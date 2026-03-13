import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { getMarketingPricing } from "@/lib/marketing"

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

export async function Pricing() {
  const pricing = await getMarketingPricing()

  return (
    <section id="pricing" className="text-white relative overflow-hidden" itemScope itemType="https://schema.org/PriceSpecification">
       <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Pricing</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            {pricing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-300 sm:text-base" itemProp="description">
            {pricing.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.featured
                  ? "relative overflow-hidden rounded-3xl border-2 border-lime-400/50 bg-neutral-900/50 p-2 shadow-[0_0_50px_rgba(132,204,22,0.15)] transition-all duration-300 scale-105 z-10"
                  : "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl transition-all duration-300 hover:border-white/20"
              }
              itemScope
              itemType="https://schema.org/Offer"
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-lime-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {plan.badge}
                </div>
              )}
              <CardHeader className="space-y-2 p-6">
                <div
                  className={
                    plan.featured
                      ? "text-sm font-semibold text-lime-300 uppercase tracking-widest"
                      : "text-sm font-semibold text-neutral-400 uppercase tracking-widest"
                  }
                  itemProp="name"
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-bold" itemProp="price">
                    {plan.price}
                  </span>
                  {plan.cadence && <span className="text-sm text-neutral-400">{plan.cadence}</span>}
                  <meta itemProp="priceCurrency" content={plan.currency} />
                </div>
                <p className="text-xs text-neutral-500 mt-2">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-3" itemProp="description">
                  {plan.features.map((feature) => (
                    <FeatureItem key={feature} text={feature} />
                  ))}
                </ul>
                <Button
                  className={
                    plan.featured
                      ? "mt-8 w-full rounded-full bg-lime-400 text-black hover:bg-lime-300 py-6 font-bold"
                      : "mt-8 w-full rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 py-6"
                  }
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
