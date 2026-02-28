'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function StartPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Choose your plan
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start with the essentials, then upgrade as your listings and lead flow grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {['Starter', 'Growth', 'Enterprise'].map((plan) => (
            <div key={plan} className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold text-card-foreground">{plan}</h3>
              <div className="mt-4 mb-8">
                <span className="text-4xl font-bold text-card-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" /> Market Feed Access
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
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
