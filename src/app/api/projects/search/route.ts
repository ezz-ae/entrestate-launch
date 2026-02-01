import { NextRequest } from 'next/server';
import { filterProjects, type ProjectSearchFilters } from '@/lib/projects/filter';
import type { ProjectData } from '@/lib/types';
import { decodeFirestoreFields, normalizeProjectData } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { SERVER_ENV } from '@/lib/server/env';
import { firebaseConfig } from '@/lib/firebase/config';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { getAdminDb } from '@/server/firebase-admin';
import {
  resolveEntitlementsForTenant,
} from '@/lib/server/entitlements';
import {
  requireRole,
  UnauthorizedError,
  ForbiddenError,
} from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const DEFAULT_PAGE_SIZE = 12;
const STATIC_CURSOR_PREFIX = 'static:';
const QUOTA_ERROR_KEYWORDS = ['RESOURCE_EXHAUSTED', 'DEADLINE_EXCEEDED'];
const MAX_FIRESTORE_PAGES = 4;

interface ParsedFilters {
  query: string;
  city: string;
  status: string;
  developer: string;
  minPrice?: number;
  maxPrice?: number;
  cursor: string;
}

function parseFilters(searchParams: URLSearchParams): ParsedFilters {
  const minPriceParam = parseFloat(searchParams.get('minPrice') || '');
  const maxPriceParam = parseFloat(searchParams.get('maxPrice') || '');
  return {
    query: searchParams.get('query')?.toLowerCase() ?? '',
    city: searchParams.get('city')?.toLowerCase() ?? 'all',
    status: searchParams.get('status')?.toLowerCase() ?? 'all',
    developer: searchParams.get('developer')?.toLowerCase() ?? '',
    minPrice: Number.isFinite(minPriceParam) ? minPriceParam : undefined,
    maxPrice: Number.isFinite(maxPriceParam) ? maxPriceParam : undefined,
    cursor: searchParams.get('cursor')?.trim() ?? '',
  };
}

function decodeStaticCursor(cursor?: string): number {
  if (!cursor?.startsWith(STATIC_CURSOR_PREFIX)) return 1;
  const page = Number(cursor.slice(STATIC_CURSOR_PREFIX.length));
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

function buildStaticCursor(page: number) {
  return `${STATIC_CURSOR_PREFIX}${page}`;
}

async function resolveOptionalAuth(req: NextRequest) {
  try {
    return await requireRole(req, ALL_ROLES);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return null;
    }
    throw error;
  }
}

const PUBLIC_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.project_id ||
  firebaseConfig?.projectId;
const PUBLIC_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig?.apiKey;

