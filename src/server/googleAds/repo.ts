import type {
  AdsCampaign,
  AdsDeployment,
  LearningSignal,
  ScenarioThresholdConfig,
  StrategicBlueprint,
} from '@/modules/googleAds/types';
import { DEFAULT_SCENARIO_THRESHOLDS } from '@/modules/googleAds/scenarios';
import { prisma } from '@/server/db';

export class FirestoreUnavailableError extends Error {
  constructor(message = 'Firestore admin is not configured.') {
    super(message);
    this.name = 'FirestoreUnavailableError';
  }
}

export async function getScenarioConfig(): Promise<ScenarioThresholdConfig> {
  return DEFAULT_SCENARIO_THRESHOLDS;
}

export async function createBlueprint(blueprint: StrategicBlueprint) {
  await prisma.adsBlueprint.create({
    data: {
      id: blueprint.id,
      tenantId: blueprint.tenantId,
      siteId: blueprint.siteId || null,
      dataJson: blueprint,
    },
  });
}

export async function getBlueprint(blueprintId: string): Promise<StrategicBlueprint | null> {
  const record = await prisma.adsBlueprint.findUnique({ where: { id: blueprintId } });
  return (record?.dataJson as StrategicBlueprint) || null;
}

export async function createCampaign(campaign: AdsCampaign) {
  await prisma.adsCampaign.create({
    data: {
      id: campaign.id,
      tenantId: campaign.tenantId,
      status: campaign.status,
      dataJson: campaign,
    },
  });
}

export async function updateCampaignStatus(campaignId: string, status: AdsCampaign['status']) {
  const existing = await prisma.adsCampaign.findUnique({ where: { id: campaignId } });
  const dataJson = (existing?.dataJson as AdsCampaign | null) || null;
  await prisma.adsCampaign.update({
    where: { id: campaignId },
    data: {
      status,
      dataJson: dataJson ? { ...dataJson, status, updatedAt: new Date().toISOString() } : { status },
    },
  });
}

export async function getCampaign(campaignId: string): Promise<AdsCampaign | null> {
  const record = await prisma.adsCampaign.findUnique({ where: { id: campaignId } });
  return (record?.dataJson as AdsCampaign) || null;
}

export async function listCampaigns(options: {
  tenantId: string;
  status?: AdsCampaign['status'];
  limit?: number;
}) {
  const records = await prisma.adsCampaign.findMany({
    where: {
      tenantId: options.tenantId,
      status: options.status,
    },
    orderBy: { createdAt: 'desc' },
    take: options.limit ?? 25,
  });
  return records.map((record) => record.dataJson as AdsCampaign);
}

export async function createDeployment(deployment: AdsDeployment) {
  await prisma.adsDeployment.create({
    data: {
      id: deployment.id,
      campaignId: deployment.campaignId,
      status: deployment.status,
      payload: deployment.payload,
    },
  });
}

export async function writeDailyReport(campaignId: string, dateId: string, data: Record<string, unknown>) {
  await prisma.adsReport.upsert({
    where: {
      campaignId_dateId: {
        campaignId,
        dateId,
      },
    },
    update: {
      dataJson: data,
      updatedAt: new Date(),
    },
    create: {
      campaignId,
      dateId,
      dataJson: data,
    },
  });
}

export async function recordLearningSignal(signal: LearningSignal) {
  await prisma.adsLearningSignal.create({
    data: {
      id: signal.id,
      tenantId: signal.tenantId,
      campaignId: signal.campaignId,
      dataJson: signal,
      recordedAt: new Date(signal.recordedAt),
    },
  });
}

export async function saveRefinerResult(options: {
  tenantId: string;
  siteId: string;
  result: Record<string, unknown>;
}) {
  const refId = `${options.siteId}-${Date.now()}`;
  await prisma.adsRefinerRun.create({
    data: {
      id: refId,
      tenantId: options.tenantId,
      siteId: options.siteId,
      result: options.result,
    },
  });
  return refId;
}
