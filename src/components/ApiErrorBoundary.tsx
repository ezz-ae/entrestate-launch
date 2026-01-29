'use client';

import { useState, useEffect } from 'react';
import { Activity, BarChart3, Calendar, Check, CheckCircle2, Clock, Copy, Download, Globe, Languages, LineChart as LineChartIcon, Link as LinkIcon, Loader2, List, MapPin, Megaphone, MinusCircle, MousePointer2, Phone, Plus, Share2, Smartphone, Tag, Target, TrendingUp, UserCircle, Users, Zap, Search, Edit3, ArrowRight, Sparkles, ShieldCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCampaignDraft, analyzeSource, getCompetitorAnalysis, generateShareLink, getCampaignStatus } from '@/app/actions/google-ads';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/payment-modal';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import BudgetChart to avoid SSR issues with Recharts
const BudgetChart = dynamic(() => import('@/components/budget-chart').then(mod => mod.BudgetChart), { ssr: false });

interface Project {
  id: string;
  headline: string;
  description: string;
}

export function GoogleAdsDashboard({ projects, readOnly = false }: { projects: Project[], readOnly?: boolean }) {
  const [step, setStep] = useState<'source' | 'analyzing' | 'config' | 'active' | 'builder'>(readOnly ? 'active' : 'source');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceType, setSourceType] = useState<'project' | 'url'>('project');
  const [mobileView, setMobileView] = useState<'config' | 'preview'>('config');
  
  const [budget, setBudget] = useState(50); // Daily budget in AED
  const [totalBudget, setTotalBudget] = useState(1500);
  const [adConfig, setAdConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([]);
  const [newNegativeKeyword, setNewNegativeKeyword] = useState("");
  const [location, setLocation] = useState("Dubai, UAE");
  const [ageRange, setAgeRange] = useState("25-54");
  const [duration, setDuration] = useState(30); // Default 30 days
  const [campaignGoal, setCampaignGoal] = useState("Maximize Conversions");
  const [gender, setGender] = useState("All");
  const [deviceTarget, setDeviceTarget] = useState("All Devices");
  const [languageTarget, setLanguageTarget] = useState("English");
  const [scheduleDays, setScheduleDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [scheduleStart, setScheduleStart] = useState("09:00");
  const [scheduleEnd, setScheduleEnd] = useState("17:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sitelinks, setSitelinks] = useState<{text: string, url: string}[]>([]);
  const [newSitelinkText, setNewSitelinkText] = useState("");
  const [newSitelinkUrl, setNewSitelinkUrl] = useState("");
  const [callouts, setCallouts] = useState<string[]>([]);
  const [newCallout, setNewCallout] = useState("");
  const [structuredSnippets, setStructuredSnippets] = useState<string[]>([]);
  const [newSnippet, setNewSnippet] = useState("");
  const [priceExtensions, setPriceExtensions] = useState<{header: string, price: string, description: string}[]>([]);
  const [newPriceHeader, setNewPriceHeader] = useState("");
  const [newPriceAmount, setNewPriceAmount] = useState("");
  const [newPriceDesc, setNewPriceDesc] = useState("");
  const [campaignStatus, setCampaignStatus] = useState<any>(null);

  // Smart Builder Estimates
  const baseCpc = adConfig?.estimatedCpc || 3.5;
  const cpc = baseCpc + (budget / 1000); 
  const dailyClicks = Math.floor(budget / cpc);
  const dailyImpressions = dailyClicks * 22;
  const conversionRate = 0.04;
  const dailyLeads = Math.floor(dailyClicks * conversionRate);
  const totalCampaignRate = Math.min(75 + (budget / 20), 98); // Score out of 100

  const handleConnect = async () => {
    setStep('analyzing');
    setIsLoading(true);
    try {
      const source = sourceType === 'project' ? selectedProjectId : externalUrl;
      
      const analysis = await analyzeSource(source);
      
      const [compData, status, draft] = await Promise.all([
        getCompetitorAnalysis(source),
        getCampaignStatus(source),
        createCampaignDraft(source, analysis)
      ]);

      setAdConfig(analysis);
      setCompetitors(compData);
      
      // Simulate "Screening" animation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStep('config');
    } catch (error) {
      console.error(error);
      setStep('source');
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
    setStep('analyzing'); // Reuse analyzing for "Launching" state
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLaunching(false);
    setStep('active');
    setCampaignStatus({ status: 'Active', impressions: 0, clicks: 0, cost: 0 });
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

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    const { jsPDF } = await import('jspdf');
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
    doc.text(`Target Location: ${location}`, margin, yPos);
    yPos += 10;
    doc.text(`Demographics: Age ${ageRange}, Gender ${gender}`, margin, yPos);
    yPos += 10;
    doc.text(`Campaign Duration: ${duration} days`, margin, yPos);
    yPos += 10;
    doc.text(`Campaign Goal: ${campaignGoal}`, margin, yPos);
    yPos += 10;
    doc.text(`Device Targeting: ${deviceTarget}`, margin, yPos);
    yPos += 10;
    doc.text(`Language Targeting: ${languageTarget}`, margin, yPos);
    yPos += 10;
    doc.text(`Ad Schedule: ${scheduleDays.join(", ")} (${scheduleStart} - ${scheduleEnd})`, margin, yPos);
    yPos += 10;
    doc.text(`Call Extension: ${phoneNumber || "None"}`, margin, yPos);
    yPos += 10;
    doc.text("Sitelinks:", margin, yPos);
    yPos += 7;
    sitelinks.forEach(link => { doc.text(`- ${link.text} (${link.url})`, margin + 5, yPos); yPos += 7; });
    yPos += 10;
    doc.text("Callout Extensions:", margin, yPos);
    yPos += 7;
    callouts.forEach(callout => { doc.text(`- ${callout}`, margin + 5, yPos); yPos += 7; });
    yPos += 10;
    doc.text("Structured Snippets:", margin, yPos);
    yPos += 7;
    structuredSnippets.forEach(snippet => { doc.text(`- ${snippet}`, margin + 5, yPos); yPos += 7; });
    yPos += 10;
    doc.text("Price Extensions:", margin, yPos);
    yPos += 7;
    priceExtensions.forEach(item => { doc.text(`- ${item.header}: ${item.price} (${item.description})`, margin + 5, yPos); yPos += 7; });
    yPos += 10;
    doc.text(`Est. Daily Leads: ${dailyLeads}-${dailyLeads + 2}`, margin, yPos);
    yPos += 20;

    if (campaignStatus) {
      doc.text(`Current Status: ${campaignStatus.status}`, margin, yPos);
    }

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

  const handleAddNegativeKeyword = () => {
    if (newNegativeKeyword.trim()) {
      setNegativeKeywords([...negativeKeywords, newNegativeKeyword.trim()]);
      setNewNegativeKeyword("");
    }
  };

  const handleAddSitelink = () => {
    if (newSitelinkText.trim() && newSitelinkUrl.trim()) {
      setSitelinks([...sitelinks, { text: newSitelinkText.trim(), url: newSitelinkUrl.trim() }]);
      setNewSitelinkText("");
      setNewSitelinkUrl("");
    }
  };

  const handleAddCallout = () => {
    if (newCallout.trim()) {
      setCallouts([...callouts, newCallout.trim()]);
      setNewCallout("");
    }
  };

  const handleAddSnippet = () => {
    if (newSnippet.trim()) {
      setStructuredSnippets([...structuredSnippets, newSnippet.trim()]);
      setNewSnippet("");
    }
  };

  const handleAddPriceExtension = () => {
    if (newPriceHeader.trim() && newPriceAmount.trim()) {
      setPriceExtensions([...priceExtensions, { header: newPriceHeader.trim(), price: newPriceAmount.trim(), description: newPriceDesc.trim() }]);
      setNewPriceHeader("");
      setNewPriceAmount("");
      setNewPriceDesc("");
    }
  };

  const toggleDay = (day: string) => {
    if (scheduleDays.includes(day)) {
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  
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

  const currentSourceLabel = sourceType === 'project' 
    ? projects.find(p => p.id === selectedProjectId)?.headline 
    : externalUrl;

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto px-6">
        {/* Mobile View Toggle */}
        <div className="lg:hidden col-span-full flex p-1 bg-zinc-900/50 border border-white/10 rounded-xl mb-2">
          <button 
            onClick={() => setMobileView('config')}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
              mobileView === 'config' ? "bg-white text-black shadow-lg" : "text-zinc-500"
            )}
          >
            <Edit3 className="h-3.5 w-3.5" /> Configuration
          </button>
          <button 
            onClick={() => setMobileView('preview')}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
              mobileView === 'preview' ? "bg-white text-black shadow-lg" : "text-zinc-500"
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Intelligence & Preview
          </button>
        </div>

        <AnimatePresence mode="wait">
          {(mobileView === 'config' || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.div 
              key="config-col"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn("lg:col-span-1 space-y-6", mobileView === 'config' ? "block" : "hidden lg:block")}
            >
        {/* Campaign Status */}
        {campaignStatus && (
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" /> Campaign Status
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Status</span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {campaignStatus.status}
              </span>
            </div>
            <div className="text-xs text-zinc-500">Running since {new Date().toLocaleDateString()}</div>
          </div>
        )}

          {/* STEP 1: SOURCE */}
          <motion.div layout className="bg-zinc-900/50 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <Globe className="h-4 w-4 text-blue-500" /> 01. Source
              </h3>
              {step !== 'source' && (
                <button onClick={() => setStep('source')} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Change
                </button>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {step === 'source' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 space-y-6">
                  <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setSourceType('project')}
                      className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", sourceType === 'project' ? "bg-white text-black shadow-lg" : "text-zinc-500")}
                    >My Projects</button>
                    <button 
                      onClick={() => setSourceType('url')}
                      className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", sourceType === 'url' ? "bg-white text-black shadow-lg" : "text-zinc-500")}
                    >External Link</button>
                  </div>

                  {sourceType === 'project' ? (
                    <select 
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.headline || 'Untitled Project'}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <input 
                        type="url" 
                        placeholder="https://your-landing-page.com"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <LinkIcon className="absolute right-4 top-4 h-4 w-4 text-zinc-600" />
                    </div>
                  )}

                  <Button 
                    onClick={handleConnect}
                    disabled={sourceType === 'url' && !externalUrl}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-600/10"
                  >
                    Connect & Analyze <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-4 bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connected Page</p>
                      <p className="text-sm font-bold text-white truncate">{currentSourceLabel}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* STEP 2: ANALYSIS (ONLY VISIBLE DURING LOADING) */}
          {step === 'analyzing' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-zinc-900/50 border border-blue-500/20 rounded-[2rem] p-12 text-center space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-blue-500 rounded-full" 
                />
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">Screening Landing Page...</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Extracting keywords, identifying target audience, and building ad extensions automatically.</p>
            </motion.div>
          )}

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
        {/* Location Targeting Input */}
        {step === 'config' && (
          <div className="bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-2xl">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
              <MapPin className="h-4 w-4 text-red-500" /> 02. Smart Targeting
          </h3>
          <div className="relative">
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 pl-10"
              disabled={readOnly}
            />
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
          </div>

        {/* Demographics */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
            <UserCircle className="h-4 w-4 text-purple-500" /> Demographics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Age Range</label>
              <select 
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                disabled={readOnly}
              >
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65+">65+</option>
                <option value="25-54">25-54 (Prime)</option>
                <option value="All">All Ages</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                disabled={readOnly}
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
            </div>

        {/* Campaign Duration */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Calendar className="h-4 w-4 text-green-500" /> Campaign Duration
              </h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-white">{duration} <span className="text-sm font-medium text-zinc-500">days</span></span>
          </div>
          <input 
            type="range" 
            min="7" 
            max="90" 
            step="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            disabled={readOnly}
          />
          <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase">
            <span>1 Week</span>
            <span>1 Month</span>
            <span>3 Months</span>
          </div>
            </div>

        {/* Campaign Goal */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Target className="h-4 w-4 text-blue-500" /> Campaign Goal
              </h3>
          <select 
            value={campaignGoal}
            onChange={(e) => setCampaignGoal(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            disabled={readOnly}
          >
            <option value="Maximize Clicks">Maximize Clicks</option>
            <option value="Maximize Conversions">Maximize Conversions</option>
            <option value="Target CPA">Target CPA</option>
          </select>
            </div>

        {/* Device Targeting */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Smartphone className="h-4 w-4 text-blue-500" /> Device Targeting
              </h3>
          <select 
            value={deviceTarget}
            onChange={(e) => setDeviceTarget(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            disabled={readOnly}
          >
            <option value="All Devices">All Devices (Recommended)</option>
            <option value="Mobile Only">Mobile Only</option>
            <option value="Desktop Only">Desktop Only</option>
          </select>
            </div>

        {/* Language Targeting */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Languages className="h-4 w-4 text-blue-500" /> Language Targeting
              </h3>
          <select 
            value={languageTarget}
            onChange={(e) => setLanguageTarget(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            disabled={readOnly}
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Both">Both (English & Arabic)</option>
          </select>
            </div>

        {/* Ad Schedule */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Clock className="h-4 w-4 text-blue-500" /> Ad Schedule
              </h3>
          
          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <button
                key={day}
                onClick={() => !readOnly && toggleDay(day)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  scheduleDays.includes(day) 
                    ? "bg-blue-600 text-white border-blue-500" 
                    : "bg-black/40 text-zinc-500 border-white/10 hover:bg-white/5"
                )}
                disabled={readOnly}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="time" 
              value={scheduleStart} 
              onChange={(e) => setScheduleStart(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              disabled={readOnly}
            />
            <span className="text-zinc-500 text-xs">to</span>
            <input 
              type="time" 
              value={scheduleEnd} 
              onChange={(e) => setScheduleEnd(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              disabled={readOnly}
            />
          </div>
            </div>

        {/* Call Extensions */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Phone className="h-4 w-4 text-blue-500" /> Call Extensions
              </h3>
          <div className="relative">
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+971 50 123 4567"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 pl-10"
              disabled={readOnly}
            />
            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
          </div>
            </div>

        {/* Sitelinks */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <LinkIcon className="h-4 w-4 text-blue-500" /> Sitelinks
              </h3>
          
          <div className="space-y-2">
            {sitelinks.map((link, i) => (
              <div key={i} className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p className="text-white font-medium">{link.text}</p>
                  <p className="text-zinc-500 text-xs truncate max-w-[200px]">{link.url}</p>
                </div>
                {!readOnly && <Button size="sm" variant="ghost" onClick={() => setSitelinks(sitelinks.filter((_, idx) => idx !== i))} className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"><MinusCircle className="h-4 w-4" /></Button>}
              </div>
            ))}
          </div>

          {!readOnly && (
            <div className="space-y-2">
              <input 
                type="text" 
                value={newSitelinkText}
                onChange={(e) => setNewSitelinkText(e.target.value)}
                placeholder="Link Text (e.g. Floor Plans)"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSitelinkUrl}
                  onChange={(e) => setNewSitelinkUrl(e.target.value)}
                  placeholder="URL (e.g. /floor-plans)"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Button size="sm" onClick={handleAddSitelink} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
            </div>

        {/* Callout Extensions */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Megaphone className="h-4 w-4 text-blue-500" /> Callout Extensions
              </h3>
          
          <div className="flex flex-wrap gap-2">
            {callouts.map((callout, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 flex items-center gap-2">
                {callout}
                {!readOnly && <button onClick={() => setCallouts(callouts.filter((_, idx) => idx !== i))} className="hover:text-red-400"><MinusCircle className="h-3 w-3" /></button>}
              </span>
            ))}
            {callouts.length === 0 && <span className="text-sm text-zinc-500 italic">No callouts added.</span>}
          </div>

          {!readOnly && (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCallout}
                onChange={(e) => setNewCallout(e.target.value)}
                placeholder="Callout text (e.g. Free Shipping)"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <Button size="sm" onClick={handleAddCallout} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
            </div>

        {/* Structured Snippets */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <List className="h-4 w-4 text-blue-500" /> Structured Snippets
              </h3>
          
          <div className="flex flex-wrap gap-2">
            {structuredSnippets.map((snippet, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 flex items-center gap-2">
                {snippet}
                {!readOnly && <button onClick={() => setStructuredSnippets(structuredSnippets.filter((_, idx) => idx !== i))} className="hover:text-red-400"><MinusCircle className="h-3 w-3" /></button>}
              </span>
            ))}
            {structuredSnippets.length === 0 && <span className="text-sm text-zinc-500 italic">No snippets added.</span>}
          </div>

          {!readOnly && (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                placeholder="Snippet text (e.g. Amenities: Pool, Gym)"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <Button size="sm" onClick={handleAddSnippet} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
            </div>

        {/* Price Extensions */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
                <Tag className="h-4 w-4 text-blue-500" /> Price Extensions
              </h3>
          
          <div className="space-y-2">
            {priceExtensions.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p className="text-white font-medium">{item.header} - {item.price}</p>
                  <p className="text-zinc-500 text-xs truncate max-w-[200px]">{item.description}</p>
                </div>
                {!readOnly && <Button size="sm" variant="ghost" onClick={() => setPriceExtensions(priceExtensions.filter((_, idx) => idx !== i))} className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"><MinusCircle className="h-4 w-4" /></Button>}
              </div>
            ))}
          </div>

          {!readOnly && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPriceHeader}
                  onChange={(e) => setNewPriceHeader(e.target.value)}
                  placeholder="Header (e.g. 1 Bedroom)"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text" 
                  value={newPriceAmount}
                  onChange={(e) => setNewPriceAmount(e.target.value)}
                  placeholder="Price (e.g. AED 1M)"
                  className="w-1/3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPriceDesc}
                  onChange={(e) => setNewPriceDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Button size="sm" onClick={handleAddPriceExtension} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
            </div>
          </div>
        )}

        {/* Budget Controller */}
        {step === 'config' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 opacity-50" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
              <Zap className={cn("h-4 w-4", getIntensityColor())} /> 03. Budget & Scale
            </h3>
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

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Managed by Entrestate Verified Accounts
              </div>
            <Button 
              size="lg" 
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-14 text-lg shadow-xl shadow-white/5"
              onClick={handleLaunchClick}
              disabled={isLaunching || isLoading}
            >
              {isLaunching ? <Loader2 className="animate-spin mr-2" /> : <TrendingUp className="mr-2 h-5 w-5" />}
              {isLaunching ? "Launching Campaign..." : "Launch Campaign"}
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A global Error Boundary to catch and display API-related errors.
 * Note: To catch async errors from fetchWithAuth, callers should re-throw 
 * them into the React render cycle using the useAsyncError hook.
 */
export class ApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ApiErrorBoundary] Caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Application Error</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {this.state.error?.message || "An unexpected error occurred while communicating with our services."}
              </p>
            </div>
            <Button 
              onClick={this.handleReset}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-2xl"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Retry Request
            </Button>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
            </div>
          </motion.div>
        )}
            </motion.div>
          )}
        </AnimatePresence>

      {/* Right Column: Intelligence & Preview */}
      <AnimatePresence mode="wait">
        {(mobileView === 'preview' || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.div 
            key="preview-col"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={cn("lg:col-span-2 space-y-6", mobileView === 'preview' ? "block" : "hidden lg:block")}
          >
        
        {/* Expectations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/30 border border-white/5 rounded-[1.5rem] p-6 text-center">
            <div className="mx-auto w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <MousePointer2 className="h-5 w-5" />
            </div>
            <div className="text-3xl font-black text-white">{dailyClicks}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Est. Clicks</div>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-[1.5rem] p-6 text-center">
            <div className="mx-auto w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-4">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-3xl font-black text-white">{dailyImpressions.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Impressions</div>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 rounded-[1.5rem] p-6 text-center relative overflow-hidden">
            <div className={cn("absolute inset-0 opacity-10 transition-colors duration-500", budget > 200 ? "bg-green-500" : "bg-transparent")} />
            <div className="mx-auto w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4 relative z-10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <div className="text-3xl font-black text-white">{dailyLeads}-{dailyLeads + 2}</div>
              <div className="px-2 py-0.5 rounded bg-green-500 text-[8px] font-black text-black uppercase">
                {totalCampaignRate}% Rate
              </div>
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold relative z-10">Daily Leads</div>
          </div>
        </div>

        {/* Location Map Visualization */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 overflow-hidden">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-blue-500" /> Ad Reach Visualization
          </h3>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-black/50 relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl mix-blend-overlay"></div>
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
            <div className="text-center py-8 text-zinc-400">Select a project to see a preview</div>
          )}
        </div>

        {/* Keywords Cloud */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
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

        {/* Negative Keywords */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Negative Keywords</h3>
            {!readOnly && <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Exclude Terms</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {negativeKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2">
                <MinusCircle className="h-3 w-3" /> {kw}
              </span>
            ))}
            {negativeKeywords.length === 0 && <span className="text-sm text-zinc-500 italic">No negative keywords added.</span>}
          </div>
          
          {!readOnly && (
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                value={newNegativeKeyword}
                onChange={(e) => setNewNegativeKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNegativeKeyword()}
                placeholder="Add negative keyword (e.g. free, cheap)..."
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <Button size="sm" onClick={handleAddNegativeKeyword} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:text-red-400">
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

          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={handleConfirmLaunch}
        dailyBudget={budget}
        duration={duration}
      />
    </div>
    </LayoutGroup>
  );
}
