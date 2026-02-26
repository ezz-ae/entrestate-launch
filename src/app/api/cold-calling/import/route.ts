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
import { normalizeEmail, normalizePhone } from '@/lib/server/lead-dedupe';
import { prisma } from '@/server/db';

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

    const leads = await prisma.lead.findMany({
      where: {
        tenantId,
        NOT: { source: 'cold_call' },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    let imported = 0;
    let skipped = 0;
    const seenPhones = new Set<string>();

    for (const lead of leads) {
      const phoneNormalized = normalizePhone(lead.phone);
      if (!phoneNormalized) {
        skipped += 1;
        continue;
      }
      if (seenPhones.has(phoneNormalized)) {
        skipped += 1;
        continue;
      }
      seenPhones.add(phoneNormalized);

      const emailNormalized = normalizeEmail(lead.email);
      const recordId = `coldcall_${lead.id}`;
      const existing = await prisma.lead.findUnique({ where: { id: recordId } });
      const existingMeta = (existing?.metadata as Record<string, any> | null) || {};
      const coldCallMeta = {
        ...(existingMeta.coldCall || {}),
        sourceLeadId: lead.id,
        unwelcomedCalls: existingMeta.coldCall?.unwelcomedCalls || 0,
        lastOutcome: existingMeta.coldCall?.lastOutcome || null,
        lastOutcomeAt: existingMeta.coldCall?.lastOutcomeAt || null,
      };
      const metadata = { ...existingMeta, coldCall: coldCallMeta };

      if (existing) {
        await prisma.lead.update({
          where: { id: recordId },
          data: {
            name: lead.name || null,
            email: lead.email || null,
            emailNormalized,
            phone: lead.phone || null,
            phoneNormalized,
            status: existing.status || 'active',
            metadata,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.lead.create({
          data: {
            id: recordId,
            tenantId,
            name: lead.name || null,
            email: lead.email || null,
            emailNormalized,
            phone: lead.phone || null,
            phoneNormalized,
            status: 'active',
            source: 'cold_call',
            metadata,
          },
        });
      }

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
