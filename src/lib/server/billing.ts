import { USE_NEON } from '@/lib/server/env';

export type PlanId = 'agent_pro' | 'agent_growth' | 'agency_os';
export type UsageMetric =
  | 'landing_pages'
  | 'leads'
  | 'campaigns'
  | 'ai_conversations'
  | 'seats'
  | 'email_sends'
  | 'sms_sends'
  | 'domains'
  | 'ai_agents';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled';
export type PlanFeature = 'google_ads' | 'meta_custom_audiences';

export type BillingAddOns = {
  ai_conversations?: number;
  leads?: number;
  domains?: number;
  sms_sends?: number;
  ai_agents?: number;
};

export type TrialState = {
  startedAt: string;
  endsAt: string;
  endedAt?: string | null;
  endedReason?: string | null;
  publishedLandingPage?: boolean;
  leadCaptured?: boolean;
  aiConversationCount?: number;
};

export type SubscriptionRecord = {
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  trial?: TrialState | null;
  addOns?: BillingAddOns | null;
};

export type BillingSku =
  | PlanId
  | 'addon_ai_conversations_1000'
  | 'addon_leads_500'
  | 'addon_domain_1'
  | 'addon_sms_bundle'
  | 'addon_chat_agent';

type MetricPeriod = 'monthly' | 'total';

const TRIAL_DAYS = 7;
const TRIAL_CONVERSATION_LIMIT = 25;
const DEFAULT_PLAN: PlanId = 'agent_pro';
const NEON_DEFAULT_PLAN: PlanId = 'agency_os';

const PLAN_FEATURES: Record<PlanId, Record<PlanFeature, boolean>> = {
  agent_pro: {
    google_ads: false,
    meta_custom_audiences: false,
  },
  agent_growth: {
    google_ads: true,
    meta_custom_audiences: true,
  },
  agency_os: {
    google_ads: true,
    meta_custom_audiences: true,
  },
};

export const PLAN_NAMES: Record<PlanId, string> = {
  agent_pro: 'Agent Pro',
  agent_growth: 'Agent Growth',
  agency_os: 'Agency OS',
};

export const PLAN_PRICES_AED: Record<PlanId, number> = {
  agent_pro: 299,
  agent_growth: 799,
  agency_os: 2499,
};

export const BILLING_SKUS: Record<
  BillingSku,
  {
    type: 'plan' | 'addon';
    priceAed: number;
    label: string;
    plan?: PlanId;
    addOns?: BillingAddOns;
  }
> = {
  agent_pro: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agent_pro,
    label: 'Agent Pro',
    plan: 'agent_pro',
  },
  agent_growth: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agent_growth,
    label: 'Agent Growth',
    plan: 'agent_growth',
  },
  agency_os: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agency_os,
    label: 'Agency OS',
    plan: 'agency_os',
  },
  addon_ai_conversations_1000: {
    type: 'addon',
    priceAed: 99,
    label: '+1,000 AI conversations',
    addOns: { ai_conversations: 1000 },
  },
  addon_leads_500: {
    type: 'addon',
    priceAed: 49,
    label: '+500 leads storage',
    addOns: { leads: 500 },
  },
  addon_domain_1: {
    type: 'addon',
    priceAed: 39,
    label: 'Extra domain',
    addOns: { domains: 1 },
  },
  addon_sms_bundle: {
    type: 'addon',
    priceAed: 99,
    label: 'SMS bundle',
    addOns: { sms_sends: 1000 },
  },
  addon_chat_agent: {
    type: 'addon',
    priceAed: 45,
    label: 'AI Chat Agent',
    addOns: { ai_agents: 1 },
  },
};

