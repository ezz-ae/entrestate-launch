export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
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
import { normalizeEmail, normalizePhone } from '@/lib/server/lead-dedupe';

const MAX_IMPORT = 100;

const requestSchema = z.object({
  limit: z.number().min(1).max(MAX_IMPORT).optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/cold-calling/import';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json().catch(() => ({})));
    const limit = payload.limit ?? MAX_IMPORT;
    const db = getAdminDb();

    const leadSnap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    let imported = 0;
    let skipped = 0;
    const seenPhones = new Set<string>();

    for (const doc of leadSnap.docs) {
      const data = doc.data();
      const phoneNormalized = normalizePhone(data.phone);
      if (!phoneNormalized) {
        skipped += 1;
        continue;
      }
      if (seenPhones.has(phoneNormalized)) {
        skipped += 1;
        continue;
      }
      seenPhones.add(phoneNormalized);

      const emailNormalized = normalizeEmail(data.email);
      const recordId = `lead-${doc.id}`;
      const recordRef = db
        .collection('tenants')
        .doc(tenantId)
        .collection('cold_call_leads')
        .doc(recordId);

      const recordSnap = await recordRef.get();
      const existing = recordSnap.exists ? recordSnap.data() : null;

      await recordRef.set(
        {
          id: recordId,
          sourceLeadId: doc.id,
          name: data.name || data.fullName || null,
          email: data.email || null,
          emailNormalized,
          phone: data.phone || null,
          phoneNormalized,
          status: existing?.status || 'active',
          unwelcomedCalls: existing?.unwelcomedCalls || 0,
          lastOutcome: existing?.lastOutcome || null,
          lastOutcomeAt: existing?.lastOutcomeAt || null,
          createdAt: existing?.createdAt || data.createdAt || FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      imported += 1;
    }

    return respond({
      ok: true,
      data: { imported, skipped, limit },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}
