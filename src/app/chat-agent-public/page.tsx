import React from 'react';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const ChatAgentPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.28),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.22),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Chat Agent</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                One place for every question a buyer asks first.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                Manual replies end here. The agent answers with listing context, follows up with intent questions, and records the lead without extra steps.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>When you stop replying manually, the first message still gets a real answer.</p>
                <p>After the first exchange, the lead is tagged with budget, location, and timeline.</p>
                <p>Every response is stored with the reason it was sent.</p>
              </div>
            </div>

            <ChatDemoCard
              title="Start the conversation"
              intro="Ask about a project, payment plan, or availability. The agent replies and asks what matters next."
              placeholder="Ask about a listing..."
              buttonLabel="Open Chat"
              context="Chat agent public demo."
              endpoint="/api/agent/demo"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">
          {[
            { value: 'Instant', label: 'First reply, always logged' },
            { value: 'Focused', label: 'Intent captured in plain language' },
            { value: 'Ready', label: 'Leads routed with next action' },
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
            <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">What changes</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              The first message is handled. The rest is organized.
            </h2>
          </div>
          <div className="space-y-4 text-[#b7c3df]">
            <p>No more inbox scanning. Conversations arrive with structure.</p>
            <p>Every follow-up is based on what the buyer already said.</p>
            <p>You step in only when a decision is close.</p>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ChatAgentPublicPage;
