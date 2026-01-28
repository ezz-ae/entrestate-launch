'use client';

import { LabShell } from '../lab-shell';
import { GoogleAdsDashboard } from '@/components/google-ads/google-ads-dashboard';

export default function GoogleAdsLabPage() {
  return (
    <LabShell title="Google Ads Planner">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
        <GoogleAdsDashboard />
      </div>
    </LabShell>
  );
}
