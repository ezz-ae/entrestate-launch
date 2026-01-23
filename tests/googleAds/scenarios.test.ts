import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScenario, DEFAULT_SCENARIO_THRESHOLDS } from '@/modules/googleAds/scenarios';

test('evaluateScenario returns stop-loss when cpl is too high', () => {
  const outcome = evaluateScenario(
    { spend: 500, leads: 0, cpl: DEFAULT_SCENARIO_THRESHOLDS.targetCpl * 2 },
    DEFAULT_SCENARIO_THRESHOLDS,
  );
  assert.equal(outcome.scenario, 'STOP_LOSS');
  assert.ok(outcome.actions.length > 0);
});
