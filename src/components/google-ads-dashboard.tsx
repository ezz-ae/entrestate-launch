'use client';

import { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Users, MousePointer2, Loader2, CheckCircle2, Globe, BarChart3, LineChart as LineChartIcon, Share2, Copy, Check, Download } from 'lucide-react';
import { Search, Zap, TrendingUp, Users, MousePointer2, Loader2, CheckCircle2, Globe, BarChart3, LineChart as LineChartIcon, Share2, Copy, Check, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAdConfig, getCompetitorAnalysis, generateShareLink } from '@/app/actions/google-ads';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/payment-modal';
import { BudgetChart } from '@/components/budget-chart';
import { jsPDF } from 'jspdf';

interface Project {
  id: string;
  headline: string;
  description: string;
}

export function GoogleAdsDashboard({ projects, readOnly = false }: { projects: Project[], readOnly?: boolean }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [budget, setBudget] = useState(50); // Daily budget in AED
  const [adConfig, setAdConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  // Load initial ad config when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadAdConfig(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadAdConfig = async (id: string) => {
    setIsLoading(true);
    try {
      const config = await generateAdConfig(id);
      setAdConfig(config);
      const compData = await getCompetitorAnalysis(id);
      setCompetitors(compData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchClick = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmLaunch = async () => {
    setIsLaunching(true);
    setShowPaymentModal(false);
    // Simulate launch delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLaunching(false);
    alert("Campaign launched successfully!");
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await generateShareLink(selectedProjectId);
      const fullUrl = `${window.location.origin}${result.url}`;
      setShareUrl(fullUrl);
      navigator.clipboard.writeText(fullUrl);
      setTimeout(() => setShareUrl(null), 3000); // Reset after 3s
    } catch (error) {
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 30;

    // Title
    doc.setFontSize(22);
    doc.text("Google Ads Campaign Report", margin, yPos);
    yPos += 15;

    // Project Info
    doc.setFontSize(12);
    doc.text(`Project: ${projects.find(p => p.id === selectedProjectId)?.headline || 'Unknown'}`, margin, yPos);
    yPos += 10;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 20;

    // Metrics
    doc.setFontSize(16);
    doc.text("Projected Performance", margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Daily Budget: ${budget} AED`, margin, yPos);
    yPos += 10;
    doc.text(`Est. Daily Clicks: ${dailyClicks}`, margin, yPos);
    yPos += 10;
    doc.text(`Est. Daily Impressions: ${dailyImpressions.toLocaleString()}`, margin, yPos);
    yPos += 10;
    doc.text(`Est. Daily Leads: ${dailyLeads}-${dailyLeads + 2}`, margin, yPos);
    yPos += 20;

    // Ad Copy
    doc.setFontSize(16);
    doc.text("Ad Preview", margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    if (adConfig) {
      doc.text(`Headline 1: ${adConfig.headlines[0]}`, margin, yPos);
      yPos += 7;
      doc.text(`Headline 2: ${adConfig.headlines[1]}`, margin, yPos);
      yPos += 7;
      doc.text(`Description: ${adConfig.descriptions[0]}`, margin, yPos);
    }

    doc.save("campaign-report.pdf");
    setIsDownloading(false);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && adConfig) {
      setAdConfig({ ...adConfig, baseKeywords: [...adConfig.baseKeywords, newKeyword.trim()] });
      setNewKeyword("");
    }
  };

  // Calculations based on budget
  // As budget increases, CPC might go up slightly (competition), but volume explodes.
  const baseCpc = adConfig?.estimatedCpc || 3.5;
  const cpc = baseCpc + (budget / 1000); 
  const dailyClicks = Math.floor(budget / cpc);
  const dailyImpressions = dailyClicks * 18; // ~5.5% CTR
  const conversionRate = 0.04; // 4%
  const dailyLeads = Math.floor(dailyClicks * conversionRate);
  
  // Fire Gradient Logic
  // 50 AED = Green (Safe) -> 500 AED = Red (Aggressive)
  const intensity = Math.min((budget - 50) / 450, 1); // 0 to 1
  
  // Interpolate colors roughly
  // Low: #22c55e (Green) -> Mid: #eab308 (Yellow) -> High: #ef4444 (Red)
  const getIntensityColor = () => {
    if (intensity < 0.5) return "text-emerald-400";
    if (intensity < 0.8) return "text-yellow-400";
    return "text-red-500";
  };

  const getIntensityLabel = () => {
    if (intensity < 0.3) return "Conservative";
    if (intensity < 0.7) return "Balanced";
    return "Aggressive Growth";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Controls */}
      <div className="lg:col-span-1 space-y-8">
        
        {/* Project Selector */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" /> Source Landing Page
          </h3>
          {readOnly ? (
            <div className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400">
              {projects.find(p => p.id === selectedProjectId)?.headline || 'Selected Project'}
            </div>
          ) : (
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.headline || 'Untitled Project'}</option>
              ))}
            </select>
          )}
          <p className="text-xs text-zinc-500">
            The AI will analyze this page to generate your ad copy and keywords automatically.
          </p>
          
          {!readOnly && (
            <Button 
              variant="outline" 
              className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              onClick={handleShare}
              disabled={isSharing}
            >
              {shareUrl ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share2 className="mr-2 h-4 w-4" />}
              {shareUrl ? "Link Copied!" : "Share Dashboard"}
            </Button>
          )}

          <Button 
            variant="outline" 
            className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 mt-2"
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download Report
          </Button>
        </div>

        {/* Budget Controller */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 opacity-50" />
          
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 mb-1">
              <Zap className={cn("h-4 w-4", getIntensityColor())} /> Daily Budget
            </h3>
            <p className={cn("text-xs font-bold uppercase tracking-wider", getIntensityColor())}>
              {getIntensityLabel()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-white">{budget} <span className="text-sm font-medium text-zinc-500">AED/day</span></span>
              <span className="text-xs text-zinc-500">{(budget * 30).toLocaleString()} AED / mo</span>
            </div>
            
            <input 
              type="range" 
              min="50" 
              max="500" 
              step="10"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              disabled={readOnly}
            />
            <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase">
              <span>Starter</span>
              <span>Scale</span>
              <span>Dominate</span>
            </div>
          </div>
        </div>

        {!readOnly && (
          <>
            <Button 
              size="lg" 
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-14 text-lg shadow-xl shadow-white/5"
              onClick={handleLaunchClick}
              disabled={isLaunching || isLoading}
            >
              {isLaunching ? <Loader2 className="animate-spin mr-2" /> : <TrendingUp className="mr-2 h-5 w-5" />}
              {isLaunching ? "Launching Campaign..." : "Launch Campaign"}
            </Button>
            <p className="text-[10px] text-center text-zinc-600">
              Billed via Entrestate Managed Accounts. Cancel anytime.
            </p>
          </>
        )}
      </div>

      {/* Right Column: Intelligence & Preview */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Expectations Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 text-center">
            <div className="mx-auto w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3">
              <MousePointer2 className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-white">{dailyClicks}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Est. Clicks</div>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 text-center">
            <div className="mx-auto w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-white">{dailyImpressions.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Impressions</div>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className={cn("absolute inset-0 opacity-10 transition-colors duration-500", budget > 200 ? "bg-green-500" : "bg-transparent")} />
            <div className="mx-auto w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-3 relative z-10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-white relative z-10">{dailyLeads}-{dailyLeads + 2}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold relative z-10">Daily Leads</div>
          </div>
        </div>

        {/* Budget vs Clicks Chart */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <LineChartIcon className="h-4 w-4 text-blue-500" /> Budget vs. Clicks Projection
          </h3>
          <BudgetChart budget={budget} baseCpc={baseCpc} />
        </div>

        {/* Ad Preview */}
        <div className="bg-white rounded-2xl p-6 text-black font-sans border border-zinc-800">
          <div className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">Google Search Preview</div>
          
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
              <div className="h-6 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 rounded w-full"></div>
            </div>
          ) : adConfig ? (
            <div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="font-bold">Ad</span>
                <span className="text-zinc-600">www.entrestate.com/projects/{selectedProjectId.slice(0,8)}</span>
              </div>
              <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1">
                {adConfig.headlines[0]} | {adConfig.headlines[1]}
              </h3>
              <p className="text-sm text-[#4d5156] leading-relaxed">
                {adConfig.descriptions[0]} {adConfig.descriptions[1]}
              </p>
              
              {/* Sitelinks Extension Simulation */}
              <div className="mt-4 flex gap-4 text-sm text-[#1a0dab]">
                <span className="hover:underline cursor-pointer">Floor Plans</span>
                <span className="hover:underline cursor-pointer">Pricing</span>
                <span className="hover:underline cursor-pointer">Location</span>
                <span className="hover:underline cursor-pointer">Contact Us</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">Select a project to generate preview</div>
          )}
        </div>

        {/* Keywords Cloud */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Targeting Keywords</h3>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Targeting Keywords</h3>
            {!readOnly && <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Keyword Planner</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {adConfig?.baseKeywords.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300">
                {kw}
              </span>
            ))}
            {/* Dynamic keywords based on budget */}
            {budget > 150 && <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 animate-in fade-in">dubai luxury real estate</span>}
            {budget > 250 && <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 animate-in fade-in">buy apartment downtown</span>}
            {budget > 350 && <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 animate-in fade-in">high yield investment</span>}
            {budget > 450 && <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 animate-in fade-in">penthouse for sale</span>}
          </div>
          
          {!readOnly && (
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Add a keyword..."
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <Button size="sm" onClick={handleAddKeyword} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Competitor Analysis */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-orange-500" /> Competitor Landscape
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Competitor</th>
                  <th className="px-4 py-3">Impression Share</th>
                  <th className="px-4 py-3">Overlap Rate</th>
                  <th className="px-4 py-3 rounded-r-lg">Position Above</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competitors.map((comp, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{comp.name}</td>
                    <td className="px-4 py-3 text-zinc-300">{comp.impressionShare}</td>
                    <td className="px-4 py-3 text-zinc-300">{comp.overlapRate}</td>
                    <td className="px-4 py-3 text-zinc-300">{comp.positionAboveRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={handleConfirmLaunch}
        amount={budget}
      />
    </div>
  );
}