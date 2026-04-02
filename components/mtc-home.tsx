import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Database,
  MapPinned,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"

const marketSignals = [
  { label: "Active Buyers", value: "452", tone: "bg-[#F7F4EE] text-[#102347]" },
  { label: "Market Trend", value: "+3.4%", tone: "bg-[#EAF1E8] text-[#527556]" },
  { label: "New Listings", value: "128", tone: "bg-[#F6E8E1] text-[#C98765]" },
  { label: "Avg. Days on Market", value: "15", tone: "bg-white text-[#102347]" },
]

const superpowers = [
  {
    title: "Superpower 1: The Ultimate Inventory",
    description:
      "Instantly plug into a fully structured, auto-updating database of 2,500+ UAE projects. From off-plan launches to ready units, never touch a manual spreadsheet again.",
    icon: Database,
    accent: "from-[#CBB57A]/20 to-transparent",
  },
  {
    title: "Superpower 2: The 25-Year Market Veteran",
    description:
      "A built-in AI sales director that captures visitor data, qualifies investor intent, and recommends properties with decades of market mastery.",
    icon: Bot,
    accent: "from-[#8FA686]/20 to-transparent",
  },
  {
    title: "Superpower 3: Developer Scorecards",
    description:
      "Arm buyers with confidence using complete developer histories, past yield performance, delivery reliability, and escrow verification cues.",
    icon: ShieldCheck,
    accent: "from-[#D59B7C]/20 to-transparent",
  },
  {
    title: "Superpower 4: Hyper-Local Heatmaps",
    description:
      "Display live under-construction density, prominent developers, and precise ROI intelligence for every key zone in Dubai.",
    icon: MapPinned,
    accent: "from-[#9FB8B1]/20 to-transparent",
  },
]

const standardBroker = [
  "Manual spreadsheet updates",
  "Basic contact forms",
  "Endless browsing",
  "Zero actionable data",
]

const intelligenceEngine = [
  "Live 2,500+ project database",
  "AI intent tracking",
  "Guided discovery journeys",
  "Developer and ROI analytics",
]

const modules = ["AI Chat", "2500+ Database", "Dubai Map", "Developer Scorecards"]

const turnkeyHighlights = [
  "Done-for-you exclusive platform",
  "One site sold one time",
  "Lead routing and qualification built in",
  "Expandable roadmap from transactions to full property history",
]

