'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MousePointer2, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Filter,
  Ban,
  TrendingUp,
  Calculator,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types & Mock Data ---

interface SearchQuery {
  id: string;
  text: string;
  intent: 'high' | 'low';
  matchedProject?: string;
  status: 'searching' | 'filtered' | 'matched' | 'converted';
}

const MOCK_INVENTORY = [
  { id: 'p1', name: 'Dubai Hills Estate', type: 'Villa', price: '3M AED', keywords: ['villa', 'dubai hills', 'family'] },
  { id: 'p2', name: 'Downtown Views', type: 'Apartment', price: '1.8M AED', keywords: ['downtown', 'apartment', 'view'] },
  { id: 'p3', name: 'Palm Jumeirah', type: 'Penthouse', price: '15M AED', keywords: ['palm', 'luxury', 'penthouse'] },
];

const POSSIBLE_QUERIES = [
  { text: "buy 3 bed villa dubai hills", intent: "high", match: "p1" },
  { text: "cheap rent dubai", intent: "low" },
  { text: "downtown dubai apartments for sale", intent: "high", match: "p2" },
  { text: "real estate jobs", intent: "low" },
  { text: "luxury penthouse palm jumeirah", intent: "high", match: "p3" },
  { text: "studio for rent", intent: "low" },
  { text: "dubai hills maple floor plan", intent: "high", match: "p1" },
  { text: "property prices trend", intent: "low" },
];

const TOP_KEYWORDS = [
  { term: "luxury villas dubai", volume: 12500, intent: 85 },
  { term: "buy apartment downtown", volume: 8200, intent: 75 },
  { term: "dubai hills estate", volume: 6100, intent: 90 },
  { term: "off plan projects", volume: 15000, intent: 60 },
];

