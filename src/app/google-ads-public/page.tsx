import React from 'react';
import { FunnelShell } from '@/components/public/funnel-shell';
import { GoogleAdsDashboard } from '@/components/google-ads-dashboard';

const DEMO_PROJECTS = [
  {
    id: 'demo-project',
    headline: 'Luxury Penthouse in Dubai Marina',
    description: 'Experience the pinnacle of luxury living with breathtaking views of the Arabian Gulf and the Dubai skyline.'
  }
];

const GoogleAdsPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.15),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,154,213,0.1),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7aa5ff]/10 border border-[#7aa5ff]/20 text-[#7aa5ff] text-[10px] font-bold uppercase tracking-widest mb-6">
                Google Ads Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-white mb-6">
                  Controlled spend. <br/><span className="text-zinc-500">Predictable output.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Ads should feel mechanical. You set the budget and duration, the plan shows the range. No agency pitch. Just inputs and a plan.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-4 md:p-8 shadow-2xl">
              <GoogleAdsDashboard projects={DEMO_PROJECTS} readOnly={false} />
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default GoogleAdsPublicPage;
