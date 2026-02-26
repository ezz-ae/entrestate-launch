import { Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '../src/server/firebase-admin';
import { prisma } from '../src/server/db';

type FirestoreRecord = Record<string, any>;

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (value instanceof Timestamp) {
    return Number(value.toDate());
  }
  return undefined;
};

const toString = (value: unknown, ...fallbacks: Array<string | undefined>) => {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) {
    return fallbacks.find((fallback) => typeof fallback === 'string');
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return fallbacks.find((fallback) => typeof fallback === 'string');
};

const toJson = (value: unknown) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'object') return value;
  return String(value);
};

async function migrateProjects(tenantId: string, collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection('tenants').doc(tenantId).collection(collectionName).get();
  console.log(`[migrate] tenant=${tenantId} projects from ${collectionName}: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const slug = toString(data.slug, doc.id) ?? doc.id;
    const title = toString(data.title, data.name, 'Untitled Project') ?? 'Untitled Project';
    await prisma.project.upsert({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      update: {
        title,
        city: toString(data.city, data.location?.city),
        community: toString(data.community, data.location?.community),
        developer: toString(data.developer, data.builder),
        priceMin: toNumber(data.priceMin ?? data.price_min),
        priceMax: toNumber(data.priceMax ?? data.price_max),
        rentalYield: toNumber(data.rentalYield ?? data.rental_yield),
        sortScore: typeof data.sortScore === 'number' ? data.sortScore : undefined,
        firstPage: typeof data.firstPage === 'boolean' ? data.firstPage : undefined,
        imagesJson: toJson(data.images ?? data.imageGallery),
        dataJson: toJson(data.data ?? data.meta ?? data.attributes),
        updatedAt: new Date(),
      },
      create: {
        tenantId,
        slug,
        title,
        city: toString(data.city, data.location?.city),
        community: toString(data.community, data.location?.community),
        developer: toString(data.developer, data.builder),
        priceMin: toNumber(data.priceMin ?? data.price_min),
        priceMax: toNumber(data.priceMax ?? data.price_max),
        rentalYield: toNumber(data.rentalYield ?? data.rental_yield),
        sortScore: typeof data.sortScore === 'number' ? data.sortScore : undefined,
        firstPage: typeof data.firstPage === 'boolean' ? data.firstPage : undefined,
        imagesJson: toJson(data.images ?? data.imageGallery),
        dataJson: toJson(data.data ?? data.meta ?? data.attributes),
      },
    });
  }
}

async function migrateLeads(tenantId: string, collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection('tenants').doc(tenantId).collection(collectionName).get();
  console.log(`[migrate] tenant=${tenantId} leads from ${collectionName}: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    const data = doc.data();
    await prisma.lead.upsert({
      where: { id: doc.id },
      update: {
        name: toString(data.name),
        email: toString(data.email),
        phone: toString(data.phone),
        source: toString(data.source),
        utmJson: toJson(data.utm),
        notes: toString(data.notes ?? data.message),
        status: toString(data.status ?? data.state),
      },
      create: {
        id: doc.id,
        tenantId,
        projectId: toString(data.projectId),
        name: toString(data.name),
        email: toString(data.email),
        phone: toString(data.phone),
        source: toString(data.source),
        utmJson: toJson(data.utm),
        notes: toString(data.notes ?? data.message),
        status: toString(data.status ?? data.state),
      },
    });
  }
}

async function migrateCampaigns(tenantId: string, collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection('tenants').doc(tenantId).collection(collectionName).get();
  console.log(`[migrate] tenant=${tenantId} campaigns from ${collectionName}: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const platform = toString(data.platform, data.channel, 'marketing') ?? 'marketing';
    const name = toString(data.name ?? data.campaignName, 'Campaign') ?? 'Campaign';
    await prisma.campaign.upsert({
      where: { id: doc.id },
      update: {
        platform,
        name,
        utmSource: toString(data.utmSource ?? data.utm_source),
        utmCampaign: toString(data.utmCampaign ?? data.utm_campaign),
        spend: toNumber(data.spend ?? data.spendAmount),
        metaJson: toJson(data.meta),
      },
      create: {
        id: doc.id,
        tenantId,
        platform,
        name,
        utmSource: toString(data.utmSource ?? data.utm_source),
        utmCampaign: toString(data.utmCampaign ?? data.utm_campaign),
        spend: toNumber(data.spend ?? data.spendAmount),
        metaJson: toJson(data.meta),
      },
    });
  }
}

async function migrateAgentTraining(tenantId: string, collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection('tenants').doc(tenantId).collection(collectionName).get();
  console.log(`[migrate] tenant=${tenantId} agent training from ${collectionName}: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    const data = doc.data();
    await prisma.agentTraining.upsert({
      where: { id: doc.id },
      update: {
        projectId: toString(data.projectId),
        status: toString(data.status),
        extractedJson: toJson(data.extractedData ?? data.extracted),
      },
      create: {
        id: doc.id,
        tenantId,
        projectId: toString(data.projectId),
        status: toString(data.status),
        extractedJson: toJson(data.extractedData ?? data.extracted),
      },
    });
  }
}

async function migrateUploads(tenantId: string, collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection('tenants').doc(tenantId).collection(collectionName).get();
  console.log(`[migrate] tenant=${tenantId} uploads from ${collectionName}: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const rawKind = toString(data.kind, 'image') ?? 'image';
    const kind =
      rawKind === 'brochure' || rawKind === 'logo' || rawKind === 'image'
        ? rawKind
        : 'image';
    const filename = toString(data.filename, data.path, doc.id) ?? doc.id;
    const mime = toString(data.mimeType, data.contentType, 'application/octet-stream') ?? 'application/octet-stream';
    const url = toString(data.url ?? data.downloadUrl, '') ?? '';
    await prisma.upload.upsert({
      where: { id: doc.id },
      update: {
        kind: kind as any,
        filename,
        mime,
        size: typeof data.size === 'number' ? data.size : toNumber(data.size) ?? 0,
        url,
        projectId: toString(data.projectId),
      },
      create: {
        id: doc.id,
        tenantId,
        kind: kind as any,
        filename,
        mime,
        size: typeof data.size === 'number' ? data.size : toNumber(data.size) ?? 0,
        url,
        projectId: toString(data.projectId),
      },
    });
  }
}

async function main() {
  const db = getAdminDb();
  const tenantSnapshots = await db.collection('tenants').get();
  for (const tenantDoc of tenantSnapshots.docs) {
    const tenantId = tenantDoc.id;
    await migrateProjects(tenantId, 'inventory');
    await migrateLeads(tenantId, 'leads');
    await migrateCampaigns(tenantId, 'campaigns');
    await migrateAgentTraining(tenantId, 'agent_training');
    await migrateUploads(tenantId, 'uploads');
  }
}

main()
  .catch((error) => {
    console.error('[migrate] Neon migration failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
