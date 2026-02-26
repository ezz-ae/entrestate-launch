import type { SitePage } from '@/lib/types';
import { prisma } from '@/server/db';
import { USE_NEON } from '@/lib/server/env';

function normalizeTimestamp(value: any) {
  if (value?.toDate) {
    return value.toDate().toISOString();
  }
  return value;
}

function normalizeSiteRecord(record: any): SitePage {
  return {
    id: record.id,
    ...record,
    createdAt: normalizeTimestamp(record.createdAt),
    updatedAt: normalizeTimestamp(record.updatedAt),
    lastPublishedAt: normalizeTimestamp(record.lastPublishedAt),
  } as SitePage;
}

export async function getPublishedSite(siteIdOrSlug: string): Promise<SitePage | null> {
  try {
    if (USE_NEON) {
      const direct = await prisma.site.findFirst({
        where: { id: siteIdOrSlug, published: true },
      });
      if (direct) return normalizeSiteRecord(direct);

      const bySubdomain = await prisma.site.findFirst({
        where: { subdomain: siteIdOrSlug, published: true },
      });
      if (bySubdomain) return normalizeSiteRecord(bySubdomain);

      const byCustomDomain = await prisma.site.findFirst({
        where: { customDomain: siteIdOrSlug, published: true },
      });
      if (byCustomDomain) return normalizeSiteRecord(byCustomDomain);

      return null;
    }

    const db = (await import('@/server/firebase-admin')).getAdminDb();
    const direct = await db.collection('sites').doc(siteIdOrSlug).get();
    if (direct.exists && direct.data()?.published) {
      const data = direct.data() || {};
      return {
        id: direct.id,
        ...data,
        createdAt: normalizeTimestamp(data.createdAt),
        updatedAt: normalizeTimestamp(data.updatedAt),
        lastPublishedAt: normalizeTimestamp(data.lastPublishedAt),
      } as SitePage;
    }

    const bySubdomain = await db
      .collection('sites')
      .where('subdomain', '==', siteIdOrSlug)
      .limit(1)
      .get();
    if (!bySubdomain.empty) {
      const doc = bySubdomain.docs[0];
      if (doc.data()?.published) {
        const data = doc.data() || {};
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeTimestamp(data.createdAt),
          updatedAt: normalizeTimestamp(data.updatedAt),
          lastPublishedAt: normalizeTimestamp(data.lastPublishedAt),
        } as SitePage;
      }
    }

    const byCustomDomain = await db
      .collection('sites')
      .where('customDomain', '==', siteIdOrSlug)
      .limit(1)
      .get();
    if (!byCustomDomain.empty) {
      const doc = byCustomDomain.docs[0];
      if (doc.data()?.published) {
        const data = doc.data() || {};
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeTimestamp(data.createdAt),
          updatedAt: normalizeTimestamp(data.updatedAt),
          lastPublishedAt: normalizeTimestamp(data.lastPublishedAt),
        } as SitePage;
      }
    }

    return null;
  } catch (error) {
    console.error('[publish] Error fetching published site:', error);
    return null;
  }
}
