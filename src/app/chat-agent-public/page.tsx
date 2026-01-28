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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,163,107,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(88,103,124,0.25),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Digital Consultant</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Experience your consultant in real time. Capture intent before the first call.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b6aca0] max-w-xl">
                Every conversation is qualified, tagged, and routed into your pipeline. Try the live demo or request a call preview right now.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">24/7 Lead Capture</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Inventory-aware</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Intent scoring</span>
              </div>
              <div className="mt-8 text-sm text-[#b6aca0]">
                Next step:{' '}
                <Link href="/dashboard/chat-agent" className="text-[#c7a36b] font-semibold underline">
                  Activate your chat agent
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Chat with your consultant"
                intro="Tell me what you’re selling or looking for. I’ll respond as if I’m already on your team."
                placeholder="Ask your Digital Consultant anything..."
                buttonLabel="Start Chat"
                context="Chat agent public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'sales-strategy', label: 'Sales Strategy' },
                  { value: 'listings-management', label: 'Listings Management' },
                  { value: 'buyer-followup', label: 'Buyer Follow-up' },
                ]}
                context="Chat agent call preview."
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Drop a brochure and we’ll extract the key details for your draft."
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
              { value: '+35%', label: 'Client engagement lift' },
              { value: '24/7', label: 'Instant inquiry coverage' },
              { value: '95%', label: 'Lead qualification accuracy' },
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
            <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">How it works</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              From first touch to qualified lead.
            </h2>
          </div>
          <div className="space-y-4 text-[#b6aca0]">
            <p>Instant dialogue with buyers, powered by your inventory.</p>
            <p>Intent questions are asked automatically and logged.</p>
            <p>High-intent leads flow into your pipeline with context.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Instant client dialogue',
            'Inventory-aware responses',
            'Lead qualification & routing',
            'Seamless handoff to your team',
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
                <h3 className="mt-3 text-3xl font-[var(--font-display)]">Digital Consultant</h3>
                <p className="mt-2 text-[#b6aca0]">Deployable on chat, web, QR, and social.</p>
              </div>
              <div className="text-4xl font-semibold text-[#f5f1e8]">46 AED<span className="text-sm text-[#b6aca0]"> / month</span></div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 text-sm text-[#b6aca0]">
              <p>24/7 client engagement</p>
              <p>Full market inventory access</p>
              <p>Dedicated chat link + QR</p>
              <p>Multi-language support</p>
            </div>
            <button className="mt-8 w-full rounded-xl bg-[#c7a36b] text-[#0b0a09] font-semibold py-3 text-sm uppercase tracking-[0.2em]">
              Activate My Digital Consultant
            </button>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default ChatAgentPublicPage;
