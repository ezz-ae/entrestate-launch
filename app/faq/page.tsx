import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AppverseFooter } from "@/components/appverse-footer"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/lib/brand"
import { getMarketingFooter } from "@/lib/marketing"

const faqs = [
  {
    question: "Can MTC plug into our current brokerage website?",
    answer:
      "Yes. MTC is modular by design. We can integrate AI chat, inventory intelligence, scorecards, and map experiences into your current site without forcing a full rebuild.",
  },
  {
    question: "What data powers the platform?",
    answer:
      "The core system is built around a structured 2,500+ UAE project inventory, buyer-behavior tracking, and zone-level market signals that help qualify intent faster.",
  },
  {
    question: "What is the difference between the two launch paths?",
    answer:
      "Path 1 upgrades your current site with selected intelligence modules. Path 2 delivers the full exclusive turnkey platform with the complete MTC stack already wired in.",
  },
  {
    question: "How does the AI help my sales team?",
    answer:
      "MTC captures engagement signals, identifies likely buyer intent, recommends next actions, and helps route higher-value conversations toward booking, follow-up, and lead ownership.",
  },
  {
    question: "Do you offer exclusivity?",
    answer:
      "Yes. The turnkey platform is sold one time so the full experience remains exclusive to a single buyer rather than becoming a commodity template in the market.",
  },
  {
    question: "How do we get started?",
    answer:
      `Start with a discovery call, then choose whether to upgrade your existing site or claim the exclusive platform. From there, we map the modules, rollout, and launch timeline around your brokerage goals.`,
  },
]

export const revalidate = 60

export default async function FAQPage() {
  const footer = await getMarketingFooter()

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">FAQ</p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Questions brokerages ask before they upgrade.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/72">
              Everything you need to know about the MTC intelligence engine, integration path, and exclusive platform rollout.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-xl"
              >
                <AccordionTrigger className="py-4 text-left text-lg font-semibold transition-colors hover:text-[#CBB57A]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-white/72">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-20 text-center">
            <p className="mb-6 text-neutral-400">Need answers tailored to your brokerage?</p>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
            >
              {brand.email}
            </a>
          </div>
        </div>
      </section>

      <AppverseFooter content={footer} />
    </main>
  )
}
