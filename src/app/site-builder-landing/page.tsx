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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.15),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.1),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6] font-bold mb-4">AI-Powered Site Builder</p>
            <h1 className="text-5xl md:text-7xl font-[var(--font-display)] leading-[1.05] tracking-tight text-white mb-6">
              Build Lead Pages <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40c9c6] to-[#ff9ad5]">in 3 Clicks.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#b7c3df] leading-relaxed">
              Stop waiting for developers. Pick a high-converting template, let AI write your copy, and launch your Google Ads campaign today.
            </p>
          </div>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "1. Pick Template", desc: "Select a layout proven to convert real estate leads." },
              { title: "2. AI Generation", desc: "AI extracts project data and writes professional copy." },
              { title: "3. Go Live", desc: "Connect your domain and start capturing leads instantly." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#40c9c6] font-bold text-sm mb-4 border border-white/10">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#b7c3df]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-start">
            <div>
              <h2 className="text-3xl font-[var(--font-display)] text-white mb-6">
                Choose your starting point
              </h2>
              <div className="space-y-4 text-[#b7c3df]">
                <div className="flex gap-3">
                  <div className="mt-1 text-[#40c9c6]">✓</div>
                  <p>Pre-configured for Google & Meta Ads conversion.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 text-[#40c9c6]">✓</div>
                  <p>Auto-populates from 3,750+ Dubai projects.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 text-[#40c9c6]">✓</div>
                  <p>Mobile-first responsive design out of the box.</p>
                </div>
              </div>
              <div className="mt-10">
                <Link href="/builder" className="inline-flex items-center gap-2 text-[#40c9c6] font-semibold hover:underline group">
                  Start with a blank canvas 
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {TEMPLATE_STARTS.map((template) => (
                <Link
                  key={template.id}
                  href={`/builder?template=${encodeURIComponent(template.id)}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101829] p-8 transition hover:border-[#40c9c6]/60 hover:bg-[#162035]"
                >
                  {/* Live Preview Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 bg-[#40c9c6] text-black px-5 py-2.5 rounded-full text-sm font-bold transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-2xl">
                      Live Preview
                    </div>
                  </div>

                  <div className="flex justify-end items-start mb-4">
                    <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-widest text-[#40c9c6] border border-[#40c9c6]/20">
                      High Conversion
                    </div>
                  </div>
                  <h2 className="mt-3 text-2xl font-[var(--font-display)] text-[#f4f7ff]">
                    {template.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#b7c3df] leading-relaxed">{template.detail}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#40c9c6] font-bold">
                    Select Template 
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                  
                  {/* Decorative background glow */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#40c9c6]/5 rounded-full blur-2xl group-hover:bg-[#40c9c6]/10 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brochure Route */}
      <section className="bg-[#0b1222] py-24">
        <div className="mx-auto max-w-6xl px-6 grid gap-16 lg:grid-cols-[1fr_1fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5] font-bold mb-4">The Brochure Route</p>
            <h2 className="text-4xl md:text-5xl font-[var(--font-display)] text-white mb-6">
              Have a PDF? <br />
              <span className="text-[#ff9ad5]">AI will do the rest.</span>
            </h2>
            <p className="text-lg text-[#b7c3df] mb-8">
              Upload your project brochure and our AI will extract floor plans, pricing, and features to build your page automatically.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[#ff9ad5] font-bold mb-1">OCR Extraction</div>
                <p className="text-xs text-[#b7c3df]">Reads text from images & PDFs.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[#ff9ad5] font-bold mb-1">Auto-Copy</div>
                <p className="text-xs text-[#b7c3df]">Drafts headlines from features.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#ff9ad5]/10 blur-3xl rounded-full" />
            <BrochureUploadCard
              title="Upload a brochure"
              description="We extract the structure and draft the page in minutes."
              ctaLabel="Build from Brochure"
            />
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SiteBuilderLandingPage;
