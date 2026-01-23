'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Campaign = {
  id: string;
  status: string;
  plan?: { name?: string };
  createdAt?: string;
};

export function GoogleAdsOverview() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/google-ads/campaigns', { cache: 'no-store' });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          const message = payload?.error?.message || 'Failed to load campaigns.';
          if (active) setError(message);
          return;
        }
        const json = await res.json();
        if (active) setCampaigns(json.data || []);
      } catch (err) {
        if (active) setError('Failed to load campaigns.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const byStatus = campaigns.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return {
      total: campaigns.length,
      active: byStatus.active || 0,
      draft: byStatus.draft || 0,
    };
  }, [campaigns]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Google Ads</p>
          <h1 className="text-3xl font-bold text-white">Campaign Overview</h1>
          <p className="text-zinc-500 text-sm">Managed campaigns with refiner and scenario governance.</p>
        </div>
        <Button asChild className="bg-white text-black font-bold">
          <Link href="/dashboard/google-ads/new">New Campaign</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Campaigns', value: counts.total },
          { label: 'Active', value: counts.active },
          { label: 'Drafts', value: counts.draft },
        ].map((item) => (
          <Card key={item.label} className="bg-zinc-900/60 border-white/5">
            <CardContent className="p-5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900/40">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold">Campaigns</h2>
          {loading && <span className="text-xs text-zinc-500">Loading...</span>}
        </div>
        <div className="px-6 py-4 space-y-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && campaigns.length === 0 && !error && (
            <p className="text-sm text-zinc-500">No campaigns yet. Start by creating a blueprint.</p>
          )}
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5"
            >
              <div>
                <p className="text-sm font-bold text-white">{campaign.plan?.name || 'Untitled Campaign'}</p>
                <p className="text-xs text-zinc-500">{campaign.createdAt || 'Awaiting launch'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={cn('border-white/10 bg-white/5 text-zinc-300', campaign.status === 'active' && 'bg-green-500/20 text-green-300')}>
                  {campaign.status}
                </Badge>
                <Button asChild variant="ghost" className="text-white">
                  <Link href={`/dashboard/google-ads/c/${campaign.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