export function MtcHome() {
  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(30,54,103,0.55),transparent_40%),linear-gradient(180deg,#081225_0%,#0c1730_55%,#081225_100%)] text-white">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <section id="home" className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center py-10 sm:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">
              <Sparkles className="h-3.5 w-3.5" />
              {brand.productName}
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
                The Traditional Real Estate Website is Dead.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                Stop losing leads to static brochures. Buyers demand instant data, guided discovery, and live market
                intelligence. {brand.shortName} gives your brokerage the operating edge modern clients expect.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="rounded-full bg-[#CBB57A] px-7 py-6 text-base font-semibold text-[#102347] hover:bg-[#d8c590]">
                <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                  {brand.ctaLabel}
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-7 py-6 text-base text-white hover:bg-white/10">
                <Link href="/#paths">
                  Explore launch paths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "24/7 lead qualification",
                "2,500+ UAE projects",
                "Developer and ROI analytics",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#F7F4EE] p-6 text-[#102347] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {marketSignals.map((signal) => (
                <div key={signal.label} className={`rounded-[1.5rem] border border-[#102347]/10 p-5 shadow-sm ${signal.tone}`}>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-current/65">{signal.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <span className="text-3xl font-black tracking-tight sm:text-4xl">{signal.value}</span>
                    <BarChart3 className="h-6 w-6 opacity-65" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-[#102347]/10 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#102347]/55">Buyer pulse</p>
                  <p className="mt-2 text-2xl font-black">High-intent demand is rising.</p>
                </div>
                <ArrowUpRight className="h-7 w-7 text-[#8FA686]" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#102347]/65">
                Replace brochure-style websites with a live intelligence layer that surfaces intent, responds instantly,
                and routes the next best action.
              </p>
            </div>
          </div>
        </section>

        <section id="engine" className="grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-[#102347] shadow-[0_40px_100px_rgba(0,0,0,0.28)]">
            <div className="inline-flex items-center rounded-full bg-[#F6E8E1] px-4 py-2 text-sm font-semibold text-[#C98765]">
              High-Intent Buyer Captured
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-[#102347]/10 bg-[#F7F4EE] p-5">
              <h3 className="text-xl font-bold">Lead Intelligence</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3 rounded-[1.25rem] bg-white p-4">
                  {[
                    'Buyer A viewed "Luxury Condo" 10+ times',
                    'Buyer B downloaded the market report',
                    'Buyer C booked a virtual tour for 2 PM',
                  ].map((item, index) => (
                    <div key={item} className="rounded-2xl border border-[#102347]/8 bg-[#F7F4EE] px-4 py-3 text-sm leading-relaxed">
                      <p className="font-semibold text-[#102347]">Lead {index + 1}</p>
                      <p className="text-[#102347]/68">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="rounded-[1.25rem] bg-white p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#102347]/55">Qualification score</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-4xl font-black">65%</span>
                      <span className="rounded-full bg-[#EAF1E8] px-3 py-1 text-sm font-semibold text-[#527556]">High intent</span>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-[#EAF1E8] p-4 text-[#527556]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#527556]/70">Recommendation</p>
                    <p className="mt-2 text-sm font-medium">Auto-send personalized property alerts based on saved villa interest.</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-[#F6E8E1] p-4 text-[#B56E4F]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B56E4F]/70">Next action</p>
                    <p className="mt-2 text-sm font-medium">Schedule the follow-up call while engagement is peaking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:pl-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">24/7 intelligence</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Upgrade to a 24/7 Intelligence Engine</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75">
              Your website should not just display properties. It should actively match buyer intent, qualify leads,
              and move conversations forward while your team sleeps.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Capture lead behavior instantly",
                "Qualify investor intent in real time",
                "Recommend next actions automatically",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="superpowers" className="py-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Core modules</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Four superpowers. One brokerage edge.</h2>
            <p className="text-lg leading-relaxed text-white/72">
              Start with one module or deploy the full stack. Each capability turns generic property browsing into a
              decision-ready experience.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {superpowers.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80`} />
                <div className="relative flex items-start gap-4">
                  <div className="rounded-2xl border border-white/10 bg-[#102347] p-3 text-[#CBB57A]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold leading-tight text-white">{item.title}</h3>
                    <p className="text-base leading-relaxed text-white/72">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="advantage" className="py-10">
          <div className="rounded-[2.25rem] border border-white/10 bg-[#F7F4EE] px-6 py-8 text-[#102347] shadow-[0_40px_120px_rgba(0,0,0,0.22)] sm:px-10 sm:py-10">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8FA686]">The unfair advantage</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Stop competing with outdated tools.</h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-[#102347]/70">
                See why data-driven brokers dominate the market while traditional brochure sites leak intent and momentum.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-[#102347]/10 bg-white p-6">
                <h3 className="text-2xl font-bold">Standard Broker Site</h3>
                <ul className="mt-6 space-y-4">
                  {standardBroker.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-lg text-[#102347]/75">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D8605A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-[#102347]/10 bg-[#102347] p-6 text-white">
                <h3 className="text-2xl font-bold">{brand.productName}</h3>
                <ul className="mt-6 space-y-4">
                  {intelligenceEngine.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-lg text-white/82">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#CBB57A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="paths" className="py-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Launch paths</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Choose the route that fits your brokerage.</h2>
            <p className="text-lg leading-relaxed text-white/72">
              Integrate the intelligence layer into your existing site, or claim the full exclusive platform with every
              core capability already wired in.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Path 1</p>
                  <h3 className="mt-3 text-3xl font-bold">Upgrade Your Current Site</h3>
                </div>
                <Building2 className="h-7 w-7 text-[#CBB57A]" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-white/72">
                Already have a website you love? We can seamlessly integrate any or all intelligence modules into your
                existing platform and modernize the experience fast.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {modules.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#CBB57A]/25 bg-[#102347] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CBB57A]">Path 2</p>
                  <h3 className="mt-3 text-3xl font-bold">The Exclusive Turnkey Platform</h3>
                </div>
                <Bot className="h-7 w-7 text-[#CBB57A]" />
              </div>
              <p className="mt-4 text-base leading-relaxed text-white/72">
                Need a new site? Claim the fully integrated, done-for-you broker ecosystem. We sell one site one time to
                ensure your exclusivity.
              </p>
              <ul className="mt-6 space-y-3 text-white/82">
                {turnkeyHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#CBB57A]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(203,181,122,0.16),transparent_40%),#F7F4EE] px-6 py-10 text-center text-[#102347] shadow-[0_40px_120px_rgba(0,0,0,0.22)] sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#527556]">Final call</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Equip Your Brokerage With Superpowers
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#102347]/72 sm:text-xl">
              Do not let another lead bounce. Claim your platform now. Our expandable superpowers cover everything from
              transactions to full property history.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="rounded-full bg-[#102347] px-8 py-6 text-base font-semibold text-white hover:bg-[#183468]">
                <a href={brand.ctaHref} target="_blank" rel="noopener noreferrer">
                  {brand.ctaLabel}
                </a>
              </Button>
              <span className="text-sm font-medium uppercase tracking-[0.22em] text-[#102347]/55">{brand.domain}</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
