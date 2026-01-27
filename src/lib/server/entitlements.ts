import { Firestore } from 'firebase-admin/firestore';
import {
  BillingAddOns,
  getSubscription,
  PLAN_NAMES,
  PlanId,
  SubscriptionRecord,
} from '@/lib/server/billing';

export type EntitlementPlan = 'free' | 'agent_monthly' | 'builder_monthly' | 'ads_prepaid';

export type EntitlementGate = {
  allowed: boolean;
  reason?: string;
};

export interface EntitlementFeatures {
  inventoryAccess: EntitlementGate;
  builderPublish: EntitlementGate;
  leadExports: EntitlementGate;
  senders: EntitlementGate;
}

export interface EntitlementSummary {
  plan: EntitlementPlan;
  planId: PlanId;
  planName: string;
  status: SubscriptionRecord['status'];
  isTrial: boolean;
  addOns: BillingAddOns | null;
  features: EntitlementFeatures;
  reason?: string;
}

const PLAN_TO_ENTITLEMENT: Record<PlanId, EntitlementPlan> = {
  agent_pro: 'agent_monthly',
  agent_growth: 'builder_monthly',
  agency_os: 'ads_prepaid',
};

const REASONS: Record<keyof EntitlementFeatures, string> = {
  inventoryAccess: 'Inventory access is locked until you upgrade to a paid plan.',
  builderPublish: 'Publishing drafts requires a Builder Monthly or higher plan.',
  leadExports: 'Lead exports are reserved for Agent Monthly subscriptions.',
  senders: 'Email and SMS senders are gated behind a paid messaging plan.',
};

const FEATURE_MATRIX: Record<EntitlementPlan, EntitlementFeatures> = {
  free: {
    inventoryAccess: { allowed: false, reason: REASONS.inventoryAccess },
    builderPublish: { allowed: false, reason: REASONS.builderPublish },
    leadExports: { allowed: false, reason: REASONS.leadExports },
    senders: { allowed: false, reason: REASONS.senders },
  },
  agent_monthly: {
    inventoryAccess: { allowed: true },
    builderPublish: { allowed: false, reason: REASONS.builderPublish },
    leadExports: { allowed: true },
    senders: { allowed: true },
  },
  builder_monthly: {
    inventoryAccess: { allowed: true },
    builderPublish: { allowed: true },
    leadExports: { allowed: true },
    senders: { allowed: true },
  },
  ads_prepaid: {
    inventoryAccess: { allowed: true },
    builderPublish: { allowed: true },
    leadExports: { allowed: true },
    senders: { allowed: true },
  },
};

function deriveEntitlementPlan(subscription: SubscriptionRecord): EntitlementPlan {
  if (subscription.status === 'past_due' || subscription.status === 'canceled') {
    return 'free';
  }
  return PLAN_TO_ENTITLEMENT[subscription.plan] ?? 'agent_monthly';
}

export async function resolveEntitlementsForTenant(
  db: Firestore,
  tenantId: string
): Promise<EntitlementSummary> {
  const subscription = await getSubscription(db, tenantId);
  const plan = deriveEntitlementPlan(subscription);
  const features = FEATURE_MATRIX[plan];
  const planName = PLAN_NAMES[subscription.plan] ?? 'Agent Pro';
  return {
    plan,
    planId: subscription.plan,
    planName,
    status: subscription.status,
    isTrial: subscription.status === 'trial',
    addOns: subscription.addOns || null,
    features,
    reason:
      plan === 'free'
        ? 'Upgrade to a paid plan to unlock inventory, exports, and messaging.'
        : undefined,
  };
}
