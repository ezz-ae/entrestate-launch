import assert from 'node:assert/strict';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
const AUTH_TOKEN = process.env.SMOKE_TEST_TOKEN?.trim();

async function fetchPage(cursor?: string) {
  const url = new URL(`${APP_URL}/api/inventory`);
  url.searchParams.set('limit', '12');
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }
  const res = await fetch(url.toString(), {
    cache: 'no-store',
    headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : undefined,
  });
  const payload = await res.json().catch(() => null);
  return { ok: res.ok, payload };
}

async function run() {
  if (!AUTH_TOKEN) {
    console.warn(
      'SKIP: inventory pagination smoke test requires SMOKE_TEST_TOKEN to be set.'
    );
    return;
  }

  const first = await fetchPage();
  assert(first.ok, '/api/inventory (page 1) did not respond with 200');
  const firstItems = Array.isArray(first.payload?.data?.items)
    ? first.payload.data.items
    : [];
  const firstCursor =
    typeof first.payload?.data?.nextCursor === 'string'
      ? first.payload.data.nextCursor
      : null;
  assert(firstItems.length > 0, 'First page returned no inventory rows.');
  assert(firstCursor, 'First response did not provide nextCursor.');

  const second = await fetchPage(firstCursor ?? undefined);
  assert(second.ok, '/api/inventory (page 2) did not respond with 200');
  const secondItems = Array.isArray(second.payload?.data?.items)
    ? second.payload.data.items
    : [];
  const secondCursor =
    typeof second.payload?.data?.nextCursor === 'string'
      ? second.payload.data.nextCursor
      : null;
  assert(secondItems.length > 0, 'Second page returned no inventory rows.');
  assert.notStrictEqual(
    firstCursor,
    secondCursor,
    'Pagination cursor did not advance between page 1 and page 2.'
  );

  console.log(
    `PASS: inventory pagination returned ${firstItems.length} + ${secondItems.length} items with cursor ${firstCursor} -> ${secondCursor}`
  );
}

run().catch((error) => {
  console.error('FAIL: inventory pagination smoke failed', error);
  process.exit(1);
});
