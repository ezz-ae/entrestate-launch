import type { PerformanceMetrics, ScenarioAction, ScenarioOutcome, ScenarioThresholdConfig } from './types';

export const DEFAULT_SCENARIO_THRESHOLDS: ScenarioThresholdConfig = {
  targetCpl: 120,
  exceedingCplDelta: 0.15,
  onTrackCplDelta: 0.2,
  underperformingCplDelta: 0.35,
  atRiskCplDelta: 0.6,
  stopLossCplMultiplier: 1.9,
  minLeads: 4,
  minSpend: 250,
};

export function evaluateScenario(
  metrics: PerformanceMetrics,
  config: ScenarioThresholdConfig = DEFAULT_SCENARIO_THRESHOLDS,
): ScenarioOutcome {
  const now = new Date().toISOString();
  const cpl = metrics.cpl || 0;
  const leads = metrics.leads || 0;
  const spend = metrics.spend || 0;

  if (spend >= config.minSpend && (leads === 0 || cpl >= config.targetCpl * config.stopLossCplMultiplier)) {
    return {
      scenario: 'STOP_LOSS',
      actions: [{ type: 'pause' }],
      evaluatedAt: now,
    };
  }

  if (cpl <= config.targetCpl * (1 - config.exceedingCplDelta) && leads >= config.minLeads) {
    return {
      scenario: 'EXCEEDING_EXPECTATIONS',
      actions: [
        { type: 'scale_budget', payload: { multiplier: 1.1 } },
        { type: 'increase_pressure', payload: { radius: 'expand' } },
      ],
      evaluatedAt: now,
    };
  }

  if (cpl <= config.targetCpl * (1 + config.onTrackCplDelta) && leads >= config.minLeads) {
    return {
      scenario: 'ON_TRACK',
      actions: [{ type: 'maintain' }],
      evaluatedAt: now,
    };
  }

  if (cpl >= config.targetCpl * (1 + config.atRiskCplDelta)) {
    return {
      scenario: 'AT_RISK',
      actions: [
        { type: 'narrow_keywords', payload: { radius: 'tighten' } },
        { type: 'trigger_refiner' },
      ],
      evaluatedAt: now,
    };
  }

  if (cpl >= config.targetCpl * (1 + config.underperformingCplDelta) || leads < config.minLeads) {
    return {
      scenario: 'UNDERPERFORMING',
      actions: [
        { type: 'narrow_keywords', payload: { radius: 'moderate' } },
        { type: 'trigger_refiner' },
      ],
      evaluatedAt: now,
    };
  }

  return {
    scenario: 'ON_TRACK',
    actions: [{ type: 'maintain' }],
    evaluatedAt: now,
  };
}