export function IntentCaptureDemo() {
  const [budget, setBudget] = useState(500); // Daily budget
  const [queries, setQueries] = useState<SearchQuery[]>([]);
  const [stats, setStats] = useState({ impressions: 0, clicks: 0, leads: 0, spend: 0 });
  
  // ROI Calculations
  const monthlySpend = budget * 30;
  const estCpc = 15;
  const estClicks = Math.floor(monthlySpend / estCpc);
  const conversionRate = 0.045; // 4.5%
  const estLeads = Math.floor(estClicks * conversionRate);
  const closingRate = 0.012; // 1.2%
  const estDeals = Math.max(1, Math.floor(estLeads * closingRate)); // Min 1 for optimism
  const avgCommission = 35000;
  const estRevenue = estDeals * avgCommission;
  const roi = Math.round(((estRevenue - monthlySpend) / monthlySpend) * 100);

  // Simulation Loop
  useEffect(() => {
    // Higher budget = faster generation
    const speed = Math.max(200, 3000 - (budget * 2)); 
    
    const interval = setInterval(() => {
      const template = POSSIBLE_QUERIES[Math.floor(Math.random() * POSSIBLE_QUERIES.length)];
      const newQuery: SearchQuery = {
        id: Math.random().toString(36).substr(2, 9),
        text: template.text,
        intent: template.intent as 'high' | 'low',
        matchedProject: template.match,
        status: 'searching'
      };

      setQueries(prev => [...prev.slice(-12), newQuery]); // Keep last 12 to prevent DOM overload
      setStats(prev => ({ ...prev, impressions: prev.impressions + 1, spend: prev.spend + (budget / 1000) }));

      // Simulate processing
      setTimeout(() => {
        setQueries(prev => prev.map(q => {
          if (q.id === newQuery.id) {
            if (q.intent === 'low') return { ...q, status: 'filtered' };
            return { ...q, status: 'matched' };
          }
          return q;
        }));

        if (newQuery.intent === 'high') {
          setStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
          // Conversion chance
          setTimeout(() => {
             if (Math.random() > 0.3) {
                setQueries(prev => prev.map(q => q.id === newQuery.id ? { ...q, status: 'converted' } : q));
                setStats(prev => ({ ...prev, leads: prev.leads + 1 }));
             }
          }, 1000);
        }
      }, 1500);

    }, speed);

    return () => clearInterval(interval);
  }, [budget]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      
      {/* Left: Controls & ROI Calculator */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Budget Control */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Daily Ad Spend</h3>
            <span className="font-mono text-lg font-bold text-blue-600">AED {budget}</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-800"
          />
          <p className="mt-2 text-xs text-slate-500">
            Increasing budget accelerates impression share and lead velocity.
          </p>
        </div>

        {/* Live ROI Calculator */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Live ROI Estimator</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Est. Monthly Leads</span>
              <span className="font-bold text-slate-900 dark:text-white">{estLeads}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Proj. Deals (1.2%)</span>
              <span className="font-bold text-slate-900 dark:text-white">{estDeals}</span>
            </div>
            <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Est. Revenue</span>
              <span className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumSignificantDigits: 3 }).format(estRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">ROI</span>
              <span className="text-xs font-bold text-green-500">+{roi}%</span>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Keywords Traffic</h3>
          </div>
          <div className="space-y-3">
            {TOP_KEYWORDS.map((kw, i) => (
              <div key={i} className="group flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{kw.term}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${kw.intent}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">{kw.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: The Visualization Garden */}
      <div className="lg:col-span-8 relative min-h-[600px] rounded-3xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/50 overflow-hidden flex flex-col">
        
        {/* Zone 1: Google Search (Top) */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm dark:bg-slate-900">
            <Search className="h-3 w-3" /> Google Search Network
          </div>
        </div>

        {/* The Stream */}
        <div className="flex-1 relative">
          <AnimatePresence>
            {queries.map((query) => (
              <QueryParticle key={query.id} query={query} />
            ))}
          </AnimatePresence>
        </div>

        {/* Zone 2: The Filter (Middle) */}
        <div className="relative z-10 my-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
          </div>
          <div className="relative mx-auto flex w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Filter className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Intent Filter</span>
          </div>
        </div>

        {/* Zone 3: Inventory Buckets (Bottom) */}
        <div className="grid grid-cols-3 gap-4 mt-auto relative z-10">
          {MOCK_INVENTORY.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Building2 className="h-5 w-5 text-slate-500" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{project.name}</div>
              <div className="text-xs text-slate-500">{project.type}</div>
              
              {/* Active Leads Indicator */}
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {queries.filter(q => q.matchedProject === project.id && (q.status === 'matched' || q.status === 'converted')).map(q => (
                  <motion.div 
                    key={q.id}
                    layoutId={q.id}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      q.status === 'converted' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-blue-500"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function QueryParticle({ query }: { query: SearchQuery }) {
  // Determine visual state based on status
  const isFiltered = query.status === 'filtered';
  const isMatched = query.status === 'matched' || query.status === 'converted';
  
  return (
    <motion.div
      layoutId={query.id}
      initial={{ opacity: 0, y: -20, x: Math.random() * 40 - 20 }}
      animate={{ 
        opacity: isFiltered ? 0 : 1, 
        y: isMatched ? 200 : isFiltered ? 100 : 0,
        scale: isFiltered ? 0.8 : 1
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={cn(
        "absolute left-0 right-0 mx-auto w-max max-w-[200px] rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm transition-colors",
        query.status === 'searching' && "border-slate-200 bg-white/80 text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
        query.status === 'filtered' && "border-red-200 bg-red-50 text-red-400 dark:border-red-900/30 dark:bg-red-900/20",
        (query.status === 'matched' || query.status === 'converted') && "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/30 dark:bg-blue-900/20"
      )}
      style={{ top: '10%' }} // Starting position
    >
      <div className="flex items-center gap-2">
        {isFiltered ? <Ban className="h-3 w-3" /> : <Search className="h-3 w-3" />}
        <span className="truncate">{query.text}</span>
      </div>
    </motion.div>
  );
}