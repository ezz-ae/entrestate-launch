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

const outcomeSchema = z.object({
  coldCallId: z.string().min(1),
  outcome: z.enum(['connected', 'no_answer', 'call_back', 'unwelcomed', 'wrong_number']),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/cold-calling/outcome';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = outcomeSchema.parse(await req.json());
    const db = getAdminDb();
    const leadRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('cold_call_leads')
      .doc(payload.coldCallId);

    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return respond(
        { ok: false, error: 'Cold call lead not found', requestId },
        { status: 404 }
      );
    }

    const lead = leadSnap.data() || {};
    const currentUnwelcomed = Number(lead.unwelcomedCalls || 0);
    const nextUnwelcomed =
      payload.outcome === 'unwelcomed' ? currentUnwelcomed + 1 : currentUnwelcomed;
    const ignored = nextUnwelcomed >= 5;

    await leadRef.set(
      {
        lastOutcome: payload.outcome,
        lastOutcomeAt: FieldValue.serverTimestamp(),
        notes: payload.notes || null,
        touches: FieldValue.increment(1),
        unwelcomedCalls: nextUnwelcomed,
        status: ignored ? 'ignored' : lead.status || 'active',
        ignoredReason: ignored
          ? 'Marked ignored after 5 unwelcome calls.'
          : lead.ignoredReason || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return respond({
      ok: true,
      data: {
        coldCallId: payload.coldCallId,
        status: ignored ? 'ignored' : lead.status || 'active',
        unwelcomedCalls: nextUnwelcomed,
      },
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
