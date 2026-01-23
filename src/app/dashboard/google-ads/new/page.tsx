'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const OCCALIZER_MODES = ['TOP', 'FAIR', 'RISKY'] as const;

type BlueprintResponse = {
  blueprintId: string;
  summary: string;
  checklist: string[];
  trackingPlan: string[];
};

export default function NewGoogleAdsCampaignPage() {
  const [siteId, setSiteId] = useState('');
  const [targetLocation, setTargetLocation] = useState('Dubai');
  const [audience, setAudience] = useState('Investors');
  const [goal, setGoal] = useState('Lead Generation');
  const [language, setLanguage] = useState('English');
  const [blueprint, setBlueprint] = useState<BlueprintResponse | null>(null);
  const [refinerResult, setRefinerResult] = useState<any | null>(null);
  const [occalizerMode, setOccalizerMode] = useState<(typeof OCCALIZER_MODES)[number]>('FAIR');
  const [dailyBudgetCap, setDailyBudgetCap] = useState('150');
  const [totalBudgetCap, setTotalBudgetCap] = useState('4500');
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateBlueprint = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/google-ads/blueprint/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteId || undefined,
          rawInputs: { targetLocation, audience, goal, language },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to generate blueprint');
      setBlueprint(data);
      setStatus('Blueprint generated');
    } catch (err: any) {
      setError(err.message || 'Failed to generate blueprint');
    } finally {
      setLoading(false);
    }
  };

  const handleRunRefiner = async () => {
    if (!siteId) {
      setError('Site ID is required to run the refiner.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/google-ads/refiner/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to run refiner');
      setRefinerResult(data.result);
      setStatus('Refiner complete');
    } catch (err: any) {
      setError(err.message || 'Failed to run refiner');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!blueprint) {
      setError('Generate a blueprint first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/google-ads/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprintId: blueprint.blueprintId,
          occalizerMode,
          dailyBudgetCap: Number(dailyBudgetCap),
          totalBudgetCap: Number(totalBudgetCap),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to create campaign');
      setCampaignId(data.campaignId);
      setStatus('Campaign draft created');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!campaignId) {
      setError('Create a campaign draft first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/google-ads/campaign/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to approve campaign');
      setStatus('Campaign approved');
    } catch (err: any) {
      setError(err.message || 'Failed to approve campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Google Ads</p>
        <h1 className="text-3xl font-bold text-white">New Campaign Wizard</h1>
        <p className="text-zinc-500 text-sm">Build a blueprint, pass the refiner, choose your Occalizer stance.</p>
      </div>

      {error && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="p-4 text-sm text-red-200">{error}</CardContent>
        </Card>
      )}

      <Card className="bg-zinc-900/60 border-white/5">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold">1) Quick Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} placeholder="Target location" />
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal" />
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input value={siteId} onChange={(e) => setSiteId(e.target.value)} placeholder="Landing page ID (optional)" />
            <Button asChild variant="outline" className="border-white/10">
              <Link href="/builder">Open Builder</Link>
            </Button>
          </div>
          <Button onClick={handleGenerateBlueprint} disabled={loading} className="bg-white text-black font-bold">
            Generate Blueprint
          </Button>
          {blueprint && (
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-semibold">{blueprint.summary}</p>
              <div className="flex flex-wrap gap-2">
                {blueprint.checklist.map((item) => (
                  <Badge key={item} className="bg-white/5 border-white/10 text-zinc-400">{item}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border-white/5">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold">2) Entrestate Refiner</h2>
          <p className="text-sm text-zinc-500">Run quality checks before launch.</p>
          <Button onClick={handleRunRefiner} disabled={loading} variant="outline" className="border-white/10">
            Run Refiner
          </Button>
          {refinerResult && (
            <div className="text-sm text-zinc-300">
              <p>Score: {refinerResult.score}</p>
              {refinerResult.blockingErrors?.length > 0 && (
                <p className="text-red-300">Blocking: {refinerResult.blockingErrors.join(', ')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border-white/5">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold">3) Occalizer</h2>
          <p className="text-sm text-zinc-500">Choose market pressure stance.</p>
          <div className="flex flex-wrap gap-2">
            {OCCALIZER_MODES.map((mode) => (
              <Button
                key={mode}
                variant={mode === occalizerMode ? 'secondary' : 'outline'}
                className="border-white/10"
                onClick={() => setOccalizerMode(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input value={dailyBudgetCap} onChange={(e) => setDailyBudgetCap(e.target.value)} placeholder="Daily budget cap" />
            <Input value={totalBudgetCap} onChange={(e) => setTotalBudgetCap(e.target.value)} placeholder="Total budget cap" />
          </div>
          <Button onClick={handleCreateCampaign} disabled={loading} className="bg-white text-black font-bold">
            Create Campaign Draft
          </Button>
          {campaignId && <p className="text-sm text-zinc-400">Campaign ID: {campaignId}</p>}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border-white/5">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold">4) Approve + Launch</h2>
          <p className="text-sm text-zinc-500">Approve the draft to allow deployment.</p>
          <Button onClick={handleApprove} disabled={loading} variant="outline" className="border-white/10">
            Approve Campaign
          </Button>
          {status && <p className="text-sm text-zinc-400">Status: {status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