export const PLAN_LIMITS: Record<PlanId, Record<UsageMetric, number | null>> = {
  agent_pro: {
    ai_agents: 1,
    landing_pages: 3,
    leads: 300,
    campaigns: null,
    ai_conversations: 1000,
    seats: 1,
    email_sends: 1000,
    sms_sends: null,
    domains: 1,
  },
  agent_growth: {
    ai_agents: 3,
    landing_pages: 10,
    leads: 2000,
    campaigns: null,
    ai_conversations: 5000,
    seats: 3,
    email_sends: 5000,
    sms_sends: 1000,
    domains: 1,
  },
  agency_os: {
    ai_agents: 25,
    landing_pages: 100,
    leads: 25000,
    campaigns: null,
    ai_conversations: 50000,
    seats: 25,
    email_sends: 50000,
    sms_sends: 10000,
    domains: 10,
  },
};

const METRIC_PERIOD: Record<UsageMetric, MetricPeriod> = {
  landing_pages: 'total',
  leads: 'total',
  campaigns: 'monthly',
  ai_conversations: 'monthly',
  seats: 'total',
  email_sends: 'monthly',
  sms_sends: 'monthly',
  domains: 'total',
  ai_agents: 'total',
};

const PLAN_UPGRADE_MAP: Record<PlanId, PlanId | null> = {
  agent_pro: 'agent_growth',
  agent_growth: 'agency_os',
  agency_os: null,
};

export class PlanLimitError extends Error {
  metric: UsageMetric;
  limit: number | null;
  currentUsage: number;
  plan: PlanId;
  status: SubscriptionStatus;
  suggestedUpgrade: PlanId | null;
  constructor(options: {
    metric: UsageMetric;
    limit: number | null;
    currentUsage: number;
    plan: PlanId;
    status: SubscriptionStatus;
    suggestedUpgrade: PlanId | null;
  }) {
    super(`Plan limit reached for ${options.metric}`);
    this.name = 'PlanLimitError';
    this.metric = options.metric;
    this.limit = options.limit;
    this.currentUsage = options.currentUsage;
    this.plan = options.plan;
    this.status = options.status;
    this.suggestedUpgrade = options.suggestedUpgrade;
  }
}

export class FeatureAccessError extends Error {
  feature: PlanFeature;
  plan: PlanId;
  suggestedUpgrade: PlanId | null;
  constructor(feature: PlanFeature, plan: PlanId, suggestedUpgrade: PlanId | null) {
    super(`Feature ${feature} not available on plan ${plan}`);
    this.name = 'FeatureAccessError';
    this.feature = feature;
    this.plan = plan;
    this.suggestedUpgrade = suggestedUpgrade;
  }
}

export function getSuggestedUpgrade(plan: PlanId) {
  return PLAN_UPGRADE_MAP[plan] || null;
}

export function resolveBillingSku(value?: string | null): BillingSku | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  if (normalized in BILLING_SKUS) {
    return normalized as BillingSku;
  }
  if (normalized.includes('growth')) return 'agent_growth';
  if (normalized.includes('agency')) return 'agency_os';
  if (normalized.includes('pro')) return 'agent_pro';
  return null;
}

function normalizePlanId(value?: string | null): PlanId | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[^a-z0-9_]+/g, '');
  if (normalized.includes('agency')) return 'agency_os';
  if (normalized.includes('growth')) return 'agent_growth';
  if (normalized.includes('pro')) return 'agent_pro';
  return null;
}

function normalizeStatus(value?: string | null): SubscriptionStatus {
  if (!value) return 'trial';
  const normalized = value.toLowerCase();
  if (normalized.includes('past')) return 'past_due';
  if (normalized.includes('cancel')) return 'canceled';
  if (normalized.includes('trial')) return 'trial';
  return 'active';
}

