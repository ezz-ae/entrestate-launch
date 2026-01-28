import React from 'react';
import Link from 'next/link';
import { BrochureUploadCard } from '@/components/public/brochure-upload-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const TEMPLATE_STARTS = [
  {
    id: 'template-roadshow',
    title: 'Roadshow Launch',
    detail: 'Stage a single project with urgency and clean payment flow.',
  },
  {
    id: 'template-map-focused',
    title: 'Map-First Inventory',
    detail: 'Lead with location, then highlight availability and pricing.',
  },
  {
    id: 'template-ads-launch',
    title: 'Ads Landing',
    detail: 'Short, conversion-focused layout built for ad traffic.',
  },
];

const SiteBuilderLandingPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.18),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Site Builder</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Start from a template. Skip the blank page.
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-xl">
                Templates are working layouts. Pick one, adjust the content, and publish. Brochure upload stays as the backup when you already have material.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-[#b7c3df]">
                <p>Templates handle the structure so you focus on the listing.</p>
                <p>Each layout is built for a specific listing motion.</p>
                <p>Click any template to open it inside the builder.</p>
              </div>
              <div className="mt-8 text-sm text-[#b7c3df]">
                Alternative path:{' '}
                <Link href="/builder" className="text-[#40c9c6] font-semibold underline">
                  Open the builder without a template
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {TEMPLATE_STARTS.map((template) => (
                <Link
                  key={template.id}
                  href={`/builder?template=${encodeURIComponent(template.id)}`}
                  className="group rounded-3xl border border-white/10 bg-[#101829] p-6 transition hover:border-[#40c9c6]/60"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#40c9c6]">Template</p>
                  <h2 className="mt-3 text-2xl font-[var(--font-display)] text-[#f4f7ff]">
                    {template.title}
                  </h2>
                  <p className="mt-3 text-sm text-[#b7c3df]">{template.detail}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#40c9c6]">Open in builder →</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1222]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">Brochure route</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-[var(--font-display)]">
              If you already have a brochure, start there.
            </h2>
            <p className="mt-4 text-sm text-[#b7c3df]">
              Uploading a brochure is a commitment. We extract structure, draft the copy, and keep the key details aligned.
            </p>
          </div>
          <BrochureUploadCard
            title="Upload a brochure"
            description="We extract the structure and draft the page in minutes."
            ctaLabel="Build from Brochure"
          />
        </div>
      </section>
    </FunnelShell>
  );
};

export default SiteBuilderLandingPage;
