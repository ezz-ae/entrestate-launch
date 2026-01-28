import React from 'react';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const InstagramAssistantPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,213,0.22),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">Instagram Assistant</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                DMs stop being chaos. They become a queue.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                The assistant responds inside the same tone your clients expect, then records intent and routes the lead.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>Before: unanswered DMs, mixed priorities, lost context.</p>
                <p>After: each DM becomes a lead with a clear next step.</p>
                <p>Missed intent becomes captured intent with tags you can act on.</p>
              </div>
            </div>

            <ChatDemoCard
              title="Simulate a DM flow"
              intro="Send a DM. The assistant replies, clarifies, and marks intent in the thread."
              placeholder="Send a DM about a listing..."
              buttonLabel="Send DM"
              context="Instagram assistant public demo."
              endpoint="/api/agent/demo"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">
          {[
            { value: 'Order', label: 'Every DM sorted' },
            { value: 'Signal', label: 'Intent tagged clearly' },
            { value: 'Flow', label: 'Leads routed to pipeline' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#101829] p-6">
              <p className="text-3xl font-semibold text-[#f4f7ff]">{stat.value}</p>
              <p className="text-sm text-[#b7c3df] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">DM logic</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              The assistant keeps the thread short and useful.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>Short questions. Clear answers. No wandering.</p>
            <p>Listings and availability are pulled from inventory.</p>
            <p>When interest is real, the handoff is immediate.</p>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default InstagramAssistantPublicPage;
