import { CheckCircle2, Radar, Wand2 } from "lucide-react"

const steps = [
  {
    title: "Strategy intake",
    description: "We map your market, buyer journey, data requirements, and rollout priorities before any integration begins.",
    icon: Radar,
  },
  {
    title: "Execution sprint",
    description: "Module setup, intelligence wiring, and experience tuning happen in one focused delivery cycle.",
    icon: Wand2,
  },
  {
    title: "Launch + optimize",
    description: "We go live, validate the buyer flow, and hand over the next set of optimization opportunities.",
    icon: CheckCircle2,
  },
]

export function ExecutionSteps() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(203,181,122,0.12),rgba(0,0,0,0))]" />
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#CBB57A]">Process</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            The rollout rhythm we follow
          </h2>
          <p className="mt-4 text-sm text-neutral-400 sm:text-base leading-relaxed">
            Every MTC module follows the same focused execution path so your team can move fast without losing clarity.
          </p>
        </div>
        
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#CBB57A]/30 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#CBB57A]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CBB57A]/10 text-[#CBB57A] transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-[#CBB57A]">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{step.description}</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#CBB57A]/40 transition-colors group-hover:text-[#CBB57A]">
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
