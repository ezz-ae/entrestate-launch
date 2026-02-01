import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';

const LearningPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,213,0.22),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-40 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#ff9ad5]">Smart ChatAgent</p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                A Continuously Learning AI Partner
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#b7c3df] max-w-2xl mx-auto">
              Your ChatAgent is not static; it's a learning machine. Train it on your brand's voice and tone, and feed it with new information. Every piece of information you provide is added to its 'knowledge' collection, making it a more effective and engaging partner over time.
            </p>
            <div className="mt-8">
                <Link href="/dashboard/consultant-learning">
                    <Button className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                        Start Training Your Agent
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default LearningPage;
