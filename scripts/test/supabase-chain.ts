import assert from 'node:assert/strict';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function run() {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from('projects')
    .select('*')
    .ilike('headline', '%demo%')
    .order('id')
    .range(0, 9)
    .limit(10);

  assert.strictEqual(result.error, null, 'Supabase chain should not produce an error.');
  assert.ok(Array.isArray(result.data), 'Supabase chain should return an array of rows.');
  console.log('Supabase chain test passed.');
}

run().catch((error) => {
  console.error('[supabase-chain]', error);
  process.exit(1);
});
