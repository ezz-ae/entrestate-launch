'use client';

import { useState } from 'react';
import { 
  BarChart3, Globe, LineChart as LineChartIcon, MousePointer2, 
  Plus, Users, CheckCircle2, MinusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PaymentModal } from '@/components/payment-modal';

// Dynamically import BudgetChart to avoid SSR issues with Recharts
const BudgetChart = dynamic(() => import('@/components/budget-chart').then(mod => mod.BudgetChart), { ssr: false });

interface Project {
  id: string;
  headline: string;
  description: string;
}

export function GoogleAdsDashboard({ projects, readOnly = false }: { projects: Project[], readOnly?: boolean }) {
  const [mobileView, setMobileView] = useState<'config' | 'preview'>('config');
  const [selectedProjectId] = useState<string>(projects[0]?.id || '');
  const [location] = useState("Dubai, UAE");
  const [budget] = useState(50);
  const [newKeyword, setNewKeyword] = useState("");
  const [newNegativeKeyword, setNewNegativeKeyword] = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading] = useState(false);
  const [adConfig, setAdConfig] = useState<any>(null);
  const [competitors] = useState<any[]>([]);

  // Estimates logic
  const baseCpc = adConfig?.estimatedCpc || 3.5;
  const dailyClicks = Math.floor(budget / baseCpc);
  const dailyImpressions = dailyClicks * 22;
  const dailyLeads = Math.floor(dailyClicks * 0.04);
  const totalCampaignRate = 85;
  const duration = 30;

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

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto px-6">
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

              {/* Ad Reach Visualization */}
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
                      {adConfig.descriptions[0]}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400">Select a project to see a preview</div>
                )}
              </div>

              {/* Keywords Cloud */}
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Targeting Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {adConfig?.baseKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300">
                      {kw}
                    </span>
                  ))}
                </div>
                {!readOnly && (
                  <div className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
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
                </div>
                <div className="flex flex-wrap gap-2">
                  {negativeKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2">
                      <MinusCircle className="h-3 w-3" /> {kw}
                    </span>
                  ))}
                </div>
                {!readOnly && (
                  <div className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      value={newNegativeKeyword}
                      onChange={(e) => setNewNegativeKeyword(e.target.value)}
                      placeholder="Add negative keyword..."
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
      </div>

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={async () => {}}
        dailyBudget={budget}
        duration={duration}
      />
    </LayoutGroup>
  );
}