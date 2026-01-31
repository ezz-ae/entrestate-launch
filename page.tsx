import { IntentCaptureDemo } from '@/components/marketing/demos/intent-capture-demo';
import { SiteHeader } from '@/components/layout/site-header';
import { Target, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function GoogleAdsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Target className="h-4 w-4" />
            <span>High Intent Capture</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Turn search intent into <br />
            <span className="text-green-600">sold inventory.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Stop wasting budget on broad audiences. Our Intent Engine connects active searchers directly to your available units, filtering out low-quality traffic before you pay for it.
          </p>
        </div>

        <IntentCaptureDemo />

        <div className="mt-16 flex flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to capture demand?</h2>
          <Link 
            href="/builder-funnel"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900"
          >
            <TrendingUp className="h-4 w-4" /> Launch Campaign
          </Link>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 text-left">
            <Link 
              href="/discover"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Market Feed</h3>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-slate-500">Live inventory & market insights.</p>
            </Link>

            <Link 
              href="/chat-agent-funnel"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">AI Sales Agent</h3>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-slate-500">24/7 lead qualification & booking.</p>
            </Link>

            <Link 
              href="/docs"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">System Documentation</h3>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-slate-500">Learn how the Entrestate Operating System works.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}