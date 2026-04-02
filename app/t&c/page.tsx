import type { Metadata } from "next"

import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

export const metadata: Metadata = {
  title: `Terms and Conditions - ${brand.shortName}`,
  description: `Terms and conditions for ${brand.name} and the ${brand.productName}.`,
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export const revalidate = 60

const sections = [
  {
    title: "1. Scope",
    body: `${brand.name} provides brokerage intelligence services, site integrations, platform modules, and related delivery work. By accessing or using the site, you agree to these terms.`,
  },
  {
    title: "2. Services",
    body: `Services may include integration into an existing brokerage website, deployment of the exclusive turnkey platform, and ongoing configuration of AI, data, and analytics modules.`,
  },
  {
    title: "3. Intellectual Property",
    body: `Unless otherwise agreed in writing, all proprietary MTC platform logic, implementation methods, and productized modules remain the property of ${brand.name}. Client-owned source assets and approved deliverables remain the client's property subject to payment and licensing terms.`,
  },
  {
    title: "4. Payments and Delivery",
    body: "Project scope, pricing, milestones, and rollout timing are confirmed during the engagement. Delivery timing depends on access to assets, feedback speed, and agreed integrations.",
  },
  {
    title: "5. Liability",
    body: `${brand.name} is not liable for indirect or consequential damages, data loss caused by third-party platforms, or delays caused by missing access, approvals, or external providers.`,
  },
  {
    title: "6. Contact",
    body: `For legal, commercial, or delivery questions, contact ${brand.email}.`,
  },
]

export default async function TermsPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <header className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Legal</p>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Terms and Conditions</h1>
              <p className="text-lg leading-relaxed text-white/72">
                These terms govern your use of {brand.name}, our website, and our brokerage intelligence services.
              </p>
            </header>

            <div className="mt-12 space-y-10">
              {sections.map((section) => (
                <section key={section.title} className="space-y-3 border-t border-white/5 pt-8 first:border-t-0 first:pt-0">
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  <p className="leading-relaxed text-white/72">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
