import { PipelineDemo } from '@/app/pipeline-demo';
import { SiteHeader } from '@/components/site-header';
import { GitPullRequest, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LeadPipelinePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <GitPullRequest className="h-4 w-4" />
            <span>Automated CRM</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            The pipeline that <br />
            <span className="text-purple-600">flows itself.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Stop manually dragging cards. Our system tracks every interaction, scores intent, and moves leads forward automatically when they take action.
          </p>
        </div>

        <PipelineDemo />

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <FeatureCard 
            icon={Zap}
            title="Auto-Advance"
            desc="Leads move to 'Qualified' instantly when they book a meeting or answer key questions positively."
          />
          <FeatureCard 
            icon={GitPullRequest}
            title="Smart Routing"
            desc="High-value leads are routed to your top closers. Low-intent leads stay in the AI nurturing loop."
          />
          <FeatureCard 
            icon={BarChart3}
            title="Revenue Attribution"
            desc="See exactly which ad campaign, keyword, and landing page generated the closed deal."
          />
        </div>

        <div className="mt-16 flex justify-center">
          <Link 
            href="/builder-funnel"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900"
          >
            Build Your Pipeline
          </Link>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-4 dark:bg-purple-900/20">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}