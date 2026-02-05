export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { filterProjects, type ProjectSearchFilters } from '@/lib/projects/filter';
import type { ProjectData } from '@/lib/types';
import { decodeFirestoreFields, normalizeProjectData } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { SERVER_ENV } from '@/lib/server/env';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { getAdminDb } from '@/server/firebase-admin';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { firebaseConfig } from '@/lib/firebase/config';

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
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}

function decodeCursor(value?: string | null): { time: number; id: string } | undefined {
  if (!value) return undefined;
  try {
    const decoded = Buffer.from(value, 'base64').toString('utf8');
    const [timestamp, id] = decoded.split('_');
    const time = parseInt(timestamp, 10);
    if (id && time && Number.isFinite(time)) {
      return { time, id };
    }
  } catch (e) {
    // Ignore malformed cursor
  }
  return undefined;
}

function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.getTime()}_${id}`).toString('base64');
}

function buildStaticCursor(page: number) {
  return `${STATIC_CURSOR_PREFIX}${page}`;
}

async function resolveOptionalAuth(req: NextRequest) {
  try {
    return await requireRole(req, ALL_ROLES);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) return null;
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
    const useStaticParam = searchParams.get('useStatic');

    const authContext = await resolveOptionalAuth(req);
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`projects:search:${ip}`, 120, 60_000))) {
      return respond({ ok: false, error: 'Rate limit exceeded', requestId }, { status: 429 });
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

    const useStaticInventory =
      useStaticParam === 'true' || SERVER_ENV.USE_STATIC_INVENTORY !== 'false';

    const items: ProjectData[] = [];
    let nextCursor: string | null = null;
    let totalApprox: number | undefined;
    let dataSource = 'static';

    let firestoreSucceeded = false;

    // ---------- Firestore Lazy Pagination ----------
    if (!useStaticInventory) {
      try {
        const db = getAdminDb();
        let firestoreCursor = cursor && !cursor.startsWith(STATIC_CURSOR_PREFIX) ? decodeCursor(cursor) : undefined;
        let pagesFetched = 0;

        while (pagesFetched < MAX_FIRESTORE_PAGES && items.length < DEFAULT_PAGE_SIZE) {
          pagesFetched++;

          let query = db.collection('inventory_projects').orderBy('createdAt');

          // Start after cursor if exists
          if (firestoreCursor) {
            const lastDocSnapshot = await db.collection('inventory_projects').doc(firestoreCursor.id).get();
            if (lastDocSnapshot.exists) query = query.startAfter(lastDocSnapshot);
          }

          // Apply filters if possible (Firestore indexes recommended)
          if (filters.city !== 'all') query = query.where('city', '==', filters.city);
          if (filters.status !== 'all') query = query.where('status', '==', filters.status);
          if (filters.developer) query = query.where('developer', '==', filters.developer);

          try {
            const snapshot = await query.limit(DEFAULT_PAGE_SIZE).get();
            if (snapshot.empty) break;

            const normalized = snapshot.docs.map((doc) => normalizeProjectData(doc.data(), doc.id));
            const filtered = filterProjects(normalized, searchFilters);

            const remaining = DEFAULT_PAGE_SIZE - items.length;
            items.push(...filtered.slice(0, remaining));

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            if (lastDoc) {
              const lastCreatedAt = lastDoc.data()?.createdAt?.toDate();
              if (lastCreatedAt) {
                firestoreCursor = { time: lastCreatedAt.getTime(), id: lastDoc.id };
                nextCursor = encodeCursor(lastCreatedAt, lastDoc.id);
              } else {
                firestoreCursor = undefined;
              }
            }

            firestoreSucceeded = true;

            if (!firestoreCursor || items.length >= DEFAULT_PAGE_SIZE) break;
          } catch (queryError: any) {
            console.warn(
              '[projects/search] Individual Firestore query page failed:',
              queryError.message
            );
            // Continue to next page attempt or break if too many failures
            break; // Break and fall back to static if a page query fails
          }
        }

        dataSource = firestoreSucceeded ? 'firestore' : 'static';
      } catch (firestoreError) {
        console.warn('[projects/search] Firestore query failed, will fallback to static.', firestoreError);
      }
    }

    // ---------- Static Fallback ----------
    if (items.length < DEFAULT_PAGE_SIZE) {
      const normalizedStatic = ENTRESTATE_INVENTORY.map((project) => normalizeProjectData(project, project.id));
      const filtered = filterProjects(normalizedStatic, searchFilters);

      const staticPage = decodeStaticCursor(cursor);
      const start = (staticPage - 1) * DEFAULT_PAGE_SIZE;

      for (let i = 0; items.length < DEFAULT_PAGE_SIZE && start + i < filtered.length; i++) {
        items.push(filtered[start + i]);
      }

      totalApprox = filtered.length;

      if (start + DEFAULT_PAGE_SIZE < filtered.length && !nextCursor) {
        nextCursor = buildStaticCursor(staticPage + 1);
      }

      if (!firestoreSucceeded) dataSource = 'static';
    }

    console.log(
      JSON.stringify({
        event: 'inventory.pagination',
        userId: authContext?.uid ?? 'anonymous',
        tenantId: authContext?.tenantId ?? 'public',
        cursorUsed: cursor || '<start>',
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
          cursorUsed: cursor || '<start>',
        },
      },
      { headers: { 'X-Inventory-Source': dataSource } }
    );
  } catch (error) {
    logError(scope, error, { url: req.url, requestId });
    return errorResponse(requestId, scope);
  }
}
