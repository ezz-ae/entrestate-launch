import React from 'react';
import Link from 'next/link';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { ColdCallDemoCard } from '@/components/public/cold-call-demo-card';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const SiteBuilderLandingPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,163,107,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(61,90,120,0.2),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#c7a36b]">Site Builder</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Launch a property page without a blank canvas.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b6aca0] max-w-xl">
                Start from inventory, brochure, or prompt. The builder creates a draft that captures leads immediately.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Instant draft</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Real estate blocks</span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-[#f5f1e8]">Lead capture baked in</span>
              </div>
              <div className="mt-8 text-sm text-[#b6aca0]">
                Next step:{' '}
                <Link href="/builder" className="text-[#c7a36b] font-semibold underline">
                  Open the Builder
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ChatDemoCard
                title="Describe your next page"
                intro="Tell me about the property or the listing style you need. I’ll draft the structure for you."
                placeholder="Describe your next property page..."
                buttonLabel="Start Chat"
                context="Site builder public demo."
                endpoint="/api/agent/demo"
              />
              <ColdCallDemoCard
                title="Request a call preview"
                buttonLabel="Show Call Preview"
                topics={[
                  { value: 'property-launch', label: 'Property Launch Strategy' },
                  { value: 'lead-pages', label: 'Lead Capture Pages' },
                  { value: 'portfolio-showcase', label: 'Portfolio Showcase' },
                ]}
                context="Site builder call preview."
              />
              <BrochureUploadCard
                title="Upload a brochure"
                description="Drop any project brochure and we’ll draft the page summary."
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
              { value: '4 min', label: 'Average time to first draft' },
              { value: '0', label: 'Blank canvas required' },
              { value: '150+', label: 'Blocks optimized for real estate' },
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
              From brochure to live page in one flow.
            </h2>
          </div>
          <div className="space-y-4 text-[#b6aca0]">
            <p>Start from inventory, brochure, template, or prompt.</p>
            <p>Customize blocks that buyers need to act fast.</p>
            <p>Publish and capture leads instantly.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            'Start your way',
            'Customize real estate blocks',
            'Publish with a subdomain',
            'Capture leads automatically',
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
                <h3 className="mt-3 text-3xl font-[var(--font-display)]">Entrestate Builder</h3>
                <p className="mt-2 text-[#b6aca0]">Unlimited pages. Cancel anytime.</p>
              </div>
              <div className="text-4xl font-semibold text-[#f5f1e8]">150 AED<span className="text-sm text-[#b6aca0]"> / month</span></div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 text-sm text-[#b6aca0]">
              <p>Unlimited builds</p>
              <p>Inventory-connected drafts</p>
              <p>Lead capture baked in</p>
              <p>Custom domains supported</p>
            </div>
            <button className="mt-8 w-full rounded-xl bg-[#c7a36b] text-[#0b0a09] font-semibold py-3 text-sm uppercase tracking-[0.2em]">
              Build Your First Page
            </button>
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SiteBuilderLandingPage;
