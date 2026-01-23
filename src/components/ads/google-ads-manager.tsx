'use client';

import React, { useState, useEffect } from "react";
import { fetchWallet, fetchWalletTransactions } from '@/lib/wallet-client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
    CheckCircle2, TrendingUp, MousePointerClick, Eye, Globe, 
    Target, Loader2, BarChart3, MapPin, Zap, 
    Sparkles, CreditCard, Lock
} from "lucide-react";
import { GenerateAdsOutput } from "@/ai/flows/generate-ads-from-page-content";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { authorizedFetch } from "@/lib/auth-fetch";

interface PrefillPlan {
  id?: string;
  summary?: string;
  prompt?: string;
  locationCity?: string;
  projectName?: string;
  audience?: string | null;
  createdAt?: string;
  adCampaignConfig?: {
    budget?: number;
    keywords?: string[];
  };
}

type AdsTab = 'setup' | 'creative' | 'keywords';

type CampaignStatus = 'draft' | 'generating' | 'funding' | 'active' | 'completed';

interface GoogleAdsManagerProps {
  pageTitle: string;
  pageDescription: string;
  userEmail?: string;
  prefillPlan?: PrefillPlan;
  prefillResetKey?: number;
  onPrefillReset?: () => void;
  initialTab?: AdsTab;
}

