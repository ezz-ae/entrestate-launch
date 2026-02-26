'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';

export function SimulationPanel({ isRunning }: { isRunning: boolean }) {
  const [metrics, setMetrics] = useState({ leads: 0, qualified: 0, deals: 0, revenue: 0 });

  useEffect(() => {
    if (!isRunning) {
      setMetrics({ leads: 0, qualified: 0, deals: 0, revenue: 0 });
      return;
    }

    const interval = setInterval(() => {
      setMetrics(prev => {
        if (prev.leads >= 100) return prev; // Cap simulation
        const newLeads = prev.leads + Math.floor(Math.random() * 3) + 1;
        const newQualified = Math.floor(newLeads * 0.4);
        const newDeals = Math.floor(newQualified * 0.2);
        return {
          leads: newLeads,
          qualified: newQualified,
          deals: newDeals,
          revenue: newDeals * 15000 // Dummy commission
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
          Live Simulation
        </h3>
        <span className="text-xs font-mono text-slate-500">REAL-TIME</span>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard 
          label="Leads Captured" 
          value={metrics.leads} 
          icon={<Users className="h-4 w-4 text-blue-500" />} 
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <ArrowRight className="hidden md:block h-6 w-6 text-slate-300 self-center justify-self-center" />
        <MetricCard 
          label="Qualified" 
          value={metrics.qualified} 
          icon={<CheckCircle className="h-4 w-4 text-purple-500" />} 
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
        <ArrowRight className="hidden md:block h-6 w-6 text-slate-300 self-center justify-self-center" />
        <MetricCard 
          label="Est. Revenue" 
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(metrics.revenue)} 
          icon={<DollarSign className="h-4 w-4 text-green-500" />} 
          bg="bg-green-50 dark:bg-green-900/20"
          highlight
        />
      </div>

      {isRunning && (
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, bg, highlight }: any) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-4 text-center ${bg} ${highlight ? 'ring-2 ring-green-500/20' : ''}`}>
      <div className="mb-2 rounded-full bg-white p-2 shadow-sm dark:bg-slate-800">
        {icon}
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}