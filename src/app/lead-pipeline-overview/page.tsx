import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const LeadPipelineOverviewPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Lead Pipeline</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Every lead is clear, ranked, and ready.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                No spreadsheets. No guessing. See intent, source, and next action in one view.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Deduped leads</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Intent scores</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Sender-aware</span>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Next step:{' '}
                <Link href="/dashboard/leads" className="text-[#40c9c6] font-semibold underline">
                  Open the pipeline
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Simulate a lead intake"
                intro="Ask a buying question and watch how the lead is qualified."
                placeholder="Ask about a listing or investment..."
                buttonLabel="Start Chat"
                context="Lead pipeline public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'qualification', label: 'Lead Qualification' },
                  { value: 'follow-up', label: 'Follow-up Strategy' },
                  { value: 'handoff', label: 'Handoff Workflow' },
                ]}
                context="Lead pipeline call preview."
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Attach context so leads are routed with accuracy."
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Flow</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              Lead clarity without noise.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>Leads arrive from chat and site in the same format.</p>
            <p>Accept or reject with reasoning stored.</p>
            <p>Senders are enabled only when providers exist.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Lead arrives',
            'Intent scored',
            'Decision logged',
            'Action routed',
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-[#101829] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#40c9c6]">Step {index + 1}</p>
              <p className="mt-2 text-lg text-[#e8edf7]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </FunnelShell>
  );
};

export default LeadPipelineOverviewPage;
