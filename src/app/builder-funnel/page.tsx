'use client';

import React from 'react';
import { PipelineBuilder } from '@/components/builder/pipeline-builder';
import { SiteHeader } from '@/components/layout/site-header';

export default function BuilderFunnelPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Execution Stack Builder</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Assemble your real estate sales pipeline. Drag inventory and operators to simulate performance.
          </p>
        </div>
        <PipelineBuilder />
      </div>
    </main>
  );
}
