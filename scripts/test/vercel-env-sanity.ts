import { FIREBASE_AUTH_DISABLED, FIREBASE_CONFIG_READY } from '@/lib/firebase/client';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function run() {
  const flags = {
    firebaseAuthEnabled: !FIREBASE_AUTH_DISABLED,
    firebaseConfigReady: FIREBASE_CONFIG_READY,
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ),
    nodeEnvProduction: process.env.NODE_ENV === 'production',
    vercelEnv: Boolean(process.env.VERCEL),
  };

  console.log('Vercel env sanity flags:', flags);

  const supabase = await createSupabaseServerClient();
  console.log('Supabase server client type:', supabase?.from ? 'ready' : 'missing from()');

  console.log('Vercel env sanity check passed.');
}

run().catch((error) => {
  console.error('[vercel-env-sanity] Error during checks:', error);
  process.exit(1);
});
