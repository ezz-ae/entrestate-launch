import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';

const SmartTargetingPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-40 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#40c9c6]">Smart Lead Generation</p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Reach the Right Audience, Every Time
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-2xl mx-auto">
              Stop guessing and start targeting. Our smart system analyzes data from your 'leads', 'contacts', and 'site' visitors to identify the most promising audience segments for your campaigns. It's data-driven marketing, made simple.
            </p>
            <div className="mt-8">
                <Link href="/dashboard/marketing">
                    <Button className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                        Start Smart Targeting
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SmartTargetingPage;
