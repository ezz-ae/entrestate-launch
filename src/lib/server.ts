import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type OrderOptions = {
  ascending?: boolean;
  direction?: 'asc' | 'desc';
};

type MockTableState = {
  _selected: string;
  _filters: Array<{ type: string; args: any[] }>;
  _order: { col: string; direction: 'asc' | 'desc' } | null;
  _range: { from: number; to: number } | null;
  _limit: number | undefined;
  _mutation: 'insert' | 'update' | 'delete' | null;
};

let hasLoggedMockSupabase = false;

function logMockSupabase(shouldLog: boolean) {
  if (shouldLog && !hasLoggedMockSupabase) {
    console.warn(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL or publishable key missing/invalid — falling back to a mock supabase client.'
    );
    hasLoggedMockSupabase = true;
  }
}

function createMockSupabaseClient(options: { shouldLog?: boolean } = {}) {
  logMockSupabase(Boolean(options.shouldLog));

  const fixtures: Record<string, any[]> = {
    projects: [
      {
        id: 'dev-project-1',
        headline: 'Demo Project — Sky Residences',
        description: 'A beautiful modern condominium with sea views and great amenities.',
        features: ['Pool', 'Gym', 'Sauna'],
        settings: {
          brand_color: '#2563eb',
          brand_name: 'DemoCo',
          whatsapp_number: '15551234567',
          chat_agent_enabled: true,
        },
        created_at: new Date().toISOString(),
      },
      {
        id: 'dev-project-2',
        headline: 'Demo Project — Oak Villas',
        description: 'Family homes in a quiet suburban neighborhood.',
        features: [],
        settings: {
          brand_name: 'Oak Homes',
        },
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    leads: [],
  };

  function makeTable(tableName?: string) {
    const state: MockTableState = {
      _selected: '*',
      _filters: [],
      _order: null,
      _range: null,
      _limit: undefined,
      _mutation: null,
    };

    const chain: any = {
      select: (...args: any[]) => {
        state._selected = args.length ? args[0] : '*';
        return chain;
      },
      range: (from: number, to: number) => {
        state._range = { from, to };
        return chain;
      },
      order: (col: string, opts?: OrderOptions) => {
        const direction =
          opts?.direction ??
          (opts?.ascending === false ? 'desc' : 'asc');
        state._order = { col, direction };
        return chain;
      },
      eq: (...args: any[]) => {
        state._filters.push({ type: 'eq', args });
        return chain;
      },
      ilike: (...args: any[]) => {
        state._filters.push({ type: 'ilike', args });
        return chain;
      },
      in: (...args: any[]) => {
        state._filters.push({ type: 'in', args });
        return chain;
      },
      or: (...args: any[]) => {
        state._filters.push({ type: 'or', args });
        return chain;
      },
      limit: (...args: any[]) => {
        state._limit = args[0];
        return chain;
      },
      insert: (..._args: any[]) => {
        state._mutation = 'insert';
        return chain;
      },
      update: (..._args: any[]) => {
        state._mutation = 'update';
        return chain;
      },
      delete: (..._args: any[]) => {
        state._mutation = 'delete';
        return chain;
      },
      single: async () => {
        const { data } = executeQuery();
        return { data: data.length > 0 ? data[0] : null, error: null };
      },
      maybeSingle: async () => {
        const { data } = executeQuery();
        return { data: data.length > 0 ? data[0] : null, error: null };
      },
      rpc: async () => ({ data: null, error: null }),
      execute: async () => resolveResult(),
    };

    function executeQuery() {
      let rows = (fixtures[tableName || ''] || []).slice();
      rows = applyFilters(rows, state._filters);

      if (state._order && state._order.col) {
        const { col, direction } = state._order;
        const asc = direction !== 'desc';
        rows = rows.sort((a: any, b: any) => {
          const A = a[col];
          const B = b[col];
          if (A === B) return 0;
          if (A == null) return 1;
          if (B == null) return -1;
          return asc ? (A > B ? 1 : -1) : (A > B ? -1 : 1);
        });
      }

      if (state._range) {
        const start = Math.max(0, state._range.from || 0);
        const end = Math.max(start, state._range.to ?? start);
        rows = rows.slice(start, end + 1);
      }

      if (state._limit !== undefined) {
        rows = rows.slice(0, state._limit);
      }

      return { data: rows, error: null };
    }

    function resolveResult() {
      if (state._mutation) {
        return { data: null, error: null };
      }
      return executeQuery();
    }

    (chain as any).then = function (onFulfilled: any, onRejected: any) {
      const promise = Promise.resolve(resolveResult());
      return promise.then(onFulfilled, onRejected);
    };

    (chain as any).catch = function (onRejected: any) {
      const promise = Promise.resolve(resolveResult());
      return promise.catch(onRejected);
    };

    return chain;
  }

  function applyFilters(rows: any[], filters: Array<{ type: string; args: any[] }>) {
    let result = rows;
    for (const filter of filters || []) {
      if (filter.type === 'eq') {
        const [col, val] = filter.args;
        result = result.filter((row) => row[col] === val);
      }
      if (filter.type === 'ilike') {
        const [col, val] = filter.args;
        const needle = String(val || '').replace(/%/g, '').toLowerCase();
        result = result.filter((row) => String(row[col] || '').toLowerCase().includes(needle));
      }
      if (filter.type === 'in') {
        const [col, val] = filter.args;
        const values = Array.isArray(val) ? val : [val];
        result = result.filter((row) => values.includes(row[col]));
      }
      if (filter.type === 'or') {
        // no-op; keep all rows for mock data
      }
    }
    return result;
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (tableName: string) => makeTable(tableName),
    rpc: async () => ({ data: null, error: null }),
  } as any;
}

export async function createSupabaseServerClient() {
  let cookieStore: any;
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = {
      getAll: () => [],
      set: () => {},
    };
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_KEY;

  let urlValid = false;
  try {
    if (SUPABASE_URL) new URL(SUPABASE_URL);
    urlValid = Boolean(SUPABASE_URL && SUPABASE_KEY);
  } catch (error) {
    urlValid = false;
  }

  if (!urlValid) {
    return createMockSupabaseClient({ shouldLog: process.env.NODE_ENV !== 'production' });
  }

  return createServerClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
    cookies: {
      getAll() {
        if (typeof cookieStore.getAll === 'function') {
          return cookieStore.getAll();
        }
        return [];
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

export { createMockSupabaseClient };
