export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { prisma } from '@/server/db';

const DEFAULT_LIMIT = 12;
const CACHE_TTL_MS = 30_000;

const listSchema = z.object({
  cursor: z.string().optional(),
});

const cache = new Map<
  string,
  { expiresAt: number; payload: Record<string, unknown> }
>();

function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.getTime()}:${id}`).toString('base64');
}

function decodeCursor(value?: string | null) {
  if (!value) return null;
  try {
    const decoded = Buffer.from(value, 'base64').toString('utf-8');
    const [rawTime, id] = decoded.split(':');
    const time = Number(rawTime);
    if (!id || !Number.isFinite(time)) return null;
    return { time, id };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const scope = 'api/inventory';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId, uid } = await requireRole(request, ALL_ROLES);
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const normalized = limitParam.trim().toLowerCase();
      const parsedLimit = Number(normalized);
      if (
        normalized === 'all' ||
        normalized === 'full' ||
        (Number.isFinite(parsedLimit) && parsedLimit > DEFAULT_LIMIT)
      ) {
        return respond(
          {
            ok: false,
            error: 'Full inventory scans are disabled. Limit is fixed at 12.',
            requestId,
          },
          { status: 400 }
        );
      }
    }
    const parsed = listSchema.parse({
      cursor: searchParams.get('cursor') || undefined,
    });
    const cursor = parsed.cursor || '';
    const cacheKey = `${tenantId}:${cursor || '<start>'}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return respond({ ok: true, data: cached.payload, requestId });
    }

    const decoded = decodeCursor(parsed.cursor);
    const where = decoded
      ? {
          tenantId,
          OR: [
            { createdAt: { lt: new Date(decoded.time) } },
            {
              createdAt: new Date(decoded.time),
              id: { lt: decoded.id },
            },
          ],
        }
      : { tenantId };

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_LIMIT,
    });

    const lastItem = items[items.length - 1];
    const nextCursor = lastItem
      ? encodeCursor(lastItem.createdAt, lastItem.id)
      : null;

    console.log(
      JSON.stringify({
        event: 'inventory.pagination',
        userId: uid,
        tenantId,
        cursorUsed: cursor || '<start>',
        countReturned: items.length,
        requestId,
      })
    );

    const payload = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        ...(item.dataJson as Record<string, unknown> | null),
      })),
      nextCursor,
      returnedCount: items.length,
      cursorUsed: cursor || '<start>',
      limit: DEFAULT_LIMIT,
    };

    cache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload,
    });

    return respond({ ok: true, data: payload, items: payload.items, requestId });
  } catch (error) {
    logError(scope, error, { requestId, path: request.url });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid query', details: error.errors, requestId },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}

const mutationSchema = z.object({
  id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const scope = 'api/inventory/post';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const data = await request.json();
    const name = String(data?.name || '').trim();
    if (!name) {
      return respond({ ok: false, error: 'Missing name', requestId }, { status: 400 });
    }
    const status = String(data?.status || 'active');
    const { name: _name, status: _status, ...rest } = data || {};
    const record = await prisma.inventoryItem.create({
      data: {
        tenantId,
        name,
        status,
        dataJson: rest,
      },
    });
    return respond({ ok: true, data: { id: record.id }, requestId }, { status: 201 });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}

export async function PATCH(request: NextRequest) {
  const scope = 'api/inventory/patch';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { id, ...data } = mutationSchema
      .catchall(z.any())
      .parse(await request.json());
    if (!id) {
      return respond({ ok: false, error: 'Missing id', requestId }, { status: 400 });
    }
    const name = data?.name ? String(data.name) : undefined;
    const status = data?.status ? String(data.status) : undefined;
    const { name: _name, status: _status, ...rest } = data;
    await prisma.inventoryItem.updateMany({
      where: { id, tenantId },
      data: {
        name,
        status,
        dataJson: rest,
      },
    });
    return respond({ ok: true, data: { id }, requestId });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}

export async function DELETE(request: NextRequest) {
  const scope = 'api/inventory/delete';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(request, ALL_ROLES);
    const { id } = mutationSchema.parse(await request.json());
    if (!id) {
      return respond({ ok: false, error: 'Missing id', requestId }, { status: 400 });
    }
    await prisma.inventoryItem.deleteMany({
      where: { id, tenantId },
    });
    return respond({ ok: true, data: { id }, requestId });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
