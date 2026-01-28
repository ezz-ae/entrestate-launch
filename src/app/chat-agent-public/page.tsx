import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const ChatAgentPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Chat Agent</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Replies now. Leads logged before you notice.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                Every message becomes a trackable lead with intent, context, and next action. Try it live.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Instant replies</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Lead intent captured</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#e8edf7]">Inventory-aware</span>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Next step:{' '}
                <Link href="/dashboard/chat-agent" className="text-[#7aa5ff] font-semibold underline">
                  Activate your chat agent
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Live conversation"
                intro="Ask about a project, budget, or location. The agent responds with context and follow-ups."
                placeholder="Ask your chat agent anything..."
                buttonLabel="Send Message"
                context="Chat agent public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'sales-strategy', label: 'Sales Strategy' },
                  { value: 'listings-management', label: 'Listings Management' },
                  { value: 'buyer-followup', label: 'Buyer Follow-up' },
                ]}
                context="Chat agent call preview."
              />
              <BrochureUploadCard
                title="Upload brochure"
                description="Turn a brochure into a lead-ready summary."
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
              { value: '0 sec', label: 'Response delay' },
              { value: '1 thread', label: 'Full lead context' },
              { value: 'Auto', label: 'Intent scoring' },
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
              Messages become decisions.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>Questions, preferences, and budgets are captured immediately.</p>
            <p>Leads are deduped and routed into the pipeline.</p>
            <p>Every follow-up is logged with reason.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Incoming message',
            'Clarify intent',
            'Route to pipeline',
            'Agent handoff ready',
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

export default ChatAgentPublicPage;
