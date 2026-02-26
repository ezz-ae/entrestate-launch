export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { prisma } from '@/server/db';

const MAX_RESULTS = 100;

export async function GET(req: NextRequest) {
  const scope = 'api/cold-calling/list';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const leads = await prisma.lead.findMany({
      where: { tenantId, source: 'cold_call' },
      orderBy: { updatedAt: 'desc' },
      take: MAX_RESULTS,
    });

    const items = leads.map((lead) => {
      const meta = (lead.metadata as Record<string, any> | null) || {};
      const coldCall = meta.coldCall || {};
      return {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        status: lead.status,
        lastOutcome: coldCall.lastOutcome || null,
        unwelcomedCalls: coldCall.unwelcomedCalls || 0,
        ignoredReason: lead.ignoredReason || null,
        updatedAt: lead.updatedAt?.toISOString?.() || null,
      };
    });
    const ignoredCount = items.filter((item) => item.status === 'ignored').length;

    return respond({
      ok: true,
      data: {
        items,
        returnedCount: items.length,
        ignoredCount,
      },
      requestId,
    });
  } catch (error) {
    logError(scope, error, { requestId, path: req.url });
    return errorResponse(requestId, scope);
  }
}
