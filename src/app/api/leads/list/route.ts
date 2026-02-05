import { NextRequest } from 'next/server';
import { z } from 'zod';
import { FieldPath } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 12;

const querySchema = z.object({
  cursor: z.string().optional(),
});

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

export async function GET(req: NextRequest) {
  const scope = 'api/leads/list';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.parse({
      cursor: searchParams.get('cursor') || undefined,
    });

    const { tenantId } = await requireRole(req, ALL_ROLES);

    const db = getAdminDb();
    let query = db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .orderBy(FieldPath.documentId(), 'desc');

    const decodedCursor = decodeCursor(parsed.cursor);
    if (decodedCursor) {
      query = query.startAfter(new Date(decodedCursor.time), decodedCursor.id);
    }

    const snapshot = await query.limit(DEFAULT_LIMIT).get();

    const leads = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const createdAtDate =
        data.createdAt?.toDate?.() ??
        (data.createdAt instanceof Date ? data.createdAt : new Date());
      const updatedAtDate =
        data.updatedAt?.toDate?.() ??
        (data.updatedAt instanceof Date ? data.updatedAt : new Date());
      return {
        id: doc.id,
        ...data,
        createdAt: createdAtDate.toISOString(),
        updatedAt: updatedAtDate.toISOString(),
      };
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const lastCreatedAt = lastDoc?.data()?.createdAt?.toDate?.();
    const nextCursor =
      lastDoc && lastCreatedAt ? encodeCursor(lastCreatedAt, lastDoc.id) : null;

    console.log(
      JSON.stringify({
        event: 'leads.pagination',
        tenantId,
        cursorUsed: parsed.cursor || '<start>',
        countReturned: leads.length,
      })
    );

    return respond({
      ok: true,
      data: {
        items: leads,
        nextCursor,
        returnedCount: leads.length,
        cursorUsed: parsed.cursor || '<start>',
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid query', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    return errorResponse(requestId, scope);
  }
}
