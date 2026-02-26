'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  { id: 'new', label: 'New Leads', color: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'qualified', label: 'AI Qualified', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'closed', label: 'Closed Won', color: 'bg-green-50 dark:bg-green-900/20' },
];

const MOCK_LEADS = [
  { id: 'l1', name: 'Sarah J.', value: 1500000, stage: 'new' },
  { id: 'l2', name: 'Mike T.', value: 2200000, stage: 'new' },
  { id: 'l3', name: 'Ahmed K.', value: 3500000, stage: 'new' },
  { id: 'l4', name: 'Lisa R.', value: 1800000, stage: 'new' },
];

export function PipelineDemo() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeads(currentLeads => {
        return currentLeads.map(lead => {
          // Randomly move leads forward
          if (Math.random() > 0.7) {
            if (lead.stage === 'new') return { ...lead, stage: 'qualified' };
            if (lead.stage === 'qualified') return { ...lead, stage: 'negotiation' };
            if (lead.stage === 'negotiation') {
               return { ...lead, stage: 'closed' };
            }
            if (lead.stage !== 'closed') {
              setRevenue(r => r + (lead.value * 0.02)); // 2% commission
            }
          }
          // Reset if closed for demo loop
          if (lead.stage === 'closed' && Math.random() > 0.8) {
             return { ...lead, stage: 'new' };
          }
          return lead;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Pipeline View</h3>
          <p className="text-sm text-slate-500">Leads are automatically routed based on intent score.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <DollarSign className="h-4 w-4" />
          <span className="font-mono font-bold">{new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumSignificantDigits: 3 }).format(revenue)}</span>
          <span className="text-xs opacity-75">Revenue</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <div key={stage.id} className={cn("rounded-xl p-4 min-h-[300px]", stage.color)}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{stage.label}</span>
              <span className="rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-black/20 dark:text-slate-300">
                {leads.filter(l => l.stage === stage.id).length}
              </span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {leads.filter(l => l.stage === stage.id).map(lead => (
                  <motion.div
                    key={lead.id}
                    layoutId={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', notation: "compact" }).format(lead.value)}
                        </div>
                      </div>
                    </div>
                    {stage.id === 'qualified' && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-600">
                        <CheckCircle className="h-3 w-3" /> AI Verified
                      </div>
                    )}
                    {stage.id === 'negotiation' && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-600">
                        <Calendar className="h-3 w-3" /> Meeting Set
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}