'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Bot, Send, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 'inventory',
    title: 'Inventory Ingestion',
    icon: Database,
    description: 'Real-time sync with your property database. We normalize and enrich every listing automatically.',
    details: [
      'Auto-tagging features',
      'Price normalization',
      'Image optimization'
    ]
  },
  {
    id: 'intelligence',
    title: 'AI Processing',
    icon: Bot,
    description: 'Our Intent Engine analyzes listings to find the perfect buyer persona and selling angles.',
    details: [
      'Persona generation',
      'Copywriting',
      'Targeting strategy'
    ]
  },
  {
    id: 'execution',
    title: 'Multi-Channel Launch',
    icon: Send,
    description: 'Campaigns are deployed instantly across Google, Meta, and Email/SMS channels.',
    details: [
      'Ad creation',
      'Landing page gen',
      'Automated outreach'
    ]
  },
  {
    id: 'revenue',
    title: 'Revenue & ROI',
    icon: DollarSign,
    description: 'Leads are captured, qualified, and routed. You see real-time ROI, not just vanity metrics.',
    details: [
      'Lead scoring',
      'CRM sync',
      'Commission tracking'
    ]
  }
];

export function SystemFlow() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Flow Visualization */}
      <div className="relative grid gap-8 md:grid-cols-4">
        {/* Connecting Line (Desktop) */}
        <div className="absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block" />

        {STEPS.map((step, index) => {
          const isActive = activeStep === step.id;
          const isPrev = activeStep && STEPS.findIndex(s => s.id === activeStep) > index;

          return (
            <div 
              key={step.id}
              className="relative z-10 group"
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step Indicator */}
              <div className={cn(
                "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-slate-950",
                isActive ? "border-blue-500 shadow-xl scale-110" : 
                isPrev ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-800"
              )}>
                <step.icon className={cn(
                  "h-10 w-10 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400"
                )} />
                
                {/* Connector Arrow (Mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:hidden text-slate-300">
                    <ArrowRight className="h-6 w-6 rotate-90" />
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={cn(
                "rounded-xl border p-6 transition-all duration-300 min-h-[200px]",
                isActive ? "border-blue-500 bg-white shadow-lg dark:bg-slate-900" : "border-transparent bg-transparent"
              )}>
                <h3 className={cn(
                  "text-lg font-bold mb-2 text-center",
                  isActive ? "text-blue-600" : "text-slate-900 dark:text-white"
                )}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Details */}
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}