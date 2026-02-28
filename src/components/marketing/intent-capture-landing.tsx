import Link from 'next/link';
import { Target, TrendingUp, ArrowRight } from 'lucide-react';
import { IntentCaptureDemo } from '@/components/marketing/intent-capture-demo';
import { SiteHeader } from '@/components/site-header';

export function IntentCaptureLanding() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            <Target className="h-4 w-4" />
            <span>Buyer Demand</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Turn search intent into <br />
            <span className="text-green-600">sold inventory.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Keep your budget focused on people already searching for property. This setup connects active buyers to
            available homes and filters out low-quality traffic.
          </p>
        </div>

        <IntentCaptureDemo />

        <div className="mt-16 flex flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">Ready to capture more inquiries?</h2>
          <Link
            href="/builder-funnel"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg"
          >
            <TrendingUp className="h-4 w-4" /> Launch Campaign
          </Link>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <Link
              href="/discover"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-card-foreground">Market Feed</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Live inventory and market insights.</p>
            </Link>

            <Link
              href="/chat-agent-funnel"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-card-foreground">Property Assistant</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">24/7 replies, lead capture, and viewing requests.</p>
            </Link>

            <Link
              href="/docs"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-500 hover:shadow-md sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-card-foreground">Guides and Help</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Learn how to set up, publish, and manage your pages.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
