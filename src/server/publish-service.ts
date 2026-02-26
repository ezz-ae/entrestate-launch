import type { SitePage } from '@/lib/types';
import { prisma } from '@/server/db';

function normalizeTimestamp(value: any) {
  if (value?.toDate) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
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
  } catch (error) {
    console.error('[publish] Error fetching published site:', error);
    return null;
  }
}