export async function GET(req: NextRequest) {
  const scope = 'api/projects/search';
  const requestId = createRequestId();
  const path = req.url;
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { searchParams } = new URL(req.url);
    const filters = parseFilters(searchParams);
    const { cursor } = filters;

    const authContext = await resolveOptionalAuth(req);
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`projects:search:${ip}`, 120, 60_000))) {
      return respond(
        {
          ok: false,
          error: 'Rate limit exceeded',
          requestId,
        },
        { status: 429 }
      );
    }

    if (authContext) {
      const db = getAdminDb();
      const entitlements = await resolveEntitlementsForTenant(db, authContext.tenantId);
      if (!entitlements.features.inventoryAccess.allowed) {
        return respond(
          {
            ok: false,
            error:
              entitlements.features.inventoryAccess.reason ||
              'Inventory access is restricted to your plan.',
            feature: 'inventoryAccess',
            requestId,
          },
          { status: 403 }
        );
      }
    }

    const searchFilters: ProjectSearchFilters = {
      query: filters.query,
      city: filters.city,
      status: filters.status,
      developer: filters.developer,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };

    const useStaticInventory = SERVER_ENV.USE_STATIC_INVENTORY !== 'false';

    const items: ProjectData[] = [];
    let nextCursor: string | null = null;
    let totalApprox: number | undefined;
    let dataSource = 'static';
    let firestoreCursor =
      cursor && !cursor.startsWith(STATIC_CURSOR_PREFIX) ? cursor : undefined;
    let firestoreNextToken: string | null = null;
    let firestoreSucceeded = false;

    if (!useStaticInventory && PUBLIC_PROJECT_ID && PUBLIC_API_KEY && !cursor.startsWith(STATIC_CURSOR_PREFIX)) {
      try {
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${PUBLIC_PROJECT_ID}/databases/(default)/documents/inventory_projects`;
        let attempts = 0;
        while (attempts < MAX_FIRESTORE_PAGES && items.length < DEFAULT_PAGE_SIZE) {
          attempts += 1;
          const url = new URL(baseUrl);
          url.searchParams.set('pageSize', String(DEFAULT_PAGE_SIZE));
          url.searchParams.set('key', PUBLIC_API_KEY);
          if (firestoreCursor) {
            url.searchParams.set('pageToken', firestoreCursor);
          }

          const res = await fetch(url.toString(), { cache: 'no-store' });
          const text = await res.text();
          let parsed: any = null;
          try {
            parsed = text ? JSON.parse(text) : null;
          } catch {
            parsed = null;
          }

          if (!res.ok) {
            const errorPayload = parsed?.error;
            const errorMessage =
              typeof errorPayload?.message === 'string' ? errorPayload.message : '';
            const errorCode = errorPayload?.status ?? errorPayload?.code;
            const isQuotaError = QUOTA_ERROR_KEYWORDS.some((keyword) =>
              [errorCode, errorMessage].some(
                (value) => typeof value === 'string' && value.includes(keyword)
              )
            );
            if (isQuotaError) {
              return respond(
                {
                  ok: false,
                  error:
                    'Inventory service is temporarily limited due to quota. Please retry shortly.',
                  requestId,
                },
                { status: 503 }
              );
            }
            throw new Error(
              errorMessage ||
                `Firestore inventory request failed with status ${res.status}`
            );
          }

          const documents = Array.isArray(parsed?.documents) ? parsed.documents : [];
          const normalized = documents.map((doc: any) => {
            const docId =
              typeof doc.name === 'string'
                ? doc.name.split('/').filter(Boolean).pop() || ''
                : '';
            const raw = decodeFirestoreFields(doc.fields || {});
            return normalizeProjectData(raw, docId || 'unknown');
          });

          const filtered = filterProjects(normalized, searchFilters);
          const remaining = DEFAULT_PAGE_SIZE - items.length;
          if (remaining > 0) {
            items.push(...filtered.slice(0, remaining));
          }

          totalApprox =
            typeof parsed?.totalSize === 'number' && parsed.totalSize > 0
              ? parsed.totalSize
              : totalApprox;
          dataSource = 'firestore';
          firestoreSucceeded = true;

          const parsedNext =
            typeof parsed?.nextPageToken === 'string' ? parsed.nextPageToken : null;
          firestoreNextToken = parsedNext;
          if (!parsedNext) {
            break;
          }
          firestoreCursor = parsedNext;
        }
        if (firestoreSucceeded && firestoreNextToken) {
          nextCursor = firestoreNextToken;
        }
      } catch (firestoreError) {
        console.warn(
          '[projects/search] Firestore query failed, falling back to static.',
          firestoreError
        );
      }
    }

    if (!firestoreSucceeded) {
      const normalizedStatic = ENTRESTATE_INVENTORY.map((project) =>
        normalizeProjectData(project, project.id)
      );
      const filtered = filterProjects(normalizedStatic, searchFilters);
      totalApprox = filtered.length;
      const staticPage = decodeStaticCursor(cursor);
      const start = (staticPage - 1) * DEFAULT_PAGE_SIZE;
      const pageItems = filtered.slice(start, start + DEFAULT_PAGE_SIZE);
      items.splice(0, items.length, ...pageItems);
      if (start + DEFAULT_PAGE_SIZE < filtered.length) {
        nextCursor = buildStaticCursor(staticPage + 1);
      } else {
        nextCursor = null;
      }
      dataSource = 'static';
    }

    const cursorUsed = cursor || '<start>';
    console.log(
      JSON.stringify({
        event: 'inventory.pagination',
        userId: authContext?.uid ?? 'anonymous',
        tenantId: authContext?.tenantId ?? 'public',
        cursorUsed,
        countReturned: items.length,
        dataSource,
      })
    );

    return respond(
      {
        ok: true,
        requestId,
        data: {
          items,
          nextCursor,
          totalApprox,
          dataSource,
          returnedCount: items.length,
          cursorUsed,
        },
      },
      {
        headers: { 'X-Inventory-Source': dataSource },
      }
    );
  } catch (error) {
    logError(scope, error, { url: path, requestId });
    return errorResponse(requestId, scope);
  }
}
