import assert from 'node:assert/strict';

const envKeysToBackup = [
  'NEXT_PUBLIC_ENABLE_FIREBASE_AUTH',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NODE_ENV',
];

const envKeysToClear = envKeysToBackup.filter((key) => key !== 'NODE_ENV');
const backupEnv: Record<string, string | undefined> = {};
for (const key of envKeysToBackup) {
  backupEnv[key] = process.env[key];
}

async function restoreEnv() {
  for (const key of envKeysToBackup) {
    if (backupEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = backupEnv[key]!;
    }
  }
}

async function runChecks() {
  try {
    for (const key of envKeysToClear) {
      delete process.env[key];
    }

    const { FIREBASE_AUTH_DISABLED, getAuthSafe, getDbSafe } = await import('../../src/lib/firebase/client');
    assert.strictEqual(
      FIREBASE_AUTH_DISABLED,
      true,
      'Firebase auth should be flagged disabled when config is missing.'
    );
    assert.strictEqual(
      getAuthSafe(),
      null,
      'getAuthSafe should return null when auth is disabled.'
    );
    assert.strictEqual(
      getDbSafe(),
      null,
      'getDbSafe should return null when Firebase app is unavailable.'
    );

    const { createMockSupabaseClient } = await import('../../src/lib/server');
    const mock = createMockSupabaseClient({ shouldLog: true });

    const singleResult = await mock
      .from('projects')
      .select('*')
      .eq('id', 'dev-project-1')
      .ilike('headline', '%demo%')
      .in('id', ['dev-project-1'])
      .order('created_at', { ascending: false })
      .range(0, 1)
      .limit(1)
      .maybeSingle();
    assert.strictEqual(singleResult.data?.id, 'dev-project-1', 'Mock chain should respect filters.');

    const mutationResult = await mock.from('projects').insert({ test: true });
    assert.strictEqual(mutationResult.data, null);
    assert.strictEqual(mutationResult.error, null);

    await mock.from('projects').select('*').catch(() => null);
    await mock.from('projects').select('*').then(() => null);

    console.log('Env safety check passed.');
  } finally {
    await restoreEnv();
  }
}

runChecks().catch((error) => {
  console.error(error);
  process.exit(1);
});
