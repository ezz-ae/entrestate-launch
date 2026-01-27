import { envBool } from '@/lib/env';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
const AUTH_TOKEN = process.env.SMOKE_TEST_TOKEN?.trim();

async function fetchJson(path: string, init: RequestInit = {}) {
  const url = `${APP_URL}${path}`;
  const res = await fetch(url, { cache: 'no-store', ...init });
  const payload = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, payload };
}

function summarize(checks: string[]) {
  if (!checks.length) {
    console.log('PASS: postrelease health checks passed.');
    return;
  }
  console.error('FAIL: postrelease health checks failed:');
  checks.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

async function run() {
  const failures: string[] = [];

  console.log(`Checking ${APP_URL}/api/health/env and /api/health/runtime...`);

  const envResult = await fetchJson('/api/health/env');
  if (!envResult.ok) {
    failures.push(`/api/health/env returned status ${envResult.status}`);
  }

  const runtimeResult = await fetchJson('/api/health/runtime');
  const runtimeAvailable = runtimeResult.payload !== null;
  if (!runtimeResult.ok && runtimeResult.status !== 404) {
    failures.push(`/api/health/runtime returned status ${runtimeResult.status}`);
  }

  const envPayload = envResult.payload;
  const runtimePayload = runtimeResult.payload;
  const publicFlags = envPayload?.flags;
  const hasPublicFlag =
    typeof publicFlags?.publicFirebaseAuthEnabled === 'boolean';
  const enableFirebaseAuth = hasPublicFlag
    ? publicFlags!.publicFirebaseAuthEnabled
    : envBool('NEXT_PUBLIC_ENABLE_FIREBASE_AUTH', false);

  if (runtimeAvailable && runtimePayload) {
    const runtimeFlags = runtimePayload.flags || {};
    if (enableFirebaseAuth) {
      if (!runtimeFlags.hasFirebasePublicConfigReady) {
        failures.push('Firebase auth is enabled but runtime health reports public config not ready.');
      }
      if (!runtimeFlags.firebaseAuthEnabledPublic) {
        failures.push('Firebase auth is enabled but runtime health reports firebaseAuthEnabledPublic=false.');
      }
    } else if (runtimeFlags.firebaseAuthEnabledPublic) {
      failures.push('Firebase auth is disabled but runtime health reports firebaseAuthEnabledPublic=true.');
    }
  }

  if (envPayload?.flags) {
    const { publicFirebaseAuthEnabled, firebasePublicConfigReady } = envPayload.flags;
    if (publicFirebaseAuthEnabled && !firebasePublicConfigReady) {
      failures.push('Env health reports firebasePublicConfigReady=false while auth is enabled.');
    }
    if (!publicFirebaseAuthEnabled && enableFirebaseAuth) {
      failures.push('Env health reports publicFirebaseAuthEnabled=false while env expect true.');
    }
  }

  if (!AUTH_TOKEN) {
    failures.push('SMOKE_TEST_TOKEN is required to test inventory and leads endpoints.');
    summarize(failures);
    return;
  }

  console.log('Checking inventory and leads pagination endpoints...');
  const authHeaders = { Authorization: `Bearer ${AUTH_TOKEN}` };

  const inventoryResult = await fetchJson('/api/inventory?limit=12', { headers: authHeaders });
  if (!inventoryResult.ok || !inventoryResult.payload?.ok) {
    failures.push(`/api/inventory returned ${inventoryResult.status}`);
  } else {
    const items = inventoryResult.payload?.data?.items || [];
    if (!Array.isArray(items) || items.length > 12) {
      failures.push('/api/inventory did not enforce limit=12');
    }
  }

  const leadsResult = await fetchJson('/api/leads/list?limit=12', { headers: authHeaders });
  if (!leadsResult.ok || !leadsResult.payload?.ok) {
    failures.push(`/api/leads/list returned ${leadsResult.status}`);
  } else {
    const items = leadsResult.payload?.data?.items || [];
    if (!Array.isArray(items) || items.length > 12) {
      failures.push('/api/leads/list did not enforce limit=12');
    }
  }

  summarize(failures);
}

run().catch((error) => {
  console.error('FAIL: postrelease health checks threw an unexpected error:', error);
  process.exit(1);
});
