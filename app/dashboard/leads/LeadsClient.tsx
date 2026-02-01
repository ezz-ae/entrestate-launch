'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AudienceGenerator } from '@/components/audience-generator';
import { CampaignTriggers } from '@/components/campaign-triggers';
import { SyncCrmButton } from '@/components/sync-crm-button';
import { LeadsTable } from '@/components/leads-table';
import { LeadValidator } from '@/components/leads/lead-validator';
import type { LeadRecord } from './types';
import LeadsControls from './leads-controls';
import { useEntitlements } from '@/hooks/use-entitlements';
import { authorizedFetch } from '@/lib/auth-fetch';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const DEFAULT_SORT = 'created_at';
const DEFAULT_ORDER = 'desc';

function mapLeadRecord(raw: any): LeadRecord {
  const createdAt = raw?.createdAt || raw?.created_at;
  return {
    id: raw?.id,
    name: raw?.name || 'Unknown',
    email: raw?.email || 'unknown',
    phone: raw?.phone || null,
    status: typeof raw?.status === 'string' ? raw.status.toLowerCase() : 'new',
    created_at: createdAt || new Date().toISOString(),
    notes: raw?.notes || raw?.message || null,
    projects: {
      headline: raw?.projectHeadline || raw?.projectName || raw?.projects?.headline || null,
    },
  };
}

export default function LeadsClient() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q')?.toLowerCase().trim() || '';
  const currentSort = searchParams?.get('sort') || DEFAULT_SORT;
  const currentOrder = searchParams?.get('order') || DEFAULT_ORDER;
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const cursorRef = useRef<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadPage = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (!reset && cursorRef.current) params.set('cursor', cursorRef.current);
      const response = await authorizedFetch(`/api/leads/list?${params.toString()}`, {
        cache: 'no-store',
      });
      const body = await response.json();
      if (!body?.ok) {
        throw new Error(body?.error?.message || body?.error || 'Failed to load leads.');
      }
      const items = Array.isArray(body?.data?.items) ? body.data.items.map(mapLeadRecord) : [];
      setLeads((prev) => (reset ? items : [...prev, ...items]));
      cursorRef.current = body?.data?.nextCursor || null;
      setHasNextPage(Boolean(body?.data?.nextCursor));
    } catch (error: any) {
      setFetchError(error?.message || 'Unable to load leads right now.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    setLeads([]);
    cursorRef.current = null;
    setHasNextPage(true);
    loadPage(true);
  }, [loadPage]);

  const filteredLeads = useMemo(() => {
    if (!query) return leads;
    return leads.filter((lead) => {
      const values = [lead.name, lead.email, lead.phone].filter(Boolean).join(' ').toLowerCase();
      return values.includes(query);
    });
  }, [leads, query]);

  const sortedLeads = useMemo(() => {
    const sorted = [...filteredLeads];
    const direction = currentOrder === 'asc' ? 1 : -1;
    sorted.sort((a, b) => {
      if (currentSort === 'name') {
        return a.name.localeCompare(b.name) * direction;
      }
      if (currentSort === 'status') {
        return (a.status || '').localeCompare(b.status || '') * direction;
      }
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return (aDate - bDate) * direction;
    });
    return sorted;
  }, [filteredLeads, currentOrder, currentSort]);

  const pagination = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => loadPage(false)}
      disabled={loading || !hasNextPage}
      className="border-zinc-800"
    >
      {loading ? 'Loading…' : hasNextPage ? 'Load more' : 'No more leads'}
    </Button>
  );
  const { entitlements } = useEntitlements();
  const sendersLocked = entitlements?.features.senders.allowed === false;
  const sendersReason =
    entitlements?.features.senders.reason || 'Upgrade to unlock email and SMS senders.';

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
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads/cold-calling"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-200 hover:bg-white/10"
          >
            Cold Calling List
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AudienceGenerator />
          <CampaignTriggers
            leadIds={sortedLeads.map(lead => lead.id)}
            text="Hello, this is a test campaign."
            projectId="default-project"
          />
          <SyncCrmButton />
        </div>

        <LeadValidator />

        {sendersLocked && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-semibold">Senders locked</p>
            <p className="text-sm text-white leading-relaxed">{sendersReason}</p>
          </div>
        )}

        {fetchError && (
          <div className="rounded border border-red-500 bg-red-900/60 p-4 text-sm text-red-100">
            {fetchError}
          </div>
        )}
        <LeadsTable
          leads={sortedLeads}
          pagination={pagination}
          totalCount={sortedLeads.length}
          totalLabel="loaded"
          from={0}
          to={Math.max(0, sortedLeads.length - 1)}
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      </div>
    </div>
  );
}
