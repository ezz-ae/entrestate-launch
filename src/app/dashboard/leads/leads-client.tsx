'use client';

import { Suspense } from 'react';
import { AudienceGenerator } from '@/components/audience-generator';
import { CampaignTriggers } from '@/components/campaign-triggers';
import { SyncCrmButton } from '@/components/sync-crm-button';
import { Pagination } from '@/components/pagination';
import { LeadsTable } from '@/components/leads-table';
import type { LeadRecord } from './types';
import LeadsControls from './leads-controls';

interface LeadsClientProps {
  leads: LeadRecord[];
  totalLeads: number;
  hasNextPage: boolean;
  from: number;
  to: number;
  currentSort: string;
  currentOrder: string;
  currentPage: number;
  query: string;
  fetchError: string | null;
}

export default function LeadsClient({
  leads,
  totalLeads,
  hasNextPage,
  from,
  to,
  currentSort,
  currentOrder,
  currentPage,
  query,
  fetchError,
}: LeadsClientProps) {
  const pagination = <Pagination currentPage={currentPage} hasNextPage={hasNextPage} />;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Leads Execution Pipe</h1>
            <p className="text-zinc-400 mt-1">Orchestrate your lead data, campaigns, and audiences.</p>
          </div>
          <Suspense fallback={<div className="h-10 w-full rounded-full bg-zinc-900" />}>
            <LeadsControls query={query} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AudienceGenerator />
          <CampaignTriggers />
          <SyncCrmButton />
        </div>

        {fetchError && (
          <div className="rounded border border-red-500 bg-red-900/60 p-4 text-sm text-red-100">
            {fetchError}
          </div>
        )}
        <LeadsTable
          leads={leads}
          pagination={pagination}
          totalCount={totalLeads}
          from={from}
          to={to}
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      </div>
    </div>
  );
}
