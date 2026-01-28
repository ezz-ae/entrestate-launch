'use client';

import { Suspense } from 'react';
import { LabShell } from '../lab-shell';
import { LeadsTable } from '@/components/leads-table';
import { Button } from '@/components/ui/button';

const mockLeads = [
  {
    id: 'lead_demo_1',
    name: 'Dana Khalil',
    email: 'dana@example.com',
    phone: '+971501112233',
    status: 'new',
    created_at: new Date().toISOString(),
    notes: 'Asked for marina inventory.',
    projects: { headline: 'Marina Vista 2BR' },
  },
  {
    id: 'lead_demo_2',
    name: 'Omar Nasser',
    email: 'omar@example.com',
    phone: '+971554445566',
    status: 'qualified',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Budget verified, wants site visit.',
    projects: { headline: 'Downtown Studio' },
  },
];

export default function PipelineLabPage() {
  const pagination = (
    <Button variant="outline" size="sm" disabled className="border-zinc-800">
      Load more
    </Button>
  );

  return (
    <LabShell title="Lead Pipeline">
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-semibold">
            Internal QA
          </p>
          <p className="text-sm text-white leading-relaxed">
            This lab view uses mock leads. Use <code>/dashboard/leads</code> for live pipeline data.
          </p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-400">Loading lab pipeline...</div>}>
          <LeadsTable
            leads={mockLeads}
            pagination={pagination}
            totalCount={mockLeads.length}
            totalLabel="mock"
            from={0}
            to={mockLeads.length - 1}
            currentSort="created_at"
            currentOrder="desc"
          />
        </Suspense>
      </div>
    </LabShell>
  );
}
