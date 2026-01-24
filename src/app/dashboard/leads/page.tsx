import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logError } from '@/lib/server/log';
import { Button } from '@/components/ui/button';
import { AudienceGenerator } from '@/components/audience-generator';
import { CampaignTriggers } from '@/components/campaign-triggers';
import { ConnectCrmButton } from '@/components/connect-crm-button';
import { SyncCrmButton } from '@/components/sync-crm-button';
import { LeadsSearch } from '@/components/leads-search';
import { Pagination } from '@/components/pagination';
import { ExportLeadsButton } from '@/components/export-leads-button';
import { LeadsTable } from '@/components/leads-table';

export default async function LeadsPipelinePage({ searchParams }: any) {
  const scope = 'dashboard/leads';
  let leads: any[] = [];
  let totalLeads = 0;
  let hasNextPage = false;
  let fetchError: string | null = null;
  type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
  let supabase: SupabaseClient | undefined;
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  const sortColumn = searchParams?.sort || 'created_at';
  const sortOrder = searchParams?.order || 'desc';
  const pageSize = 10; // Number of leads per page
  
  // Auth check bypassed for testing as requested previously
  // const { data: { user } } = await supabase.auth.getUser();

  // Fetch leads with project details
  // Note: This assumes a foreign key relationship exists between leads.project_id and projects.id
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
    leads = data || [];
    totalLeads = count || 0;
    hasNextPage = to < totalLeads - 1;
  } catch (error) {
    logError(scope, error, { query, currentPage, sortColumn, sortOrder });
    fetchError = 'Unable to load leads right now; check the Vercel logs for details.';
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Leads Execution Pipe</h1>
            <p className="text-zinc-400 mt-1">Orchestrate your lead data, campaigns, and audiences.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <LeadsSearch />
             <ConnectCrmButton />
             <ExportLeadsButton query={query} />
          </div>
        </div>

        {/* Action Cards (The "Pipe" aspect) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Audience Card */}
           <AudienceGenerator />

           {/* Campaigns Card */}
           <CampaignTriggers />

           {/* Data Pool Card */}
           <SyncCrmButton />
        </div>

        {/* Leads List */}
        {fetchError && (
          <div className="rounded border border-red-500 bg-red-900/60 p-4 text-sm text-red-100">
            {fetchError}
          </div>
        )}
        <LeadsTable
          leads={leads}
          pagination={<Pagination currentPage={currentPage} hasNextPage={hasNextPage} />}
          totalCount={totalLeads}
          from={from}
          to={to}
          currentSort={sortColumn}
          currentOrder={sortOrder}
        />
      </div>
    </div>
  )
}
