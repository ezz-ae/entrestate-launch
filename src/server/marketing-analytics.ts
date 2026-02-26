import { DEFAULT_MARKETING_METRICS, type MarketingMetricsSnapshot } from '@/data/marketing-metrics';
type Totals = MarketingMetricsSnapshot['totals'];

export async function updateMarketingTotals(
  _db: unknown,
  tenantId: string,
  mutate: (totals: Totals) => Totals | void,
) {
  void tenantId;
  mutate({ ...DEFAULT_MARKETING_METRICS.totals });
}
