import assert from 'node:assert/strict';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
const AUTH_TOKEN = process.env.LEADS_SMOKE_TOKEN || process.env.SMOKE_TEST_TOKEN;

async function run() {
  assert(AUTH_TOKEN, 'LEADS_SMOKE_TOKEN (or SMOKE_TEST_TOKEN) is required.');

  const unique = `lead-${Date.now()}@example.com`;
  const createRes = await fetch(`${APP_URL}/api/leads/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      name: 'Smoke Lead',
      email: unique,
      phone: '+15551234567',
      message: 'Smoke test lead capture.',
    }),
  });
  const createPayload = await createRes.json().catch(() => null);
  assert(createRes.ok, `/api/leads/create returned ${createRes.status}`);
  assert(createPayload?.ok, `Lead create failed: ${createPayload?.error || 'unknown'}`);

  const listRes = await fetch(`${APP_URL}/api/leads/list?limit=12`, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  const listPayload = await listRes.json().catch(() => null);
  assert(listRes.ok, `/api/leads/list returned ${listRes.status}`);
  assert(listPayload?.ok, `Lead list failed: ${listPayload?.error || 'unknown'}`);

  const items = listPayload?.data?.items || [];
  assert(Array.isArray(items), 'Lead list did not return items array.');

  console.log('PASS: Lead create + list integration test completed.');
}

run().catch((error) => {
  console.error('FAIL: leads-loop failed', error);
  process.exit(1);
});
