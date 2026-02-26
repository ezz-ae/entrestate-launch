export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { filterProjects, type ProjectSearchFilters } from '@/lib/projects/filter';
import type { ProjectData } from '@/lib/types';
import { normalizeProjectData } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { SERVER_ENV } from '@/lib/server/env';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { resolveEntitlementsForTenant } from '@/lib/server/entitlements';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { prisma } from '@/server/db';

const DEFAULT_PAGE_SIZE = 12;
const STATIC_CURSOR_PREFIX = 'static:';
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
      const entitlements = await resolveEntitlementsForTenant(null, authContext.tenantId);
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

    let neonSucceeded = false;

    // ---------- Neon Pagination ----------
    if (!useStaticInventory && !cursor.startsWith(STATIC_CURSOR_PREFIX)) {
      try {
        const tenantId = authContext?.tenantId ?? 'public';
        const neonCursor = decodeCursor(cursor);
        const where: any = {
          tenantId,
          city: filters.city !== 'all' ? filters.city : undefined,
          OR: filters.query
            ? [
                { title: { contains: filters.query, mode: 'insensitive' } },
                { city: { contains: filters.query, mode: 'insensitive' } },
                { community: { contains: filters.query, mode: 'insensitive' } },
              ]
            : undefined,
          priceMin: filters.minPrice !== undefined ? { gte: filters.minPrice } : undefined,
          priceMax: filters.maxPrice !== undefined ? { lte: filters.maxPrice } : undefined,
        };

        if (neonCursor) {
          where.AND = [
            {
              OR: [
                { createdAt: { lt: new Date(neonCursor.time) } },
                {
                  createdAt: new Date(neonCursor.time),
                  id: { lt: neonCursor.id },
                },
              ],
            },
          ];
        }

        const neonItems = await prisma.project.findMany({
          where,
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: DEFAULT_PAGE_SIZE,
        });

        const filtered = neonItems
          .map((project) => {
            const raw = project.dataJson ?? {
              name: project.title,
              developer: project.developer,
              city: project.city,
              community: project.community,
              price_min: project.priceMin ? Number(project.priceMin) : undefined,
              price_max: project.priceMax ? Number(project.priceMax) : undefined,
              images: project.imagesJson,
            };
            const normalized = normalizeProjectData(raw, project.id);
            return { ...normalized, __createdAt: project.createdAt };
          })
          .filter((project) => {
            if (filters.status !== 'all' && project.status) {
              return project.status.toLowerCase() === filters.status;
            }
            if (filters.developer) {
              return (project.developer || '').toLowerCase() === filters.developer;
            }
            return true;
          });

        items.push(...filtered);
        const lastItem = items[items.length - 1];
        if (lastItem && (lastItem as any)?.__createdAt) {
          nextCursor = encodeCursor(new Date((lastItem as any).__createdAt), lastItem.id);
        }

        neonSucceeded = items.length > 0;
        if (neonSucceeded) dataSource = 'neon';
      } catch (neonError) {
        console.warn('[projects/search] Neon query failed, will fallback.', neonError);
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

      if (!neonSucceeded) dataSource = 'static';
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

    const responseItems = items.map((item: any) => {
      if (item && typeof item === 'object' && '__createdAt' in item) {
        const { __createdAt, ...rest } = item;
        return rest;
      }
      return item;
    });

    return respond(
      {
        ok: true,
        requestId,
        data: {
          items: responseItems,
          nextCursor,
          totalApprox,
          dataSource,
          returnedCount: responseItems.length,
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
