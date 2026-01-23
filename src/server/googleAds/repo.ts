import { FieldValue } from 'firebase-admin/firestore';
import { tryGetAdminDb } from '@/server/firebase-admin';
import type {
  AdsCampaign,
  AdsDeployment,
  LearningSignal,
  ScenarioThresholdConfig,
  StrategicBlueprint,
} from '@/modules/googleAds/types';
import { DEFAULT_SCENARIO_THRESHOLDS } from '@/modules/googleAds/scenarios';

export class FirestoreUnavailableError extends Error {
  constructor(message = 'Firestore admin is not configured.') {
    super(message);
    this.name = 'FirestoreUnavailableError';
  }
}

function requireDb() {
  const db = tryGetAdminDb();
  if (!db) {
    throw new FirestoreUnavailableError();
  }
  return db;
}

export async function getScenarioConfig(): Promise<ScenarioThresholdConfig> {
  const db = requireDb();
  const snap = await db.collection('config').doc('ads').get();
  if (!snap.exists) return DEFAULT_SCENARIO_THRESHOLDS;
  return { ...DEFAULT_SCENARIO_THRESHOLDS, ...(snap.data() as ScenarioThresholdConfig) };
}

export async function createBlueprint(blueprint: StrategicBlueprint) {
  const db = requireDb();
  await db.collection('adsBlueprints').doc(blueprint.id).set({ ...blueprint });
}

export async function getBlueprint(blueprintId: string): Promise<StrategicBlueprint | null> {
  const db = requireDb();
  const snap = await db.collection('adsBlueprints').doc(blueprintId).get();
  if (!snap.exists) return null;
  return snap.data() as StrategicBlueprint;
}

export async function createCampaign(campaign: AdsCampaign) {
  const db = requireDb();
  await db.collection('adsCampaigns').doc(campaign.id).set({ ...campaign });
}

export async function updateCampaignStatus(campaignId: string, status: AdsCampaign['status']) {
  const db = requireDb();
  await db.collection('adsCampaigns').doc(campaignId).set(
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function getCampaign(campaignId: string): Promise<AdsCampaign | null> {
  const db = requireDb();
  const snap = await db.collection('adsCampaigns').doc(campaignId).get();
  if (!snap.exists) return null;
  return snap.data() as AdsCampaign;
}

export async function listCampaigns(options: {
  tenantId: string;
  status?: AdsCampaign['status'];
  limit?: number;
}) {
  const db = requireDb();
  let query = db.collection('adsCampaigns').where('tenantId', '==', options.tenantId);
  if (options.status) {
    query = query.where('status', '==', options.status);
  }
  const snap = await query.orderBy('createdAt', 'desc').limit(options.limit ?? 25).get();
  return snap.docs.map((doc) => doc.data() as AdsCampaign);
}

export async function createDeployment(deployment: AdsDeployment) {
  const db = requireDb();
  await db.collection('adsDeployments').doc(deployment.id).set({ ...deployment });
}

export async function writeDailyReport(campaignId: string, dateId: string, data: Record<string, unknown>) {
  const db = requireDb();
  await db
    .collection('adsReports')
    .doc(campaignId)
    .collection('daily')
    .doc(dateId)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function recordLearningSignal(signal: LearningSignal) {
  const db = requireDb();
  await db.collection('learningSignals').doc(signal.id).set(signal);
}

export async function saveRefinerResult(options: {
  tenantId: string;
  siteId: string;
  result: Record<string, unknown>;
}) {
  const db = requireDb();
  const refId = `${options.siteId}-${Date.now()}`;
  await db.collection('adsRefinerRuns').doc(refId).set({
    tenantId: options.tenantId,
    siteId: options.siteId,
    result: options.result,
    createdAt: new Date().toISOString(),
  });
  return refId;
}
