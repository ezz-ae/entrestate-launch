import { CheckCircle2, Radar, Wand2 } from "lucide-react"

const steps = [
  {
    title: "Strategy intake",
    description: "We map your market, inventory focus, and brand voice before any layout work begins.",
    icon: Radar,
  },
  {
    title: "Execution sprint",
    description: "Design, copy, and conversion wiring happen in one tight build cycle with daily updates.",
    icon: Wand2,
  },
  {
    title: "Launch + optimize",
    description: "We go live, test conversion paths, and deliver a checklist of quick wins to keep improving.",
    icon: CheckCircle2,
  },
]

export function ExecutionSteps() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-300/80">Execution</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            The launch rhythm we follow
          </h2>
          <p className="mt-3 text-sm text-neutral-300 sm:text-base">
            Every product follows the same high-velocity execution path so you know exactly what happens next.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-300">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
