import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  // cookies() can have differing types across Next.js versions (sync or Promise).
  // Cast to any to keep this helper compatible across versions used in CI/Dev.
  const cookieStore: any = cookies();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If supabase config is missing or invalid, and we're in dev, return a lightweight
  // mock client so server-side rendering doesn't crash. In production we keep failing
  // loudly to avoid hiding config issues.
  const enableDev = process.env.DEV_FIREBASE_AUTH === 'true' || process.env.NODE_ENV !== 'production';

  let urlValid = false;
  try {
    if (SUPABASE_URL) new URL(SUPABASE_URL);
    urlValid = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  } catch (e) {
    urlValid = false;
  }

  if (!urlValid) {
    if (!enableDev) {
      throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.');
    }
    // Dev fallback: provide a mock supabase client with the minimal surface used
    // across the app to avoid runtime crashes during local dev when envs are not set.
    console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL or ANON_KEY missing or invalid — using mock supabase client in dev');

    const fixtures: Record<string, any[]> = {
      projects: [
        {
          id: 'dev-project-1',
          headline: 'Demo Project — Sky Residences',
          description: 'A beautiful modern condominium with sea views and great amenities.',
          features: ['Pool', 'Gym', 'Sauna'],
          settings: { brand_color: '#2563eb', brand_name: 'DemoCo', whatsapp_number: '15551234567', chat_agent_enabled: true },
          created_at: new Date().toISOString(),
        },
        {
          id: 'dev-project-2',
          headline: 'Demo Project — Oak Villas',
          description: 'Family homes in a quiet suburban neighborhood.',
          features: [],
          settings: { brand_name: 'Oak Homes' },
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      leads: [],
    };

    const makeTable = (tableName?: string) => {
      // Chainable builder that mimics supabase-js behaviour: methods are chainable
      // and the final awaited result resolves to an object { data, error }.
      const state: any = { _selected: '*', _filters: [], _order: null, _limit: undefined };
      const chain: any = {
        select: (..._args: any[]) => {
          state._selected = _args && _args.length ? _args[0] : '*';
          return chain;
        },
        order: (col: string, opts?: any) => {
          state._order = { col, opts };
          return chain;
        },
        eq: (..._args: any[]) => {
          state._filters.push({ type: 'eq', args: _args });
          return chain;
        },
        limit: (..._args: any[]) => {
          state._limit = _args[0];
          return chain;
        },
        insert: (..._args: any[]) => ({ data: null, error: null }),
        update: (..._args: any[]) => ({ data: null, error: null }),
        delete: (..._args: any[]) => ({ data: null, error: null }),
        single: async () => {
          // apply filters and return a single item
          const rows = (fixtures[tableName || ''] || []).slice();
          const matched = applyFilters(rows, state._filters);
          return { data: matched.length > 0 ? matched[0] : null, error: null };
        },
        rpc: async () => ({ data: null, error: null }),
      };

      // Make chain thenable so `await chain` works.
      (chain as any).then = function (onFulfilled: any, onRejected: any) {
        // compute result based on current state
        const rows = (fixtures[tableName || ''] || []).slice();
        let result = applyFilters(rows, state._filters);
        if (state._order && state._order.col) {
          const col = state._order.col;
          const asc = !(state._order.opts && state._order.opts.ascending === false);
          result = result.sort((a: any, b: any) => {
            const A = a[col];
            const B = b[col];
            if (A === B) return 0;
            if (A == null) return 1;
            if (B == null) return -1;
            return asc ? (A > B ? -1 : 1) : (A > B ? 1 : -1);
          });
        }
        if (state._limit !== undefined) {
          result = result.slice(0, state._limit);
        }
        const promise = Promise.resolve({ data: result, error: null });
        return promise.then(onFulfilled, onRejected);
      };

      // Also support catching
      (chain as any).catch = function (onRejected: any) {
        const promise = Promise.resolve({ data: [], error: null });
        return promise.catch(onRejected);
      };

      return chain;
    };

    // helper to apply simple filters (only eq supported for dev mocks)
    function applyFilters(rows: any[], filters: any[]) {
      let out = rows;
      for (const f of filters || []) {
        if (f.type === 'eq') {
          const [col, val] = f.args;
          out = out.filter((r) => {
            // support nested JSON access if needed in the future
            return r[col] === val;
          });
        }
      }
      return out;
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: null } }),
      },
      from: (tableName: string) => makeTable(tableName),
      // minimal helpers that some callers may use
      rpc: async () => ({ data: null, error: null }),
    } as any;
  }

  return createServerClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
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