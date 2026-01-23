import Link from 'next/link';
import { IS_GOOGLE_ADS_ENABLED } from '@/lib/server/env';
import { Button } from '@/components/ui/button';
import { GoogleAdsOverview } from '@/components/google-ads/ads-overview';

export default function GoogleAdsPage() {
  if (!IS_GOOGLE_ADS_ENABLED) {
    return (
      <div className="h-full bg-zinc-950 rounded-3xl border border-white/10 p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Google Ads</p>
        <h1 className="text-3xl font-bold text-white mt-2">Coming soon</h1>
        <p className="text-zinc-500 mt-2">
          Enable Google Ads to launch managed campaigns.
        </p>
        <Button asChild className="mt-6 bg-white text-black font-bold">
          <Link href="/dashboard/billing">Review plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950">
      <GoogleAdsOverview />
    </div>
  );
}
