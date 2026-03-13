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
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Process</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            The launch rhythm we follow
          </h2>
          <p className="mt-4 text-sm text-neutral-400 sm:text-base leading-relaxed">
            Every product follows the same high-velocity execution path, ensuring consistency and speed for your launch.
          </p>
        </div>
        
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-lime-400/30 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400 mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-lime-300 transition-colors">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{step.description}</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400/40 group-hover:text-lime-400 transition-colors">
                  Step {index + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
