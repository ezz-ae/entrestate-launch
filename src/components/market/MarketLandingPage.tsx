import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SystemFlow } from '@/components/marketing/system-flow';
import { SystemInsights } from '@/components/marketing/system-insights';
import { ReadyBuilds } from '@/components/marketing/feature-showcase/ready-builds';
import { BuilderShowcase } from '@/components/marketing/feature-showcase/builder-showcase';
import { AdsShowcase } from '@/components/marketing/feature-showcase/ads-showcase';
import { ChatAgentShowcase } from '@/components/marketing/feature-showcase/chat-agent-showcase';
import { SeoShowcase } from '@/components/marketing/feature-showcase/seo-showcase';
import { IntentCaptureDemo } from '@/components/marketing/intent-capture-demo';
import { ProductCard } from '@/components/market/ProductCard';
import { listCatalogItems } from '@/lib/server/commerce/products';

const EXAMPLES = [
  {
    title: 'Off-plan project page',
    description: 'Brochure turned into a lead-ready page with pricing tables, floor plans, and direct WhatsApp routing.',
    result: 'Shipped in 24h',
  },
  {
    title: 'Brokerage launch site',
    description: 'Multi-agent directory with featured listings, structured SEO pages, and centralized lead capture.',
    result: 'Team onboarding in 1 day',
  },
  {
    title: 'Agent bio link',
    description: 'Mobile-first profile page that aggregates top projects, booking CTA, and analytics-ready links.',
    result: 'Instant deployment',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How fast can a deployment go live?',
    answer:
      'Most products are delivered in 24 hours or faster. Instant products unlock immediately after checkout.',
  },
  {
    question: 'Do I need any setup before ordering?',
    answer:
      'No. You choose a package, place your order, and we prepare everything so your team can start right away.',
  },
  {
    question: 'Can I request revisions after delivery?',
    answer:
      'Yes. Each product includes a defined edits allowance, so your team can request guided changes after first delivery.',
  },
  {
    question: 'Can my team connect domains later?',
    answer:
      'Yes. You can connect your domain at any time, and we can help your team with setup.',
  },
];

export function MarketLandingPage() {
  const products = listCatalogItems();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Entrestate Market
          </Link>
          <nav className="hidden items-center gap-5 text-xs uppercase tracking-wide text-muted-foreground md:flex">
            <Link href="#how-it-works" className="hover:text-foreground">
              How it works
            </Link>
            <Link href="#proof" className="hover:text-foreground">
              Proof
            </Link>
            <Link href="#products" className="hover:text-foreground">
              Products
            </Link>
            <Link href="#faq" className="hover:text-foreground">
              FAQ
            </Link>
          </nav>
          <Link
            href="#products"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            Buy now
          </Link>
        </div>
      </header>

      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.28),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Entrestate Deployment Market</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Launch real estate pages that look premium and ship on schedule.
          </h1>
          <p className="mt-5 max-w-3xl text-base text-muted-foreground md:text-lg">
            Pick a package, pay once, and start quickly with a clear delivery plan made for real-estate teams.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#products"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Buy a deployment
            </Link>
            <Link
              href="#proof"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              See examples
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              24h launch kits
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Built-in lead capture
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Team access controls
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:py-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">From listing details to launch in a few clear steps</h2>
        </div>
        <SystemFlow />
      </section>

      <section id="proof" className="scroll-mt-24 border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Proof and examples</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">What teams are shipping</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {EXAMPLES.map((example) => (
              <article key={example.title} className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{example.result}</p>
                <h3 className="mt-2 text-xl font-semibold">{example.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{example.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SystemInsights />
      <ReadyBuilds />
      <BuilderShowcase />
      <AdsShowcase ctaLabel="Open Google Ads" ctaHref="/google-ads" />
      <ChatAgentShowcase />
      <SeoShowcase />

      <section className="border-y border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live walkthrough</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">See buyer demand in motion</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            This walkthrough shows how buyer searches are filtered, matched to available homes, and turned into qualified inquiries.
          </p>
          <div className="mt-10">
            <IntentCaptureDemo />
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Products</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Choose the package that fits your team</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Answers before checkout</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className="rounded-xl border border-border bg-card p-5 text-card-foreground">
                <h3 className="text-base font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="rounded-3xl border border-border bg-card p-8 text-card-foreground md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Final CTA</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Ready to launch your next property page?</h2>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Start with one package, then expand as your listings and lead flow grow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#products"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Buy a deployment
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Start from brochure
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