export function GoogleAdsManager({
  pageTitle,
  pageDescription,
  prefillPlan,
  prefillResetKey = 0,
  onPrefillReset,
  initialTab = 'setup',
}: GoogleAdsManagerProps) {
  const [activeTab, setActiveTab] = useState<AdsTab>(initialTab);
  const [budget, setBudget] = useState<number[]>([100]);
  const [duration, setDuration] = useState([30]);
  const [location, setLocation] = useState<string>('Dubai');
  const [adData, setAdData] = useState<GenerateAdsOutput | null>(null);
  const [status, setStatus] = useState<CampaignStatus>('draft');
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletLoading, setWalletLoading] = useState<boolean>(true);
  const [txLoading, setTxLoading] = useState<boolean>(true);
  const [prefillApplied, setPrefillApplied] = useState<boolean>(false);
  const [appliedPlanId, setAppliedPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [walletError, setWalletError] = useState<string | null>(null);

  const toast = useToast();

  // --- Fetch Wallet and Transactions ---
  useEffect(() => {
      setWalletLoading(true);
      fetchWallet()
          .then(setWallet)
          .catch((err) => setError(err.message))
          .finally(() => setWalletLoading(false));
  }, []);

  useEffect(() => {
      setTxLoading(true);
      fetchWalletTransactions()
          .then(setTransactions)
          .catch((err) => setError(err.message))
          .finally(() => setTxLoading(false));
  }, [wallet]);

  // Fetch transactions
  const loadTransactions = () => {
    setTxLoading(true);
    fetchWalletTransactions().then(res => setTransactions(res.transactions || [])).finally(() => setTxLoading(false));
  };

  // --- Generate Ad Campaign ---
  const handleGenerate = async () => {
      setStatus('generating');
      setError(null);
      try {
          const response = await authorizedFetch('/api/ads/google/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  pageTitle,
                  pageDescription,
                  location,
                  budget: budget[0],
                  duration: duration[0],
              }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data?.error || 'Ad generation failed');
          setAdData(data);
          setStatus('draft');
      } catch (err: any) {
          setError(err.message);
          setStatus('draft');
      }
  };

  const handleFundCampaign = async () => {
      setStatus('funding');
      // Simulate Payment
      setTimeout(() => {
          handleLaunch();
      }, 2000);
  }

    const handleLaunch = async () => {
        try {
            setIsLaunching(true);
            const totalBudget = budget[0] * duration[0];
            if (wallet && wallet.balance < totalBudget) {
                toast.toast({
                    title: 'Insufficient funds',
                    description: `Your wallet balance ($${wallet.balance}) is less than the campaign budget ($${totalBudget}).`,
                    variant: 'destructive',
                });
                setIsLaunching(false);
                return;
            }
            const payload = {
                budget: totalBudget,
                campaignDetails: {
                    name: `${pageTitle} Launch`,
                    duration: duration[0],
                    location,
                    variation: adData?.variations?.[selectedVariation],
                },
            };
            const response = await authorizedFetch('/api/ads/google/campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Campaign creation failed');
            }
            setStatus('active');
            toast.toast({
                title: "Campaign live!",
                description: `Your ads are now live and wallet charged.`,
            });
            // Refresh wallet and transactions
            setWalletLoading(true);
            fetchWallet().then(setWallet).finally(() => setWalletLoading(false));
            loadTransactions();
        } catch (error: any) {
            toast.toast({
                title: 'Failed to launch',
                description: error?.message || 'Please sign in again.',
                variant: 'destructive',
            });
            setStatus('draft');
        } finally {
            setIsLaunching(false);
        }
        };

  const estimatedReach = Math.floor(budget[0] * 1200); 
  const estimatedClicks = Math.floor(estimatedReach * 0.035);

  useEffect(() => {
      setActiveTab(initialTab ?? 'setup');
  }, [initialTab]);

  useEffect(() => {
        if (!prefillPlan) {
            setPrefillApplied(false);
            setAppliedPlanId(null);
            return;
        }
        const planId = prefillPlan.id ?? null;
        if (planId && planId === appliedPlanId) return;
        if (prefillPlan.adCampaignConfig?.budget) {
            setBudget([prefillPlan.adCampaignConfig.budget]);
            setPrefillApplied(true);
            setAppliedPlanId(planId);
        }
    }, [prefillPlan, appliedPlanId]);

    // --- Main Render ---
    return (
    <Card className="w-full border-white/5 bg-zinc-950 rounded-[3rem] overflow-hidden">
      <CardHeader className="p-10 border-b border-white/5">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Ad Launch Center</CardTitle>
            <CardDescription className="text-zinc-500 text-lg">We run Google Ads for {pageTitle}.</CardDescription>
          </div>
          {adData && <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Smart Strategy Active</Badge>}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs text-zinc-400">Wallet Balance:</span>
          {walletLoading ? (
            <span className="text-xs text-zinc-400 animate-pulse">Loading...</span>
          ) : walletError ? (
            <span className="text-xs text-red-500">{walletError}</span>
          ) : (
            <span className={wallet && wallet.balance < budget[0] * duration[0] ? 'text-red-500 font-bold' : 'text-green-400 font-bold'}>
              ${wallet?.balance?.toLocaleString() ?? '0'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-10">
        {status === 'generating' ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">Finding the best search keywords...</p>
          </div>
        ) : !adData ? (
          <div className="space-y-6">
            <div className="grid gap-6 p-12 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white">Quick Launch</h3>
                <p className="text-zinc-500 max-w-md mx-auto">We will draft a campaign for you. No Google Ads experience needed.</p>
              </div>
              <div className="max-w-xs mx-auto space-y-4 text-left w-full">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Location</Label>
                  <div className="flex gap-2 relative">
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-zinc-600" />
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pl-12 h-12 bg-black border-white/10 rounded-xl" />
                  </div>
                </div>
                <Button onClick={handleGenerate} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl">
                  <Sparkles className="h-5 w-5 mr-2" /> Generate Draft
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as AdsTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 bg-black/40 p-1.5 rounded-2xl h-14">
              <TabsTrigger value="setup" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">1. Budget</TabsTrigger>
              <TabsTrigger value="creative" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">2. Strategy</TabsTrigger>
              <TabsTrigger value="keywords" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">3. Keywords</TabsTrigger>
            </TabsList>
            <TabsContent value="setup" className="space-y-8 animate-in fade-in duration-300">
              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-white">Daily Budget</Label>
                    <span className="font-black text-3xl text-blue-500">${budget[0]}</span>
                  </div>
                  <Slider value={budget} min={20} max={1000} step={10} onValueChange={setBudget} className="py-4" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl text-center border border-white/5">
                    <div className="text-3xl font-black text-white">{estimatedReach.toLocaleString()}</div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Daily Impressions</p>
                  </div>
                  <div className="p-6 bg-blue-600/10 rounded-3xl text-center border border-blue-500/20">
                    <div className="text-3xl font-black text-blue-500">{estimatedClicks}</div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Est. Daily Clicks</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-zinc-900/80 border border-white/10 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">Transaction Summary:</span>
                    <span className="text-xs text-zinc-400">Total Budget: <span className="font-bold text-white">${budget[0] * duration[0]}</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-zinc-400">Duration:</span>
                    <span className="text-xs text-white font-bold">{duration[0]} days</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-zinc-400">Wallet After Spend:</span>
                    <span className={wallet && wallet.balance < budget[0] * duration[0] ? 'text-red-500 font-bold' : 'text-green-400 font-bold'}>
                      ${wallet ? (wallet.balance - budget[0] * duration[0]).toLocaleString() : '...'}
                    </span>
                  </div>
                  {wallet && wallet.balance < budget[0] * duration[0] && (
                    <div className="mt-2 text-xs text-red-500 font-bold">Insufficient funds to launch campaign.</div>
                  )}
                </div>
                <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold mt-6" onClick={() => setActiveTab("creative")}>Review Strategy <ChevronRight className="ml-2 h-5 w-5" /></Button>
              </div>
            </TabsContent>
            <TabsContent value="creative" className="space-y-8">
              <div className="p-8 bg-white text-black rounded-[2rem] shadow-2xl max-w-xl mx-auto font-sans relative">
                <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-0 text-[8px] font-black uppercase">EntreSite Managed</Badge>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-black text-xs">Ad</span>
                  <span className="text-xs text-gray-400">entrestate.com/p/{pageTitle.toLowerCase().replace(/\s/g, '-')}</span>
                </div>
                <div className="text-xl text-[#1a0dab] font-medium mb-1">
                  {adData && adData.variations[selectedVariation].headlines[0]} | {adData && adData.variations[selectedVariation].headlines[1]}
                </div>
                <div className="text-sm text-[#4d5156]">
                  {adData && adData.variations[selectedVariation].descriptions[0]}
                </div>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold" onClick={() => setActiveTab("keywords")}>Next: Search Keywords <ChevronRight className="ml-2 h-5 w-5" /></Button>
            </TabsContent>
            <TabsContent value="keywords" className="space-y-8">
              <div className="flex flex-wrap gap-3">
                {adData && adData.keywordGroups[0].keywords.map((k, i) => (
                  <Badge key={i} className="bg-white/5 border-white/10 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium">{k}</Badge>
                ))}
              </div>
              <div className="p-10 bg-blue-600 rounded-[2.5rem] text-white">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Total Budget</p>
                    <p className="text-5xl font-black">${(budget[0] * duration[0]).toLocaleString()}</p>
                    <p className="text-xs font-bold opacity-60 mt-1">{duration[0]} days of ads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Est. Qualified Leads</p>
                    <p className="text-5xl font-black">~{Math.floor(estimatedClicks * 0.08 * duration[0])}</p>
                  </div>
                </div>
                <Button onClick={handleFundCampaign} className="w-full h-20 rounded-[1.5rem] bg-white text-blue-600 font-black text-2xl shadow-2xl hover:scale-[1.02] transition-transform" disabled={wallet ? wallet.balance < budget[0] * duration[0] : false}>
                  <CreditCard className="mr-3 h-6 w-6" /> Confirm & Launch
                </Button>
                <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
                  <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><Lock className="h-3 w-3" /> Secure checkout</div>
                  <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><Target className="h-3 w-3" /> Auto-launch</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-2 text-white">Recent Wallet Transactions</h3>
          {txLoading ? (
            <div className="text-xs text-zinc-400 animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-2">
              {transactions.length === 0 && <div className="text-xs text-zinc-400">No transactions yet.</div>}
              {transactions.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-zinc-900/80 border border-white/10 rounded-lg px-4 py-2">
                  <span className={tx.type === 'spend' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                    {tx.type === 'spend' ? '-' : '+'}${tx.amount}
                  </span>
                  <span className="text-zinc-300">{tx.description || tx.type}</span>
                  <span className="text-zinc-500">{tx.createdAt ? new Date(tx.createdAt.seconds ? tx.createdAt.seconds * 1000 : tx.createdAt).toLocaleString() : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ label, value, icon: Icon, highlight }: any) {
    return (
        <div className={cn(
            "p-6 rounded-3xl border flex flex-col justify-between",
            highlight ? "bg-blue-600/10 border-blue-500/20" : "bg-zinc-900 border-white/5"
        )}>
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                <Icon className={cn("h-4 w-4", highlight ? "text-blue-500" : "text-zinc-700")} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    )
}

function ChevronRight(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg> }
