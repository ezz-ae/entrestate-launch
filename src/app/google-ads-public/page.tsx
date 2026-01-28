import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';

const GoogleAdsPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Google Ads</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Controlled spend. Predictable output.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                Ads should feel mechanical. You set the budget and duration, the plan shows the range.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>No agency pitch. Just inputs and a plan.</p>
                <p>Expectations are stated before you pay.</p>
                <p>Checkout is a summary, not a surprise.</p>
              </div>
              <div className="mt-8">
                <Link
                  href="/dashboard/google-ads"
                  className="inline-flex items-center rounded-xl bg-[#7aa5ff] px-5 py-3 text-sm uppercase tracking-[0.2em] font-semibold text-[#0a0f1c]"
                >
                  Plan Ads
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#101829] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7aa5ff]">How it feels</p>
              <div className="mt-4 space-y-4 text-sm text-[#b7c3df]">
                <p>Budget in. Targets out.</p>
                <p>Keywords selected from your market intent.</p>
                <p>Ranges shown, not promises.</p>
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  'Set goal',
                  'Set budget + duration',
                  'Review plan text',
                  'Approve checkout summary',
                ].map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-[#0b1222] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#7aa5ff]">Step {index + 1}</p>
                    <p className="mt-2 text-sm text-[#e8edf7]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">
          {[
            { value: 'Plan', label: 'First, spend later' },
            { value: 'Range', label: 'Expected outcomes' },
            { value: 'Fixed', label: 'Checkout summary' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#101829] p-6">
              <p className="text-3xl font-semibold text-[#f4f7ff]">{stat.value}</p>
              <p className="text-sm text-[#b7c3df] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </FunnelShell>
  );
};

export default GoogleAdsPublicPage;
