import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Pricing } from "@/components/pricing"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export default async function PricingPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80 mb-4">Investment</p>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6">Simple Pricing.</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-neutral-400 leading-relaxed">
              Choose the launch path that fits your brokerage. Pay once for templates, or subscribe for full AI builder access.
            </p>
          </div>
          <Pricing />
        </div>
      </section>
      <AppverseFooter content={footer} />
    </main>
  )
}
