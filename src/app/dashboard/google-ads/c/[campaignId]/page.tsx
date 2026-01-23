'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function GoogleAdsCampaignDetailPage() {
  const params = useParams();
  const campaignId = params?.campaignId as string;
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 7);
      try {
        const res = await fetch(
          `/api/google-ads/report?campaignId=${encodeURIComponent(campaignId)}&from=${from.toISOString()}&to=${to.toISOString()}`,
        );
        const data = await res.json();
        if (active) setReport(data);
      } catch (err) {
        if (active) setReport(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    if (campaignId) load();
    return () => {
      active = false;
    };
  }, [campaignId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Campaign</p>
          <h1 className="text-3xl font-bold text-white">{campaignId}</h1>
          <p className="text-zinc-500 text-sm">Status, reports, and scenario governance.</p>
        </div>
        <Button asChild variant="ghost" className="text-white">
          <Link href="/dashboard/google-ads">Back to campaigns</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(report?.tiles?.ads || []).map((tile: any) => (
          <Card key={tile.label} className="bg-zinc-900/60 border-white/5">
            <CardContent className="p-5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{tile.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{tile.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900/60 border-white/5">
        <CardContent className="p-6 space-y-2">
          <h2 className="text-lg font-bold">Scenario Timeline</h2>
          <p className="text-sm text-zinc-500">Scenario management events will appear here.</p>
          <Badge className="bg-white/5 border-white/10 text-zinc-400">Pending evaluation</Badge>
        </CardContent>
      </Card>

      {loading && <p className="text-sm text-zinc-500">Loading report...</p>}
    </div>
  );
}
