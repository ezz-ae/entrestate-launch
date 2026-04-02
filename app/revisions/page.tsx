import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

export const revalidate = 60

const policyItems = [
  {
    title: "Included revisions",
    body: "Every engagement includes structured refinement rounds tied to the agreed rollout scope. The exact number depends on whether you choose integration work or the exclusive turnkey platform.",
  },
  {
    title: "Scope discipline",
    body: "Revisions are intended to improve approved modules, content, data presentation, and rollout polish. Net-new modules or materially expanded scope are quoted separately.",
  },
  {
    title: "Turnaround",
    body: "Most copy, configuration, and data-display refinements are handled quickly once inputs are received. Timeline-sensitive changes are prioritized during active rollout windows.",
  },
]

export default async function RevisionPolicyPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <header className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Policy</p>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Revision Policy</h1>
              <p className="text-lg leading-relaxed text-white/72">
                Our revision process keeps delivery focused, transparent, and aligned with the agreed MTC rollout.
              </p>
            </header>

            <div className="mt-12 space-y-8">
              {policyItems.map((item) => (
                <section key={item.title} className="space-y-3 rounded-[1.5rem] border border-white/10 bg-[#0d1831] p-6">
                  <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                  <p className="leading-relaxed text-white/72">{item.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-10 space-y-3 border-t border-white/5 pt-8">
              <h2 className="text-2xl font-bold text-white">Contact</h2>
              <p className="text-white/72">For revision questions, rollout support, or scope clarification, contact us at:</p>
              <p className="font-bold text-[#CBB57A]">
                <a href={`mailto:${brand.email}`} className="underline underline-offset-4">
                  {brand.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
