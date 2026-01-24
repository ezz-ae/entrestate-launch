'use client';

import { Suspense } from 'react';
import { LeadsSearch } from '@/components/leads-search';
import { ConnectCrmButton } from '@/components/connect-crm-button';
import { ExportLeadsButton } from '@/components/export-leads-button';

interface LeadsControlsProps {
  query: string;
}

export default function LeadsControls({ query }: LeadsControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Suspense fallback={null}>
        <LeadsSearch />
      </Suspense>
      <ConnectCrmButton />
      <ExportLeadsButton query={query} />
    </div>
  );
}
