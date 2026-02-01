import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';

const AbuDhabiMarketPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-40 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">Inventory</p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                Abu Dhabi Market
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-2xl mx-auto">
              Discover the growing real estate market of Abu Dhabi. Find the latest projects and investment opportunities in the capital of the UAE.
            </p>
            <div className="mt-8">
                <Link href="/discover?location=abu-dhabi">
                    <Button className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                        Explore Abu Dhabi
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default AbuDhabiMarketPage;
