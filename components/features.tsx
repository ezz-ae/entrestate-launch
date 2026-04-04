import { Bot, CreditCard, Database, MapPinned } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Live intelligence modules",
    eyebrow: "Real product value",
    description:
      "Show inventory, developer scorecards, ROI context, and hyper-local insights in experiences buyers can actually use.",
    icon: Database,
  },
  {
    title: "Interactive builder flow",
    eyebrow: "Hands-on demo",
    description:
      "Visitors can preview a live module, chat with the AI builder, change content, and see how the experience adapts.",
    icon: Bot,
  },
  {
    title: "Commercial launch paths",
    eyebrow: "Monetizable offers",
    description:
      "Sell a fast pilot, integrate into an existing brokerage site, or close the exclusive turnkey platform engagement.",
    icon: CreditCard,
  },
  {
    title: "Brokerage-specific rollout",
    eyebrow: "Implementation clarity",
    description:
      "Guide buyers from discovery into docs, pricing, FAQs, and module pages so they understand exactly what they are buying.",
    icon: MapPinned,
  },
]

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Why this site works</p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Built to explain, demonstrate, and convert.
        </h2>
        <p className="mt-4 text-sm text-neutral-300 sm:text-base">
          The site now points visitors toward real actions: explore modules, try the builder, understand rollout paths,
          and move into a paid engagement.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#CBB57A]/30"
          >
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102347] text-[#CBB57A]">
                <feature.icon className="h-6 w-6" />
              </div>
              <p className="pt-5 text-[11px] font-semibold uppercase tracking-widest text-[#CBB57A]">{feature.eyebrow}</p>
              <CardTitle className="mt-1 text-xl text-white">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-300">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
