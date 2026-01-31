import React from 'react';
import { FunnelShell } from '@/components/public/funnel-shell';
import { LeadValidator } from '@/components/leads/lead-validator';

const LeadPipelineOverviewPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(64,201,198,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#40c9c6]/10 border border-[#40c9c6]/20 text-[#40c9c6] text-[10px] font-bold uppercase tracking-widest mb-6">
              Lead Intelligence Layer
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-white mb-6">
                Leads are not data. <br/><span className="text-zinc-500">They are decisions.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                The pipeline validates contact details, checks activity channels, and assigns intent signals automatically.
            </p>
          </div>
          <div className="w-full">
            <LeadValidator />
          </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default LeadPipelineOverviewPage;
