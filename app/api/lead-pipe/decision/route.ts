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

const requestSchema = z.object({
  leadId: z.string().min(1),
  decision: z.enum(['accept', 'reject']),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const scope = 'api/lead-pipe/decision';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = requestSchema.parse(await req.json());
    const db = getAdminDb();
    const leadId = payload.leadId.replace(/^lead:/, '');
    const leadRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .doc(leadId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return respond(
        {
          ok: false,
          error: { code: 'not_found', message: 'Lead not found.' },
          requestId,
        },
        { status: 404 }
      );
    }

    const rejected = payload.decision === 'reject';
    await leadRef.set(
      {
        pipelineDecision: payload.decision,
        pipelineDecisionAt: FieldValue.serverTimestamp(),
        pipelineDecisionReason: payload.reason || null,
        status: rejected ? 'ignored' : 'active',
        ignoredReason: rejected
          ? payload.reason || 'Rejected from pipeline.'
          : null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return respond({
      ok: true,
      data: { leadId, decision: payload.decision },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    if (error instanceof z.ZodError) {
      return respond(
        {
          ok: false,
          error: {
            code: 'invalid_payload',
            message: 'Invalid payload',
            details: error.errors,
          },
          requestId,
        },
        { status: 400 }
      );
    }
    return errorResponse(requestId, scope);
  }
}
