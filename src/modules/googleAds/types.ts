export type OccalizerMode = 'TOP' | 'FAIR' | 'RISKY';

export type CplRange = {
  low: number;
  high: number;
};

export type BudgetCaps = {
  daily: number;
  total: number;
};

export type StrategicBlueprint = {
  id: string;
  tenantId: string;
  siteId?: string | null;
  summary: string;
  checklist: string[];
  trackingPlan: string[];
  inputs: {
    targetLocation: string;
    audience: string;
    goal: string;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type RefinerResult = {
  score: number;
  blockingErrors: string[];
  warnings: string[];
  recommendedFixes: string[];
  checks: Record<string, { passed: boolean; message: string }>;
  evaluatedAt: string;
};

export type OccalizerResult = {
  mode: OccalizerMode;
  keywordStrategy: string;
  biddingAggressiveness: number;
  expectedCplRange: CplRange;
  safetyConstraints: string[];
};

export type DecisionZipperInput = {
  siteIntent: string;
  blueprint: StrategicBlueprint;
  occalizer: OccalizerResult;
  budgetCaps: BudgetCaps;
};

export type CampaignPlan = {
  name: string;
  keywords: string[];
  biddingAggressiveness: number;
  expectedCplRange: CplRange;
  notes: string[];
};

export type DecisionZipperOutput = {
  plan: CampaignPlan;
  reasoning: string[];
};

export type CampaignStatus = 'draft' | 'approved' | 'deploying' | 'active' | 'paused' | 'completed';

export type AdsCampaign = {
  id: string;
  tenantId: string;
  clientId?: string | null;
  blueprintId: string;
  status: CampaignStatus;
  occalizerMode: OccalizerMode;
  budgetCaps: BudgetCaps;
  plan: CampaignPlan;
  refiner?: RefinerResult | null;
  createdAt: string;
  updatedAt: string;
};

export type AdsDeploymentStatus = 'queued' | 'syncing' | 'succeeded' | 'failed';

export type AdsDeployment = {
  id: string;
  campaignId: string;
  status: AdsDeploymentStatus;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ReportTile = {
  label: string;
  value: number;
  trend?: number | null;
};

export type AdsReport = {
  campaignId: string;
  from: string;
  to: string;
  tiles: {
    ads: ReportTile[];
    leads: ReportTile[];
    sender: ReportTile[];
  };
};

export type PerformanceMetrics = {
  spend: number;
  leads: number;
  cpl: number;
  conversionRate?: number;
  landingPageScore?: number;
};

export type ScenarioType =
  | 'EXCEEDING_EXPECTATIONS'
  | 'ON_TRACK'
  | 'UNDERPERFORMING'
  | 'AT_RISK'
  | 'STOP_LOSS';

export type ScenarioAction = {
  type: 'scale_budget' | 'maintain' | 'narrow_keywords' | 'increase_pressure' | 'trigger_refiner' | 'pause';
  payload?: Record<string, unknown>;
};

export type ScenarioOutcome = {
  scenario: ScenarioType;
  actions: ScenarioAction[];
  evaluatedAt: string;
};

export type ScenarioThresholdConfig = {
  targetCpl: number;
  exceedingCplDelta: number;
  onTrackCplDelta: number;
  underperformingCplDelta: number;
  atRiskCplDelta: number;
  stopLossCplMultiplier: number;
  minLeads: number;
  minSpend: number;
};

export type LearningSignal = {
  id: string;
  tenantId: string;
  campaignId: string;
  cpl: number;
  conversionRate?: number | null;
  landingPageScore?: number | null;
  occalizerMode: OccalizerMode;
  scenario?: ScenarioType | null;
  recordedAt: string;
};
