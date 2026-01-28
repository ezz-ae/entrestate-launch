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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,97,255,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(199,163,107,0.22),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Instagram Assistant</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Turn DMs into qualified leads while you sleep.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b6aca0] max-w-xl">
                Your assistant handles Instagram inquiries, qualifies intent, and routes hot leads straight into the pipeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">DM auto-response</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Lead scoring</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Instant handoff</span>
              </div>
              <div className="mt-8 text-sm text-[#b6aca0]">
                Next step:{' '}
                <Link href="/dashboard/chat-agent" className="text-[#c7a36b] font-semibold underline">
                  Activate your assistant
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Chat with your assistant"
                intro="Tell me what you're selling or looking for. I’ll respond like I’m already managing your inbox."
                placeholder="Ask your Digital Assistant anything..."
                buttonLabel="Start Chat"
                context="Instagram assistant public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
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
                description="Drop any project brochure and watch a draft summary get generated."
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
              { value: '+30%', label: 'Leads captured per month' },
              { value: '90s', label: 'Avg. qualification time' },
              { value: '+50%', label: 'Meeting bookings' },
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
              Instagram inquiries to pipeline, automatically.
            </h2>
          </div>
          <div className="space-y-4 text-[#b6aca0]">
            <p>Connect your Instagram once and keep your listings synced.</p>
            <p>Every DM is handled with your brand tone and criteria.</p>
            <p>Qualified buyers are routed into the pipeline with context.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Connect Instagram',
            'Teach listings & FAQs',
            'Go live with auto replies',
            'Capture & qualify leads',
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-[#14110f] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c7a36b]">Step {index + 1}</p>
              <p className="mt-2 text-lg text-[#f5f1e8]">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0f0e0c]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl border border-white/10 bg-[#14110f] p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#c7a36b]">Pricing</p>
                <h3 className="mt-3 text-3xl font-[var(--font-display)]">Instagram Assistant</h3>
                <p className="mt-2 text-[#b6aca0]">Always-on response for every inquiry.</p>
              </div>
              <div className="text-4xl font-semibold text-[#f5f1e8]">46 AED<span className="text-sm text-[#b6aca0]"> / month</span></div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 text-sm text-[#b6aca0]">
              <p>DM auto-response</p>
              <p>Inventory-aware answers</p>
              <p>Lead qualification routing</p>
              <p>Deployable on social + web</p>
            </div>
            <button className="mt-8 w-full rounded-xl bg-[#c7a36b] text-[#0b0a09] font-semibold py-3 text-sm uppercase tracking-[0.2em]">
              Activate My Instagram Assistant
            </button>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default InstagramAssistantPublicPage;
