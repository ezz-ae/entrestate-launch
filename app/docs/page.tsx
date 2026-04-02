import Link from "next/link"
import { ArrowRight, BookOpen, Database, MapPinned, ShieldCheck } from "lucide-react"

import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"
import { getSortedPostsData } from "../../lib/docs"

const guides = [
  {
    title: "Upgrade your current site",
    description: "Layer AI chat, inventory, scorecards, and heatmaps into the brokerage experience you already own.",
    icon: Database,
  },
  {
    title: "Launch the exclusive platform",
    description: "Deploy the complete MTC operating layer with discovery, lead routing, and trust signals already wired in.",
    icon: ShieldCheck,
  },
  {
    title: "Expand intelligently",
    description: "Roll out the next module when your team is ready, from hyper-local maps to deeper property intelligence.",
    icon: MapPinned,
  },
]

const checklist = [
  "Define whether you want integration or full-platform rollout.",
  "Confirm the lead flow, CRM handoff, and response owners.",
  "Map which intelligence modules launch in phase one.",
  `Share your goals with ${brand.name} and lock the rollout timeline.`,
]

export const revalidate = 60

export default async function DocsPage() {
  const [allPostsData, footer] = await Promise.all([getSortedPostsData(), getMarketingFooter()])

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-8 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#CBB57A]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Documentation</p>
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">MTC rollout guide.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/72">
                Use this page to understand how {brand.productName} fits into your brokerage, what launches first, and
                how the platform grows from fast integration to full operating edge.
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {guides.map((guide) => (
                  <div key={guide.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102347] text-[#CBB57A]">
                      <guide.icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold">{guide.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/72">{guide.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[2rem] border border-white/10 bg-[#102347] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Launch checklist</p>
                <ul className="mt-5 space-y-3 text-white/80">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#CBB57A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="w-full shrink-0">
              <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">Reference docs</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Existing implementation notes and references in this repo.
                  </p>
                </div>

                <nav className="space-y-3">
                  {allPostsData.map(({ id, title }) => (
                    <Link
                      key={id}
                      href={`/docs/${encodeURIComponent(id)}`}
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#081225] px-4 py-3 text-sm text-white/72 transition-all hover:border-[#CBB57A]/30 hover:text-white"
                    >
                      <span>{title || id}</span>
                      <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </nav>

                <div className="rounded-[1.5rem] border border-[#CBB57A]/15 bg-[rgba(203,181,122,0.08)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Need a guided rollout?</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/72">
                    The fastest way to align the project is to book the integration path or claim the exclusive platform.
                  </p>
                  <a
                    href={brand.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#CBB57A]"
                  >
                    {brand.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
