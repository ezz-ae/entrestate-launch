import { prisma } from '@/server/db';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import type { ProjectData } from '@/lib/types';
import { SERVER_ENV, USE_NEON } from '@/lib/server/env';

// Cache settings
const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX = 500;

let cachedProjects: ProjectData[] = [];
let cachedAt = 0;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  geoPointValue?: { latitude: number; longitude: number };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  arrayValue?: { values?: FirestoreValue[] };
  referenceValue?: string;
};

const normalizeString = (value: unknown, fallback = '') => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return fallback;
};

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const CITY_LABELS: Record<string, string> = {
  dubai: 'Dubai',
  abudhabi: 'Abu Dhabi',
  rasalkhaimah: 'Ras Al Khaimah',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  ummalquwain: 'Umm Al Quwain',
  fujairah: 'Fujairah',
  alain: 'Al Ain',
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => (part.length > 2 ? part[0].toUpperCase() + part.slice(1) : part.toUpperCase()))
    .join(' ');

const normalizeCityLabel = (value: string, fallback: string) => {
  if (!value) return fallback;
  const key = normalizeKey(value);
  if (CITY_LABELS[key]) return CITY_LABELS[key];
  return toTitleCase(value.replace(/_/g, ' ')) || fallback;
};

const normalizeArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

function decodeFirestoreValue(value: FirestoreValue): any {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return Number(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.geoPointValue !== undefined) return value.geoPointValue;
  if (value.nullValue !== undefined) return null;
  if (value.referenceValue !== undefined) return value.referenceValue;
  if (value.mapValue) {
    const fields = value.mapValue.fields || {};
    return decodeFirestoreFields(fields);
  }
  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue);
  }
  return undefined;
}

export function decodeFirestoreFields(fields: Record<string, FirestoreValue>) {
  const result: Record<string, any> = {};
  Object.entries(fields).forEach(([key, value]) => {
    result[key] = decodeFirestoreValue(value);
  });
  return result;
}

export function normalizeProjectData(raw: any, id: string): ProjectData {
  if (!raw) {
    return { id, name: 'Invalid Project Data' } as ProjectData;
  }

  const locationRaw = raw.location || {};
  const cityRaw = normalizeString(locationRaw.city || raw.city || raw.market, 'UAE');
  const city = normalizeCityLabel(cityRaw, 'UAE');
  const area = normalizeString(locationRaw.area || raw.area || raw.community, city);
  const mapQuery = normalizeString(
    locationRaw.mapQuery || raw.mapQuery,
    area ? `${area}, ${city}` : city
  );

  const descriptionRaw = raw.description || raw.details || raw.summary || raw.about;
  let descriptionFull = '';
  let descriptionShort = '';
  if (typeof descriptionRaw === 'string') {
    descriptionFull = descriptionRaw;
    descriptionShort = descriptionRaw;
  } else if (descriptionRaw && typeof descriptionRaw === 'object') {
    descriptionFull = normalizeString(
      descriptionRaw.full || descriptionRaw.long || descriptionRaw.text,
      ''
    );
    descriptionShort = normalizeString(
      descriptionRaw.short || descriptionRaw.summary || descriptionRaw.brief,
      descriptionFull
    );
  }

  const priceFrom = normalizeNumber(
    raw.price?.from ?? raw.priceFrom ?? raw.startingPrice ?? raw.minPrice ?? raw.price_min
  );
  const priceLabel =
    normalizeString(raw.price?.label || raw.priceLabel || raw.priceText) ||
    (priceFrom ? `AED ${priceFrom.toLocaleString('en-AE')}` : 'Price on request');

  const performanceRaw = raw.performance || {};
  const trendRaw = normalizeString(
    performanceRaw.marketTrend || raw.marketTrend || performanceRaw.market_trend,
    'stable'
  ).toLowerCase();
  const marketTrend =
    trendRaw === 'up' || trendRaw === 'down' || trendRaw === 'stable'
      ? (trendRaw as 'up' | 'down' | 'stable')
      : 'stable';

  const handoverRaw = raw.handover || raw.handoverDate || raw.delivery?.handover;
  let handover: ProjectData['handover'] = null;
  if (handoverRaw && typeof handoverRaw === 'object') {
    const quarter = normalizeNumber(handoverRaw.quarter || handoverRaw.q);
    const year = normalizeNumber(handoverRaw.year || handoverRaw.y);
    if (quarter && year) {
      handover = { quarter, year };
    }
  }
  if (!handover && raw.deliveryYear) {
    const year = normalizeNumber(raw.deliveryYear);
    if (year) {
      handover = { quarter: 4, year };
    }
  }

  const images = [
    ...normalizeArray(raw.images),
    ...normalizeArray(raw.gallery),
    ...normalizeArray(raw.photos),
  ];

  const brochureUrl =
    normalizeString(raw.brochureUrl || raw.brochure_url || raw.brochure) || undefined;

  const publicUrlRaw =
    normalizeString(raw.publicUrl || raw.public_url || raw.landingPageUrl || raw.url) ||
    undefined;
  const publicUrl = publicUrlRaw ? safeDecodeURIComponent(publicUrlRaw) : undefined;

  return {
    id,
    name: normalizeString(raw.name || raw.title || raw.project || raw.projectName, id),
    developer: normalizeString(raw.developer || raw.builder || raw.dev, 'Unknown Developer'),
    status: normalizeString(raw.status || raw.availability || 'Available'),
    price: {
      label: priceLabel,
      value: priceFrom || undefined,
      from: priceFrom || undefined,
      sqftAvg: normalizeNumber(raw.price?.sqftAvg || raw.sqftAvg) || undefined,
    },
    location: {
      city,
      area,
      mapQuery,
    },
    images: images.length ? images : undefined,
    performance: {
      roi: normalizeNumber(performanceRaw.roi || raw.roi) || undefined,
      rentalYield: normalizeNumber(performanceRaw.rentalYield || raw.rentalYield) || undefined,
      capitalAppreciation:
        normalizeNumber(performanceRaw.capitalAppreciation || raw.capitalAppreciation) ||
        undefined,
      marketTrend,
      priceHistory: normalizeArray(performanceRaw.priceHistory || raw.priceHistory),
    },
    handover: handover || undefined,
    description: {
      short: descriptionShort || descriptionFull || 'Project details coming soon.',
      full: descriptionFull || descriptionShort || 'Project details coming soon.',
    },
    brochureUrl,
    publicUrl,
    features: normalizeArray(raw.features || raw.amenities || raw.highlights),
    tags: normalizeArray(raw.tags || raw.keywords),
    availability: normalizeString(raw.availability || raw.status || ''),
    bedrooms: raw.bedrooms || raw.bedroom || undefined,
    areaSqft: raw.areaSqft || raw.area_sqft || undefined,
    unitsStockUpdatedAt: raw.unitsStockUpdatedAt || raw.units_stock_updated_at || undefined,
  };
}

