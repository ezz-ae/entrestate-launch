import type { CplRange, OccalizerMode, OccalizerResult } from './types';

const OCCALIZER_PRESETS: Record<OccalizerMode, { strategy: string; aggressiveness: number; cpl: CplRange; constraints: string[] }> = {
  TOP: {
    strategy: 'Exact-match, high-intent keyword focus',
    aggressiveness: 0.7,
    cpl: { low: 85, high: 140 },
    constraints: ['limit_broad_match', 'cap_keyword_radius', 'focus_on_intent'],
  },
  FAIR: {
    strategy: 'Balanced intent with controlled expansion',
    aggressiveness: 1.0,
    cpl: { low: 70, high: 175 },
    constraints: ['allow_phrase_match', 'monitor_search_terms'],
  },
  RISKY: {
    strategy: 'Market pressure with broad reach',
    aggressiveness: 1.35,
    cpl: { low: 55, high: 240 },
    constraints: ['expand_keyword_radius', 'accept_cpl_variance'],
  },
};

export function evaluateOccalizer(mode: OccalizerMode): OccalizerResult {
  const preset = OCCALIZER_PRESETS[mode];
  return {
    mode,
    keywordStrategy: preset.strategy,
    biddingAggressiveness: preset.aggressiveness,
    expectedCplRange: preset.cpl,
    safetyConstraints: preset.constraints,
  };
}
