import { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logError } from '@/lib/server/log';
import LeadsClient from './LeadsClient';
import type { LeadRecord } from './types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LeadsPageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function LeadsPipelinePage({ searchParams }: LeadsPageProps) {
  const scope = 'dashboard/leads';
  let leads: LeadRecord[] = [];
  let totalLeads = 0;
  let hasNextPage = false;
  let fetchError: string | null = null;
  type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
  let supabase: SupabaseClient | undefined;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const sortColumn = resolvedSearchParams?.sort ?? 'created_at';
  const sortOrder = resolvedSearchParams?.order ?? 'desc';
  const pageSize = 10; // Number of leads per page

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    supabase = await createSupabaseServerClient();
    let leadsQuery = supabase
      .from('leads')
      .select('*, projects(headline)', { count: 'exact' })
      .range(from, to)
      .order(sortColumn, { ascending: sortOrder === 'asc' });

    if (query) {
      leadsQuery = leadsQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    const { data, count } = await leadsQuery;
    leads = (data ?? []) as LeadRecord[];
    totalLeads = count ?? 0;
    hasNextPage = to < totalLeads - 1;
  } catch (error) {
    logError(scope, error, { query, currentPage, sortColumn, sortOrder });
    fetchError = 'Unable to load leads right now; check the Vercel logs for details.';
  }

  return (
    <Suspense fallback={<LeadsLoading />}>
      <LeadsClient
        leads={leads}
        totalLeads={totalLeads}
        hasNextPage={hasNextPage}
        from={from}
        to={to}
        currentSort={sortColumn}
        currentOrder={sortOrder}
        currentPage={currentPage}
        query={query}
        fetchError={fetchError}
      />
    </Suspense>
  );
}

function LeadsLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 rounded-full bg-zinc-900" />
            <div className="h-4 w-64 mt-2 rounded-full bg-zinc-900" />
          </div>
          <div className="h-10 w-40 rounded-full bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 rounded-2xl bg-zinc-900" />
          <div className="h-24 rounded-2xl bg-zinc-900" />
          <div className="h-24 rounded-2xl bg-zinc-900" />
        </div>
        <div className="space-y-3">
          <div className="h-64 rounded-2xl bg-zinc-900" />
          <div className="h-64 rounded-2xl bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
