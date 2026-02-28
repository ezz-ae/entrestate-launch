import React from 'react';
import Link from 'next/link';
import { FunnelShell } from '@/components/public/funnel-shell';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Layout, Users, Phone } from 'lucide-react';

const SmartSystemPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-40 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#7aa5ff]">How It Works</p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] leading-[1.05]">
                One Simple Flow for Your Team
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
              Keep listings, pages, and leads in one place so your team can work faster and follow up with buyers on time.
            </p>

            <div className="mt-16 grid grid-cols-1 items-center gap-8 text-foreground md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
                  <Database className="w-10 h-10 mb-4 text-[#7aa5ff]" />
                  <span className="font-bold">Inventory</span>
                  <span className="text-xs text-muted-foreground">'inventory_projects'</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Manage all your property listings in one place.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
                  <Layout className="w-10 h-10 mb-4 text-[#40c9c6]" />
                  <span className="font-bold">Site Builder</span>
                  <span className="text-xs text-muted-foreground">'sites'</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Create clear project pages using details already in your listings.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
                  <Users className="w-10 h-10 mb-4 text-[#ff9ad5]" />
                  <span className="font-bold">Lead Generation</span>
                  <span className="text-xs text-muted-foreground">'leads' & 'contacts'</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Capture leads from your sites, social media, and ads.</p>
              </div>
            </div>

            <div className="mt-12">
                <Link href="/docs">
                    <Button className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                        Explore the Docs
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </FunnelShell>
  );
};

export default SmartSystemPage;
