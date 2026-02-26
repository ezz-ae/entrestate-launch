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
    const lead = await prisma.lead.findFirst({
      where: { id: payload.coldCallId, tenantId },
    });
    if (!lead) {
      return respond(
        { ok: false, error: 'Cold call lead not found', requestId },
        { status: 404 }
      );
    }

    const meta = (lead.metadata as Record<string, any> | null) || {};
    const coldCall = meta.coldCall || {};
    const currentUnwelcomed = Number(coldCall.unwelcomedCalls || 0);
    const nextUnwelcomed =
      payload.outcome === 'unwelcomed' ? currentUnwelcomed + 1 : currentUnwelcomed;
    const ignored = nextUnwelcomed >= 5;

    const nextMetadata = {
      ...meta,
      coldCall: {
        ...coldCall,
        lastOutcome: payload.outcome,
        lastOutcomeAt: new Date().toISOString(),
        notes: payload.notes || null,
        unwelcomedCalls: nextUnwelcomed,
      },
    };

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: ignored ? 'ignored' : lead.status || 'active',
        ignoredReason: ignored ? 'Marked ignored after 5 unwelcome calls.' : lead.ignoredReason || null,
        touches: { increment: 1 },
        metadata: nextMetadata,
        updatedAt: new Date(),
      },
    });

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
