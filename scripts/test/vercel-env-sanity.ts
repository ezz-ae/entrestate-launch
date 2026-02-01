import { createSupabaseServerClient } from '../../src/lib/supabase/server';

export async function checkEnv() {
  console.log('Starting Vercel env sanity check...');

  const supabase = await createSupabaseServerClient();
  
  // Fix: Check if the 'from' method exists on the client instance
  // @ts-ignore - supabase type might be complex, but we need to check the method
  const isReady = !!supabase && typeof (supabase as any).from === 'function';
  console.log('Supabase server client type:', isReady ? 'ready' : 'missing from()');

  if (!isReady) {
    throw new Error('Supabase client initialization failed: from() method missing');
  }

  console.log('Vercel env sanity check passed.');
}