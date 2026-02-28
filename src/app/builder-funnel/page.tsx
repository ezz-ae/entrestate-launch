'use client';

import React from 'react';
import { PipelineBuilder } from '@/components/marketing/pipeline-builder';
import { SiteHeader } from '@/components/site-header';

export default function BuilderFunnelPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Sales Flow Builder</h1>
          <p className="mt-2 text-muted-foreground">
            Arrange your listings and sales roles to preview how your lead flow will work.
          </p>
        </div>
        <PipelineBuilder />
      </div>
    </main>
  );
}
