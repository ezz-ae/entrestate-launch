import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const GoogleAdsPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,176,255,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(199,163,107,0.2),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Google Ads Planner</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Turn budget into an ad plan in minutes.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b6aca0] max-w-xl">
                Enter your target location and budget. We return a structured plan, ad copy, and expected outcomes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Plan in minutes</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">No ads account needed</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Checkout preview</span>
              </div>
              <div className="mt-8 text-sm text-[#b6aca0]">
                Next step:{' '}
                <Link href="/dashboard/google-ads" className="text-[#c7a36b] font-semibold underline">
                  Open Ads Planner
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Ask for an ad plan"
                intro="Tell me your campaign goal and budget. I’ll draft the plan."
                placeholder="Plan ads for Dubai marina..."
                buttonLabel="Start Chat"
                context="Google ads public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'campaign-brief', label: 'Campaign Brief' },
                  { value: 'budget-allocation', label: 'Budget Allocation' },
                  { value: 'keyword-strategy', label: 'Keyword Strategy' },
                ]}
                context="Google ads call preview."
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Let us pull highlights for ad copy and targeting."
                ctaLabel="Upload Brochure"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0f0e0c]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { value: '3x', label: 'Faster campaign drafts' },
              { value: 'AED', label: 'Budget-to-plan preview' },
              { value: '0', label: 'Ads account required' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#14110f] p-6">
                <p className="text-3xl font-semibold text-[#f7f1e6]">{stat.value}</p>
                <p className="text-sm text-[#b6aca0] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Workflow</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              Budget in. Plan out.
            </h2>
          </div>
          <div className="space-y-4 text-[#b6aca0]">
            <p>Define location, budget, and goal.</p>
            <p>Get draft ads, keywords, and projections.</p>
            <p>Checkout with a clear price summary.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Set campaign goal',
            'Input budget + duration',
            'Review draft plan',
            'Confirm checkout summary',
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-[#14110f] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c7a36b]">Step {index + 1}</p>
              <p className="mt-2 text-lg text-[#f5f1e8]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </FunnelShell>
  );
};

export default GoogleAdsPublicPage;
