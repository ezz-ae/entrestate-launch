'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, MapPin, Wallet, CheckCircle2, Sparkles, BarChart3 } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useToast } from '@/hooks/use-toast';

type Campaign = {
  id: string;
  name?: string;
  status?: string;
  location?: string;
  dailyBudget?: number;
  createdAt?: string;
};

type KeywordPlan = {
  term: string;
  competition?: string;
  volume?: number;
  cpc?: { low: number; high: number };
};

type Expectations = {
  dailyBudget: number;
  durationDays: number;
  totalSpend: number;
  cpcRange: { low: number; high: number };
  clicksRange: { low: number; high: number };
  leadsRange: { low: number; high: number };
  cplRange: { low: number; high: number };
};

type CampaignPlan = {
  keywords: KeywordPlan[];
  headlines: string[];
  descriptions: string[];
  expectations?: Expectations;
};

type CheckoutSummary = {
  budget: number;
  duration: number;
  totalSpend: number;
  serviceFee: number;
  platformFee: number;
  totalDue: number;
  perLead: number;
};

const DEFAULT_DURATION_DAYS = 30;
const SLIDER_MIN = 80;
const SLIDER_MAX = 600;
const SLIDER_STEP = 10;

const clampBudgetValue = (value: number) => Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, value));

export function GoogleAdsDashboard() {
  const { toast } = useToast();
  const [goal, setGoal] = useState('Lead Generation');
  const [location, setLocation] = useState('Dubai, UAE');
  const [budget, setBudget] = useState('150');
  const [duration, setDuration] = useState(String(DEFAULT_DURATION_DAYS));
  const [landingPage, setLandingPage] = useState('');
  const [notes, setNotes] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const [sliderBudget, setSliderBudget] = useState(() =>
    clampBudgetValue(Number(budget) || 150)
  );
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const numericBudget = Number(budget);
  const numericDuration = Number(duration);

  useEffect(() => {
    const parsed = Number(budget);
    if (!Number.isFinite(parsed)) return;
    const clamped = clampBudgetValue(parsed);
    if (clamped !== sliderBudget) {
      setSliderBudget(clamped);
    }
  }, [budget, sliderBudget]);

  const campaignName = useMemo(() => {
    return `${goal} - ${location}`.trim();
  }, [goal, location]);

  const skeletonDuration = numericDuration || DEFAULT_DURATION_DAYS;
  const {
    skeletonNarrative,
    leadsEstimate,
    totalSpend: previewSpend,
    estimatedCpl,
  } = useMemo(() => {
    const leadsEstimate = Math.max(
      2,
      Math.round((sliderBudget * skeletonDuration) / 1100)
    );
    const audience =
      goal === 'Brand Awareness'
        ? 'general interest'
        : goal === 'Website Visits'
        ? 'site visitors'
        : 'ready buyers';
    const totalSpend = sliderBudget * skeletonDuration;
    const estimatedCpl = Math.max(1, Math.round(totalSpend / leadsEstimate));
    const skeletonNarrative = `AED ${sliderBudget} per day for ${skeletonDuration} days locks in approximately ${leadsEstimate} ${audience} across ${location}.`;
    return { skeletonNarrative, leadsEstimate, totalSpend, estimatedCpl };
  }, [sliderBudget, skeletonDuration, location, goal]);

  const hasCustomDuration = numericDuration > 0;
  const durationRequiresAdjustment =
    hasCustomDuration && (numericDuration < 7 || numericDuration > 90);
  const checkoutDuration = Math.max(
    7,
    Math.min(90, hasCustomDuration ? numericDuration : DEFAULT_DURATION_DAYS)
  );
  const canEstimatePricing = !durationRequiresAdjustment;

  const loadCampaigns = async () => {
    try {
      const res = await authorizedFetch('/api/ads/google/campaigns', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) return;
    const clamped = clampBudgetValue(value);
    setSliderBudget(clamped);
    setBudget(String(clamped));
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const fetchCheckoutSummary = useCallback(async () => {
    if (!canEstimatePricing) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const response = await authorizedFetch('/api/ads/google/plan/checkout', {
        method: 'POST',
        body: JSON.stringify({
          budget: sliderBudget,
          duration: checkoutDuration,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error ||
            payload?.message ||
            'Pricing preview unavailable. Please adjust the budget or duration.'
        );
      }
      setCheckoutSummary(payload.data ?? null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Pricing preview unavailable. Please try again shortly.';
      setCheckoutSummary(null);
      setCheckoutError(message);
    } finally {
      setCheckoutLoading(false);
    }
  }, [canEstimatePricing, checkoutDuration, sliderBudget]);

  useEffect(() => {
    if (!canEstimatePricing) {
      setCheckoutLoading(false);
      setCheckoutSummary(null);
      if (durationRequiresAdjustment) {
        setCheckoutError('Campaign duration must be between 7 and 90 days to show pricing.');
      } else {
        setCheckoutError(null);
      }
      return;
    }
    void fetchCheckoutSummary();
  }, [fetchCheckoutSummary, canEstimatePricing, durationRequiresAdjustment]);

  const validateInputs = () => {
    if (!location.trim() || Number.isNaN(numericBudget) || numericBudget <= 0) {
      toast({ title: 'Add a valid budget and location', variant: 'destructive' });
      return false;
    }
    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
      toast({ title: 'Add a valid duration', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleGeneratePlan = async () => {
    if (!validateInputs()) return;

    setPlanLoading(true);
    try {
      const res = await authorizedFetch('/api/ads/google/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          location,
          budget: numericBudget,
          duration: numericDuration,
          landingPage: landingPage || undefined,
          notes: notes || undefined,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(
          payload?.error || payload?.message || 'Plan generation failed'
        );
      }
      const planPayload = payload.data ?? {};
      setPlan({
        keywords: planPayload.keywords || [],
        headlines: planPayload.headlines || [],
        descriptions: planPayload.descriptions || [],
        expectations: planPayload.expectations,
      });
      toast({ title: 'AI plan ready', description: 'Review the keywords and ad copy below.' });
    } catch (error: any) {
      toast({
        title: 'Plan failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPlanLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!validateInputs()) return;
    if (!plan) {
      toast({ title: 'Generate the AI plan first', variant: 'destructive' });
      return;
    }

    setLaunching(true);
    try {
      const res = await authorizedFetch('/api/ads/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          budget: numericBudget,
          duration: numericDuration,
          location,
          goal,
          landingPage: landingPage || undefined,
          notes: notes || undefined,
          keywords: plan.keywords || [],
          headlines: plan.headlines || [],
          descriptions: plan.descriptions || [],
          expectations: plan.expectations || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Launch failed');
      }
      toast({
        title: 'Campaign launched',
        description: 'Your ads are being activated by our team.',
      });
      setLandingPage('');
      setNotes('');
      await loadCampaigns();
    } catch (error: any) {
      toast({
        title: 'Launch failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLaunching(false);
    }
  };

    return (
      <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Google Ads</h1>
          <p className="text-zinc-500 text-lg font-light">
            We launch your ads for you. No Google billing needed.
          </p>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 uppercase tracking-widest text-[10px]">
          Managed Launch
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>AI Campaign Builder</CardTitle>
            <CardDescription>Smart keywords, ad copy, and expected results in minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Goal</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <select
                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option>Lead Generation</option>
                    <option>Website Visits</option>
                    <option>Brand Awareness</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 pl-10 text-white"
                    placeholder="Dubai, UAE"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Daily Budget (AED)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 pl-10 text-white"
                    placeholder="150"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Campaign Length (Days)</label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-12 bg-black/40 border-white/10 text-white"
                  placeholder={String(DEFAULT_DURATION_DAYS)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Landing Page (Optional)</label>
              <Input
                value={landingPage}
                onChange={(e) => setLandingPage(e.target.value)}
                className="h-12 bg-black/40 border-white/10 text-white"
                placeholder="https://your-listing.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Focus Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] bg-black/40 border-white/10 text-white"
                placeholder="Example: highlight off-plan launches, flexible payment plans, UK investors."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/10 bg-white/5 text-white font-bold gap-2"
                onClick={handleGeneratePlan}
                disabled={planLoading}
              >
                {planLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate AI Plan
              </Button>
              <Button
                className="h-12 rounded-full bg-white text-black font-bold px-8"
                onClick={handleLaunch}
                disabled={launching || !plan}
              >
                {launching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Launch Campaign
              </Button>
            </div>

            {plan && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-400">
                AI plan ready with {plan.keywords.length} keywords, {plan.headlines.length} headlines, and{' '}
                {plan.descriptions.length} descriptions.
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4 text-white">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-400">
                <span>Plan preview</span>
                <span>Duration {skeletonDuration} days</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Daily budget</span>
                  <span className="text-sm font-semibold text-white">AED {sliderBudget}</span>
                </div>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={SLIDER_STEP}
                  value={sliderBudget}
                  onChange={handleSliderChange}
                  className="w-full h-2 rounded-full appearance-none bg-white/10 accent-blue-500"
                  aria-label="Adjust daily budget preview"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Min AED {SLIDER_MIN}</span>
                  <span>Max AED {SLIDER_MAX}</span>
                </div>
              </div>
              <p className="text-sm text-zinc-300">{skeletonNarrative}</p>
              <div className="grid grid-cols-3 gap-3 text-[11px] text-zinc-400">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Est. leads</p>
                  <p className="text-sm font-semibold text-white">{leadsEstimate}</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Campaign spend</p>
                  <p className="text-sm font-semibold text-white">AED {formatNumber(previewSpend)}</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Est. CPL</p>
                  <p className="text-sm font-semibold text-white">AED {estimatedCpl}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Pricing preview</span>
                  {checkoutLoading && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
                </div>
                {checkoutSummary ? (
                  <>
                    <div className="flex justify-between">
                      <span>Total spend</span>
                      <span className="font-semibold text-white">
                        AED {formatNumber(checkoutSummary.totalSpend)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span className="font-semibold text-white">
                        AED {formatNumber(checkoutSummary.serviceFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span className="font-semibold text-white">
                        AED {formatNumber(checkoutSummary.platformFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Total due ({checkoutDuration} days)</span>
                      <span className="font-semibold text-white">
                        AED {formatNumber(checkoutSummary.totalDue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Per lead</span>
                      <span className="font-semibold text-white">AED {checkoutSummary.perLead.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-red-300">
                    {checkoutError || 'Adjust budget or duration above to preview our pricing.'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Live ads and budget status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-sm text-zinc-500">No campaigns yet. Launch your first plan.</p>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{campaign.name || 'Campaign'}</p>
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase tracking-widest">
                      {campaign.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">{campaign.location || 'Location not shared'}</p>
                  {campaign.dailyBudget !== undefined && (
                    <p className="text-xs text-zinc-500">Daily budget: AED {campaign.dailyBudget}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {plan && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Budget Expectations
                </CardTitle>
                <CardDescription>Forecast based on historical UAE campaign ranges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.expectations && (
                  <>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Total spend</span>
                      <span className="text-white font-semibold">AED {formatNumber(plan.expectations.totalSpend)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated clicks</span>
                      <span className="text-white font-semibold">
                        {formatRange(plan.expectations.clicksRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated leads</span>
                      <span className="text-white font-semibold">
                        {formatRange(plan.expectations.leadsRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated CPL</span>
                      <span className="text-white font-semibold">
                        AED {formatRange(plan.expectations.cplRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated CPC</span>
                      <span className="text-white font-semibold">
                        AED {formatRange(plan.expectations.cpcRange)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle>Ad Copy Draft</CardTitle>
                <CardDescription>Ready-to-launch headlines and descriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headlines</p>
                  <div className="mt-3 space-y-2">
                    {plan.headlines.map((headline, idx) => (
                      <div key={`${headline}-${idx}`} className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white">
                        {headline}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descriptions</p>
                  <div className="mt-3 space-y-2">
                    {plan.descriptions.map((description, idx) => (
                      <div key={`${description}-${idx}`} className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">
                        {description}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Keyword Plan</CardTitle>
              <CardDescription>High-intent searches prioritized for UAE buyers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.keywords.map((keyword, idx) => (
                <div
                  key={`${keyword.term}-${idx}`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{keyword.term}</p>
                    <p className="text-xs text-zinc-500">
                      {keyword.volume ? `${formatCompact(keyword.volume)} searches` : 'Volume estimate pending'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <Badge className="bg-white/5 text-zinc-300 border-white/10 uppercase tracking-widest text-[10px]">
                      {keyword.competition || 'medium'}
                    </Badge>
                    {keyword.cpc && (
                      <span>
                        CPC AED {formatRange(keyword.cpc)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function formatCompact(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(value);
}

function formatRange(range: { low: number; high: number }) {
  return `${formatNumber(range.low)}-${formatNumber(range.high)}`;
}
