import assert from 'node:assert/strict';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';

async function run() {
  const res = await fetch(`${APP_URL}/api/agent/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello, can you share a recent Dubai project update?' }),
  });
  assert(res.ok, 'Preview chat endpoint did not return HTTP 200.');
  const payload = await res.json();
  assert(
    payload?.ok,
    `Agent demo responded with error: ${payload?.message || payload?.error || 'unknown'}`
  );
  const reply = payload?.data?.reply;
  assert(typeof reply === 'string' && reply.trim().length > 0, 'Assistant reply was empty.');
  console.log(`PASS: Received reply (${reply.slice(0, 64)}...)`);
}

run().catch((error) => {
  console.error('FAIL: chatagent-smoke failed:', error);
  process.exit(1);
});
