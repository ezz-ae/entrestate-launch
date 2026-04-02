import { AppverseFooter } from "@/components/appverse-footer"
import { Pricing } from "@/components/pricing"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export default async function PricingPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-[100dvh] bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Launch paths</p>
            <h1 className="text-4xl font-black tracking-tight md:text-7xl">Choose your MTC rollout.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
              Start with the intelligence modules your brokerage needs today, or claim the full exclusive platform and
              deploy the complete {brand.productName} in one move.
            </p>
          </div>
          <Pricing />
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
