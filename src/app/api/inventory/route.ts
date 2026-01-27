import { NextRequest } from 'next/server';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

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

    const db = getAdminDb();
    let query = db
      .collection('tenants')
      .doc(tenantId)
      .collection('inventory')
      .orderBy('createdAt', 'desc')
      .orderBy(FieldPath.documentId(), 'desc');

    const decoded = decodeCursor(parsed.cursor);
    if (decoded) {
      query = query.startAfter(new Date(decoded.time), decoded.id);
    }

    const snapshot = await query.limit(DEFAULT_LIMIT).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const lastCreatedAt = lastDoc?.data()?.createdAt?.toDate?.();
    const nextCursor =
      lastDoc && lastCreatedAt ? encodeCursor(lastCreatedAt, lastDoc.id) : null;

    console.log(
      JSON.stringify({
        event: 'inventory.pagination',
        userId: uid,
        tenantId,
        cursorUsed: cursor || '<start>',
        countReturned: items.length,
      })
    );

    const payload = {
      items,
      nextCursor,
      returnedCount: items.length,
      cursorUsed: cursor || '<start>',
      limit: DEFAULT_LIMIT,
    };

    cache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload,
    });

    return respond({ ok: true, data: payload, requestId });
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
    const db = getAdminDb();
    const ref = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('inventory')
      .add({
        ...data,
        status: data.status || 'active',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    return respond({ ok: true, data: { id: ref.id }, requestId }, { status: 201 });
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
    const db = getAdminDb();
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('inventory')
      .doc(id)
      .set(
        {
          ...data,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
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
    const db = getAdminDb();
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('inventory')
      .doc(id)
      .delete();
    return respond({ ok: true, data: { id }, requestId });
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
