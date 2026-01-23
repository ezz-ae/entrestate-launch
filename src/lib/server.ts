import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { FIREBASE_AUTH_ENABLED } from '@/lib/server/env';

export async function createSupabaseServerClient() {
  // cookies() can have differing types across Next.js versions (sync or Promise).
  // Await to normalize the result in both cases.
  const cookieStore: any = await cookies();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_KEY;

  // If supabase config is missing or invalid, and we're in dev, return a lightweight
  // mock client so server-side rendering doesn't crash. In production we keep failing
  // loudly to avoid hiding config issues.
  const enableDev = !FIREBASE_AUTH_ENABLED || process.env.NODE_ENV !== 'production';

  let urlValid = false;
  try {
    if (SUPABASE_URL) new URL(SUPABASE_URL);
    urlValid = Boolean(SUPABASE_URL && SUPABASE_KEY);
  } catch (e) {
    urlValid = false;
  }

  if (!urlValid) {
    if (!enableDev) {
      throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.');
    }
    // Dev fallback: provide a mock supabase client with the minimal surface used
    // across the app to avoid runtime crashes during local dev when envs are not set.
    console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL or publishable key missing/invalid — using mock supabase client in dev');

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
      const state: any = {
        _selected: '*',
        _filters: [],
        _order: null,
        _limit: undefined,
        _range: null,
        _mutation: null,
      };

      const chain: any = {
        select: (..._args: any[]) => {
          state._selected = _args && _args.length ? _args[0] : '*';
          return chain;
        },
        range: (from: number, to: number) => {
          state._range = { from, to };
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
        ilike: (..._args: any[]) => {
          state._filters.push({ type: 'ilike', args: _args });
          return chain;
        },
        in: (..._args: any[]) => {
          state._filters.push({ type: 'in', args: _args });
          return chain;
        },
        or: (..._args: any[]) => {
          state._filters.push({ type: 'or', args: _args });
          return chain;
        },
        limit: (..._args: any[]) => {
          state._limit = _args[0];
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
            return asc ? (A > B ? 1 : -1) : (A > B ? -1 : 1);
          });
        }
        if (state._range) {
          const start = Math.max(0, state._range.from || 0);
          const end = Math.max(start, state._range.to ?? start);
          result = result.slice(start, end + 1);
        }
        if (state._limit !== undefined) {
          result = result.slice(0, state._limit);
        }
        return { data: result, error: null };
      }

      function resolveResult() {
        if (state._mutation) {
          return { data: null, error: null };
        }
        return executeQuery();
      }

      // Make chain thenable so `await chain` works.
      (chain as any).then = function (onFulfilled: any, onRejected: any) {
        const promise = Promise.resolve(resolveResult());
        return promise.then(onFulfilled, onRejected);
      };

      (chain as any).catch = function (onRejected: any) {
        const promise = Promise.resolve(resolveResult());
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
          out = out.filter((r) => r[col] === val);
        }
        if (f.type === 'ilike') {
          const [col, val] = f.args;
          const needle = String(val || '').replace(/%/g, '').toLowerCase();
          out = out.filter((r) => String(r[col] || '').toLowerCase().includes(needle));
        }
        if (f.type === 'in') {
          const [col, val] = f.args;
          const values = Array.isArray(val) ? val : [val];
          out = out.filter((r) => values.includes(r[col]));
        }
        if (f.type === 'or') {
          // no-op for dev mock; keep results unfiltered
        }
      }
      return out;
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: (tableName: string) => makeTable(tableName),
      // minimal helpers that some callers may use
      rpc: async () => ({ data: null, error: null }),
    } as any;
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
