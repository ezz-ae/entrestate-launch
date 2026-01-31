'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function StartPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
            Choose your operating plan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start with the essentials or go full-stack with our enterprise tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {['Starter', 'Growth', 'Enterprise'].map((plan) => (
            <div key={plan} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan}</h3>
              <div className="mt-4 mb-8">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Check className="h-4 w-4 text-green-500" /> Market Feed Access
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Check className="h-4 w-4 text-green-500" /> Basic Analytics
                </li>
              </ul>
              <Button className="w-full" variant={plan === 'Growth' ? 'default' : 'outline'}>
                Select {plan}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}