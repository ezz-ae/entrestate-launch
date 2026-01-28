import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';

const LeadPipelineOverviewPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Lead Pipeline</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Your leads are not data. They are decisions.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                Each lead has a reason, a source, and a next step. The pipeline is built for clarity, not volume.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>When the signal is weak, you see why.</p>
                <p>When the signal is strong, you see the fastest action.</p>
                <p>No fake scores. No hidden rules.</p>
              </div>
              <div className="mt-8">
                <Link
                  href="/dashboard/leads"
                  className="inline-flex items-center rounded-xl bg-[#40c9c6] px-5 py-3 text-sm uppercase tracking-[0.2em] font-semibold text-[#0a0f1c]"
                >
                  Review Leads
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#101829] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#40c9c6]">Cold calling</p>
              <h2 className="mt-4 text-2xl font-[var(--font-display)]">Calls are for stalled leads.</h2>
              <p className="mt-4 text-sm text-[#b7c3df]">
                If a lead went quiet, a call can reset context. It is a choice, not a blast.
              </p>
              <div className="mt-6 space-y-3 text-sm text-[#b7c3df]">
                <p>Use calls when written follow-up stops working.</p>
                <p>Record outcomes so the system learns what to stop.</p>
                <p>Five ignored calls move a lead to ignore list.</p>
              </div>
              <div className="mt-6">
                <Link
                  href="/dashboard/leads/cold-calling"
                  className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#e8edf7]"
                >
                  Open Call Planner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">
          {[
            { value: '12', label: 'Leads per page' },
            { value: '1', label: 'Unified timeline' },
            { value: '0', label: 'Duplicate entries' },
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

export default LeadPipelineOverviewPage;
