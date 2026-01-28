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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,163,107,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(120,90,70,0.2),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Lead Pipeline</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Qualify, route, and act on every lead in one place.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b6aca0] max-w-xl">
                Chat, site, and social leads flow into the same pipe. You see intent scores, dedupe results, and next actions.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Deduped leads</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Intent scoring</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Sender-aware</span>
              </div>
              <div className="mt-8 text-sm text-[#b6aca0]">
                Next step:{' '}
                <Link href="/dashboard/leads" className="text-[#c7a36b] font-semibold underline">
                  Open the pipeline
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Simulate a lead intake"
                intro="Ask a buying question and watch how the lead gets qualified."
                placeholder="Ask about a listing or investment..."
                buttonLabel="Start Chat"
                context="Lead pipeline public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
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
                description="Convert project data into pipeline-ready context."
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
              { value: '0', label: 'Duplicate leads added' },
              { value: '1 view', label: 'Unified lead timeline' },
              { value: '12', label: 'Leads per page (safe)' },
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
            <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Pipeline flow</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              Every lead is scored, explained, and ready to action.
            </h2>
          </div>
          <div className="space-y-4 text-[#b6aca0]">
            <p>Deduplicate and enrich inbound leads in one list.</p>
            <p>Accept or reject with reasoning captured on record.</p>
            <p>Enable senders only when providers are configured.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Lead arrives (chat + site)',
            'Rule-based intent scoring',
            'Accept/reject persists',
            'Senders reflect provider status',
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

export default LeadPipelineOverviewPage;
