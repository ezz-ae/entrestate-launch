import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

export default async function RevisionPolicyPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4 max-w-4xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="relative space-y-12">
              <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Support</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Revision Policy</h1>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Our revision policy ensures transparency and fairness for all clients while maintaining the quality and efficiency of our AI-driven build process.
                </p>
              </header>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">1. Included Revisions</h2>
                <p className="text-neutral-400">
                  Each template purchase includes a set number of AI-assisted revision cycles:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="font-bold text-white mb-1">Standard Templates</h4>
                    <p className="text-xs text-neutral-500">2 deep revision cycles included.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="font-bold text-white mb-1">Custom Solutions</h4>
                    <p className="text-xs text-neutral-500">Unlimited iterations until launch.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-white">2. Scope of Revisions</h2>
                <p className="text-neutral-400 leading-relaxed">
                  Revisions are meant to refine and adjust the agreed deliverables (copy, brand colors, imagery), not to expand the original scope or switch templates. Significant layout changes or additional feature requests will be quoted separately.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-white">3. Turnaround Time</h2>
                <p className="text-neutral-400 leading-relaxed">
                  AI-assisted revisions are applied in real-time. Human-assisted design tweaks typically take 24-48 business hours.
                </p>
              </section>

              <section className="space-y-3 border-t border-white/5 pt-8">
                <h2 className="text-2xl font-bold text-white">4. Contact Us</h2>
                <p className="text-neutral-400">
                  For questions regarding our revision policy, please contact us at:
                </p>
                <p className="text-lime-300 font-bold">
                  Email: <a href="mailto:hello@mashroi.com" className="underline underline-offset-4">hello@mashroi.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter content={footer} />
    </main>
  )
}
