import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  // Await to handle Next.js versions where cookies() is async.
  const cookieStore: any = await cookies();
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          if (typeof cookieStore.getAll === 'function') {
            return cookieStore.getAll();
          }
          return [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
        } catch {
          // The `setAll` method was called from a Server Component.
          // Supabase sessions are managed elsewhere, so ignore this.
        }
        },
      },
    }
  );
}
