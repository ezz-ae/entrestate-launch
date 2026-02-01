'use client';

import React, { useState } from 'react';
import { ArrowRight, Users, DollarSign, BarChart3 } from 'lucide-react';

export function ExecutionPreview() {
  const [leads, setLeads] = useState(50);
  const [conversion, setConversion] = useState(2.5);
  
  const avgDealValue = 1500000; // 1.5M AED
  const commission = 0.02; // 2%
  
  const deals = Math.floor(leads * (conversion / 100));
  const revenue = deals * avgDealValue * commission;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Pipeline Simulation</span>
        </div>
        <span className="text-xs text-slate-400">Dubai Hills Estate</span>
      </div>

      <div className="space-y-8">
        {/* Input Stage */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Monthly Leads
            </label>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{leads}</span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-800"
          />
        </div>

        {/* Processing Stage */}
        <div className="relative rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-medium text-slate-500 dark:bg-slate-900">
            AI Operator Processing
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Qualification Rate</span>
            <span className="font-medium text-slate-900 dark:text-white">{conversion}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${conversion * 10}%` }}
            />
          </div>
        </div>

        {/* Output Stage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <BarChart3 className="h-3 w-3" />
              Projected Deals
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {deals}
            </div>
          </div>
          <div className="rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-900/20">
            <div className="mb-1 flex items-center gap-2 text-xs text-blue-100">
              <DollarSign className="h-3 w-3" />
              Est. Commission
            </div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumSignificantDigits: 3 }).format(revenue)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <div className="h-1 w-1 rounded-full bg-slate-400" />
        <span>Based on real-time market averages</span>
      </div>
    </div>
  );
}