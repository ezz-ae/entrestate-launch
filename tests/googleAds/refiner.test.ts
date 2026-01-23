import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runRefiner } from '@/modules/googleAds/refiner';
import type { SitePage } from '@/lib/types';

test('runRefiner detects missing CTA and form', () => {
  const page: SitePage = {
    id: 'site-1',
    title: 'Test',
    blocks: [],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Test', description: 'Test', keywords: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = runRefiner(page);
  assert.ok(result.blockingErrors.length > 0);
});
