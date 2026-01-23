import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { AdsShowcase } from '@/components/marketing/feature-showcase/ads-showcase';
import { Button } from '@/components/ui/button';

export default function GoogleAdsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-white/5">
        <div className="container mx-auto px-6 max-w-6xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Search className="h-3.5 w-3.5" />
            Google Ads
          </div>
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
              Launch high-intent search campaigns without the ad ops chaos.
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg">
              We build the keywords, ads, and tracking for you. You stay in control of budget and approvals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button asChild className="h-12 sm:h-14 px-8 rounded-full bg-white text-black font-bold text-base sm:text-lg">
              <Link href="/dashboard/google-ads">
                Launch Ads <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-2"><Target className="h-3.5 w-3.5 text-emerald-400" /> Lead-focused</span>
              <span className="flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Managed bids</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Budget controls</span>
            </div>
          </div>
        </div>
      </section>

      <AdsShowcase ctaLabel="Launch Ads" ctaHref="/dashboard/google-ads" />
    </main>
  );
}