function mapProjectRecord(project: any): ProjectData {
  const raw = project.dataJson ?? {
    name: project.title,
    developer: project.developer,
    city: project.city,
    community: project.community,
    price_min: project.priceMin ? Number(project.priceMin) : undefined,
    price_max: project.priceMax ? Number(project.priceMax) : undefined,
    images: project.imagesJson,
  };
  return normalizeProjectData(raw, project.id);
}

export async function loadInventoryProjects(max = DEFAULT_MAX, forceRefresh = false) {
  const isFresh = !forceRefresh && cachedProjects.length > 0 && Date.now() - cachedAt < CACHE_TTL_MS;
  if (isFresh) {
    return cachedProjects;
  }

  let projects: ProjectData[] = [];

  if (USE_NEON) {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: max,
    });
    projects = records.map(mapProjectRecord);
  }

  if (!projects.length && SERVER_ENV.USE_STATIC_INVENTORY !== 'false') {
    projects = ENTRESTATE_INVENTORY.slice(0, max);
  }

  cachedProjects = projects;
  cachedAt = Date.now();
  return projects;
}

export async function loadInventoryProjectById(projectId: string) {
  const resolvedId = projectId.trim();
  if (!resolvedId) return null;

  if (USE_NEON) {
    const record = await prisma.project.findUnique({ where: { id: resolvedId } });
    if (record) {
      return mapProjectRecord(record);
    }
  }

  const fallback = SERVER_ENV.USE_STATIC_INVENTORY !== 'false' ? ENTRESTATE_INVENTORY : cachedProjects;
  const direct = fallback.find((project) => project.id === resolvedId);
  if (direct) return direct;

  const normalizedId = normalizeKey(resolvedId);
  const foundInFallback = fallback.find((project) => {
    if (normalizeKey(project.id) === normalizedId) return true;
    if (normalizeKey(project.name) === normalizedId) return true;
    if (project.publicUrl) {
      const slug = project.publicUrl.split('/').filter(Boolean).pop();
      if (slug && normalizeKey(slug) === normalizedId) return true;
    }
    return false;
  });

  return foundInFallback || null;
}

export async function getRelevantProjects(message: string, context?: string, max = 8) {
  const projects = await loadInventoryProjects();
  const query = `${message || ''} ${context || ''}`.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/i).filter((term) => term.length > 2);

  if (!terms.length) {
    return projects.slice(0, max);
  }

  const scored = projects
    .map((project) => {
      const haystack = [
        project.name,
        project.developer,
        project.location?.city,
        project.location?.area,
        project.description?.short,
        project.tags?.join(' '),
        project.features?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      let score = 0;
      terms.forEach((term) => {
        if (haystack.includes(term)) {
          score += term.length > 4 ? 2 : 1;
        }
      });
      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((item) => item.project);

  return scored.length ? scored : projects.slice(0, max);
}

export function formatProjectContext(project: ProjectData) {
  const location = project.location?.area || project.location?.city || 'UAE';
  const developer = project.developer && project.developer !== 'Unknown Developer' ? project.developer : 'a premium developer';
  const price = project.price?.label || 'Price on request';
  const handover = project.handover ? `Q${project.handover.quarter} ${project.handover.year}` : 'TBD';
  const status = project.availability || project.status || 'Available';
  const highlights = project.features?.slice(0, 8).join(', ');
  const description = project.description?.short || project.description?.full?.slice(0, 150) || '';

  return `- ${project.name} by ${developer} in ${location}: ${description} | Price: ${price} | Status: ${status} | Handover: ${handover}${highlights ? ` | Amenities: ${highlights}` : ''}`;
}