function normalizeAddOns(value: any): BillingAddOns {
  if (!value || typeof value !== 'object') return {};
  return {
    ai_conversations: Number(value.ai_conversations || 0),
    leads: Number(value.leads || 0),
    domains: Number(value.domains || 0),
    sms_sends: Number(value.sms_sends || 0),
    ai_agents: Number(value.ai_agents || 0),
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function createTrialState(now = new Date()): TrialState {
  return {
    startedAt: now.toISOString(),
    endsAt: addDays(now, TRIAL_DAYS).toISOString(),
    endedAt: null,
    endedReason: null,
    publishedLandingPage: false,
    leadCaptured: false,
    aiConversationCount: 0,
  };
}

function normalizeTrial(value: any, now: Date, status: SubscriptionStatus): TrialState | null {
  if (!value) {
    return status === 'trial' ? createTrialState(now) : null;
  }
  const startedAt = value.startedAt ? String(value.startedAt) : now.toISOString();
  const endsAt = value.endsAt ? String(value.endsAt) : addDays(new Date(startedAt), TRIAL_DAYS).toISOString();
  return {
    startedAt,
    endsAt,
    endedAt: value.endedAt ? String(value.endedAt) : null,
    endedReason: value.endedReason ? String(value.endedReason) : null,
    publishedLandingPage: Boolean(value.publishedLandingPage),
    leadCaptured: Boolean(value.leadCaptured),
    aiConversationCount: Number(value.aiConversationCount || 0),
  };
}

function normalizeSubscription(
  data: Record<string, unknown> | undefined,
  now = new Date(),
): SubscriptionRecord {
  const rawPlan = typeof data?.plan === 'string' ? data.plan : null;
  const rawStatus = typeof data?.status === 'string' ? data.status : null;
  const plan = normalizePlanId(rawPlan) || DEFAULT_PLAN;
  const status = normalizeStatus(rawStatus);
  const trial = normalizeTrial(data?.trial, now, status);
  return {
    plan,
    status,
    currentPeriodStart: data?.currentPeriodStart ? String(data.currentPeriodStart) : null,
    currentPeriodEnd: data?.currentPeriodEnd ? String(data.currentPeriodEnd) : null,
    cancelAtPeriodEnd:
      typeof data?.cancelAtPeriodEnd === 'boolean' ? data.cancelAtPeriodEnd : false,
    trial,
    addOns: normalizeAddOns(data?.addOns),
  };
}

export function getCurrentPeriodKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getEffectiveLimit(
  plan: PlanId,
  metric: UsageMetric,
  addOns?: BillingAddOns | null,
) {
  const base = PLAN_LIMITS[plan]?.[metric];
  if (base === null || base === undefined) {
    return base ?? null;
  }
  const addonValue = Number(addOns?.[metric as keyof BillingAddOns] || 0);
  return base + addonValue;
}

function isUsageAllowed(status: SubscriptionStatus) {
  return status === 'trial' || status === 'active';
}

function getUsageDocId(metric: UsageMetric, now = new Date()) {
  return METRIC_PERIOD[metric] === 'monthly' ? getCurrentPeriodKey(now) : 'total';
}

function getUsageMetrics() {
  return Object.keys(METRIC_PERIOD) as UsageMetric[];
}

function getTrialStateStatus(trial: TrialState | null, now: Date) {
  if (!trial) {
    return { isExpired: false, reason: null };
  }
  if (trial.endedAt) {
    return { isExpired: true, reason: trial.endedReason || 'ended' };
  }
  if (new Date(trial.endsAt).getTime() <= now.getTime()) {
    return { isExpired: true, reason: 'trial_time_elapsed' };
  }
  return { isExpired: false, reason: null };
}

export function planLimitErrorResponse(error: PlanLimitError) {
  return {
    error: 'limit_reached',
    limit_type: error.metric,
    current_usage: error.currentUsage,
    allowed_limit: error.limit,
    suggested_upgrade: error.suggestedUpgrade,
  };
}

export function featureAccessErrorResponse(error: FeatureAccessError) {
  return {
    error: 'feature_locked',
    feature: error.feature,
    plan: error.plan,
    suggested_upgrade: error.suggestedUpgrade,
  };
}

export async function logBillingEvent(
  _db: unknown,
  _tenantId: string,
  _event: Record<string, unknown>,
) {
  return;
}

function buildDefaultSubscription(): SubscriptionRecord {
  return {
    plan: USE_NEON ? NEON_DEFAULT_PLAN : DEFAULT_PLAN,
    status: 'active',
    trial: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    addOns: {},
  };
}

export async function ensureSubscription(_db: unknown, _tenantId: string): Promise<SubscriptionRecord> {
  return buildDefaultSubscription();
}

export async function getSubscription(_db: unknown, _tenantId: string): Promise<SubscriptionRecord> {
  return buildDefaultSubscription();
}

type UsageUpdate = {
  metric: UsageMetric;
  increment: number;
};

export async function enforceUsageLimit(
  db: unknown,
  tenantId: string,
  metric: UsageMetric,
  increment = 1,
) {
  return enforceUsageLimits(db, tenantId, [{ metric, increment }]);
}

export async function enforceUsageLimits(
  _db: unknown,
  _tenantId: string,
  updates: UsageUpdate[],
) {
  if (USE_NEON) {
    return;
  }
  if (!updates.length) return;
}

export async function checkUsageLimit(
  _db: unknown,
  _tenantId: string,
  metric: UsageMetric,
) {
  if (!USE_NEON) {
    return { current: 0, limit: null };
  }
  const subscription = buildDefaultSubscription();
  const limit = getEffectiveLimit(subscription.plan, metric, subscription.addOns);
  return { current: 0, limit };
}

export async function recordTrialEvent(
  _db: unknown,
  _tenantId: string,
  _event: 'landing_page_published' | 'lead_captured',
) {
  return;
}

export async function requirePlanFeature(
  _db: unknown,
  _tenantId: string,
  feature: PlanFeature,
) {
  const subscription = buildDefaultSubscription();
  if (!isUsageAllowed(subscription.status)) {
    throw new PlanLimitError({
      metric: 'campaigns',
      limit: 0,
      currentUsage: 0,
      plan: subscription.plan,
      status: subscription.status,
      suggestedUpgrade: getSuggestedUpgrade(subscription.plan),
    });
  }

  if (!PLAN_FEATURES[subscription.plan]?.[feature]) {
    throw new FeatureAccessError(feature, subscription.plan, getSuggestedUpgrade(subscription.plan));
  }

  return subscription;
}

export async function getUsageSnapshot(_db: unknown, _tenantId: string) {
  const usage: Record<UsageMetric, number> = {} as Record<UsageMetric, number>;
  getUsageMetrics().forEach((metric) => {
    usage[metric] = 0;
  });
  return usage;
}

export async function getBillingSummary(_db: unknown, _tenantId: string) {
  const subscription = buildDefaultSubscription();
  const usage = await getUsageSnapshot(null, '');
  const limits: Record<UsageMetric, number | null> = {} as Record<UsageMetric, number | null>;
  const warnings: Record<UsageMetric, 'warning_70' | 'warning_90' | 'limit' | null> = {} as Record<
    UsageMetric,
    'warning_70' | 'warning_90' | 'limit' | null
  >;

  getUsageMetrics().forEach((metric) => {
    const limit = getEffectiveLimit(subscription.plan, metric, subscription.addOns);
    limits[metric] = limit ?? null;
    if (limit === null) {
      warnings[metric] = null;
      return;
    }
    if (limit === 0) {
      warnings[metric] = 'limit';
      return;
    }
    const ratio = usage[metric] / limit;
    if (ratio >= 1) {
      warnings[metric] = 'limit';
    } else if (ratio >= 0.9) {
      warnings[metric] = 'warning_90';
    } else if (ratio >= 0.7) {
      warnings[metric] = 'warning_70';
    } else {
      warnings[metric] = null;
    }
  });

  return {
    subscription,
    usage,
    limits,
    warnings,
    suggestedUpgrade: getSuggestedUpgrade(subscription.plan),
  };
}
