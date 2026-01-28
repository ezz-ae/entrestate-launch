import React from 'react';
import Link from 'next/link';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const SiteBuilderLandingPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.18),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Site Builder</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Brochure stuck on your desktop? Turn it live.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                A brochure is a dead file. A live page captures inquiries, schedules follow-ups, and shows progress.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>Brokers get stuck at brochures because every page starts from zero.</p>
                <p>“Live” means the page answers questions and collects leads immediately.</p>
                <p>The draft is created first. Customization comes second.</p>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Alternative path:{' '}
                <Link href="/builder" className="text-[#40c9c6] font-semibold underline">
                  Open the builder without a brochure
                </Link>
              </div>
            </div>

            <BrochureUploadCard
              title="Upload a brochure"
              description="We extract the structure and draft the page in minutes."
              ctaLabel="Build from Brochure"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">
          {[
            { value: 'Draft', label: 'Generated before editing' },
            { value: 'Live', label: 'Lead capture on day one' },
            { value: 'Structured', label: 'Blocks already placed' },
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

export default SiteBuilderLandingPage;
