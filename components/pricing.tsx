import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { getMarketingPricing } from "@/lib/marketing"
import { brand } from "@/lib/brand"
import { defaultPricing } from "@/lib/marketing-defaults"

type Feature = { text: string; muted?: boolean }

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#8FA686]" />
      <span className={`text-sm ${muted ? "text-neutral-400" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

export async function Pricing() {
  const pricing = await getMarketingPricing()
  const safePricing = pricing.plans.some((plan) => ["builder", "templates", "custom"].includes(plan.id))
    ? defaultPricing
    : pricing

  return (
    <section id="pricing" className="text-white relative overflow-hidden" itemScope itemType="https://schema.org/PriceSpecification">
       <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]/90">Pricing</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            {safePricing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-300 sm:text-base" itemProp="description">
            {safePricing.subtitle}
          </p>
        </div>

        <div className={`mt-16 grid gap-8 ${safePricing.plans.length === 2 ? "mx-auto max-w-5xl lg:grid-cols-2" : "lg:grid-cols-3"}`}>
          {safePricing.plans.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.featured
                  ? "relative z-10 scale-105 overflow-hidden rounded-3xl border-2 border-[#CBB57A]/45 bg-[#102347]/60 p-2 shadow-[0_0_50px_rgba(203,181,122,0.12)] transition-all duration-300"
                  : "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl transition-all duration-300 hover:border-white/20"
              }
              itemScope
              itemType="https://schema.org/Offer"
            >
              {plan.badge && (
                <div className="absolute right-4 top-4 rounded-full bg-[#CBB57A] px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-[#102347]">
                  {plan.badge}
                </div>
              )}
              <CardHeader className="space-y-2 p-6">
                <div
                  className={
                    plan.featured
                      ? "text-sm font-semibold uppercase tracking-widest text-[#CBB57A]"
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
                  asChild
                  className={
                    plan.featured
                      ? "mt-8 w-full rounded-full bg-[#CBB57A] py-6 font-bold text-[#102347] hover:bg-[#d8c590]"
                      : "mt-8 w-full rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 py-6"
                  }
                >
                  <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                    {plan.cta}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
