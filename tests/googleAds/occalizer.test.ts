import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateOccalizer } from '@/modules/googleAds/occalizer';

test('evaluateOccalizer returns expected mode', () => {
  const result = evaluateOccalizer('TOP');
  assert.equal(result.mode, 'TOP');
  assert.ok(result.biddingAggressiveness > 0);
  assert.ok(result.expectedCplRange.low < result.expectedCplRange.high);
});
