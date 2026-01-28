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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Google Ads</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Budget in. Plan out. No surprises.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                You get a clear plan, ad copy draft, and expected range before spending.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">No ads account</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Plan first</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Clear pricing</span>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Next step:{' '}
                <Link href="/dashboard/google-ads" className="text-[#7aa5ff] font-semibold underline">
                  Open Ads Planner
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Ask for an ad plan"
                intro="Share a goal and a budget. The plan appears with ranges and copy."
                placeholder="Plan ads for Dubai marina..."
                buttonLabel="Draft Plan"
                context="Google ads public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Call preview"
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
                description="Pull highlights for ad copy and keywords."
                ctaLabel="Upload Brochure"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { value: 'Plan', label: 'Before spend' },
              { value: 'Range', label: 'Expected outcomes' },
              { value: 'Fixed', label: 'Checkout summary' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#101829] p-6">
                <p className="text-3xl font-semibold text-[#f4f7ff]">{stat.value}</p>
                <p className="text-sm text-[#b7c3df] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Flow</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              Surgical planning, not guesswork.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>Set budget and duration.</p>
            <p>Review plan and copy.</p>
            <p>Checkout with a clear summary.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Set goal',
            'Input budget',
            'Generate plan',
            'Confirm checkout',
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-[#101829] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7aa5ff]">Step {index + 1}</p>
              <p className="mt-2 text-lg text-[#e8edf7]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </FunnelShell>
  );
};

export default GoogleAdsPublicPage;
