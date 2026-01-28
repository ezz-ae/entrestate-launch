import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const InstagramAssistantPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,213,0.22),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">Instagram Assistant</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                DMs become orderly conversations.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                The assistant replies in your tone, tags intent, and moves serious buyers into the pipeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Inbox cleared</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">DM intent captured</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Lead handoff</span>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Next step:{' '}
                <Link href="/dashboard/chat-agent" className="text-[#ff9ad5] font-semibold underline">
                  Activate your assistant
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Instagram-style conversation"
                intro="Try a DM. The assistant asks follow-ups and captures intent."
                placeholder="Ask about a listing in the DMs..."
                buttonLabel="Send DM"
                context="Instagram assistant public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'sales-lead-follow-up', label: 'Sales Lead Follow-up' },
                  { value: 'new-listing-strategy', label: 'New Listing Strategy' },
                  { value: 'buyer-qualification', label: 'Buyer Qualification' },
                ]}
                context="Instagram assistant call preview."
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Add context so replies stay accurate."
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
              { value: 'Fewer', label: 'Missed DMs' },
              { value: 'Clear', label: 'Lead status' },
              { value: 'Fast', label: 'First response' },
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
            <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">Flow</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              DM, qualify, route.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>Connect Instagram once and feed listings in.</p>
            <p>Assistant qualifies with short, direct questions.</p>
            <p>Qualified buyers move to pipeline automatically.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Connect Instagram',
            'Load inventory context',
            'DM reply flow',
            'Lead routed with notes',
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-[#101829] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ff9ad5]">Step {index + 1}</p>
              <p className="mt-2 text-lg text-[#e8edf7]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </FunnelShell>
  );
};

export default InstagramAssistantPublicPage;
