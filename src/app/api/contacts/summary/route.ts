export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';

const ALLOWED_CHANNELS = new Set(['email', 'sms']);

export async function GET(req: NextRequest) {
  const scope = 'api/contacts/summary';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { searchParams } = new URL(req.url);
    const channel = (searchParams.get('channel') || 'email').toLowerCase();
    if (!ALLOWED_CHANNELS.has(channel)) {
      return respond({ ok: false, error: 'Invalid channel.', requestId }, { status: 400 });
    }

    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();

    const importedSnap = await db
      .collection('contacts')
      .where('tenantId', '==', tenantId)
      .where('channel', '==', channel)
      .get();

    const pilotSnap = await db
      .collection('contacts')
      .where('tenantId', '==', 'pilot')
      .where('channel', '==', channel)
      .get();

    return respond({
      ok: true,
      data: {
        importedCount: importedSnap.size,
        pilotCount: pilotSnap.size,
      },
      requestId,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return respond({ ok: false, error: 'Unauthorized', requestId }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return respond({ ok: false, error: 'Forbidden', requestId }, { status: 403 });
    }
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
