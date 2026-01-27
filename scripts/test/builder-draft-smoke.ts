import assert from 'node:assert/strict';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
const AUTH_TOKEN =
  process.env.BUILDER_DRAFT_SMOKE_TOKEN || process.env.NEXT_PUBLIC_BUILDER_DRAFT_SMOKE_TOKEN;

async function run() {
  if (!AUTH_TOKEN) {
    console.warn(
      'SKIP: builder draft smoke test requires BUILDER_DRAFT_SMOKE_TOKEN to be set for authentication.'
    );
    return;
  }

  const response = await fetch(`${APP_URL}/api/projects/create-draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify({ title: 'Smoke Draft' }),
  });

  assert(response.ok, `/api/projects/create-draft returned ${response.status}`);
  const payload = await response.json().catch(() => null);
  assert(
    payload?.ok,
    `Draft API responded with error: ${payload?.error || payload?.message || 'unknown'}`
  );
  const draftId = payload?.data?.draft?.id || payload?.draft?.id;
  assert(draftId, 'Draft API did not provide an ID.');
  console.log(`PASS: Draft created (${draftId}).`);
}

run().catch((error) => {
  console.error('FAIL: builder draft smoke failed:', error);
  process.exit(1);
});
