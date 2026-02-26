export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  FeatureAccessError,
  featureAccessErrorResponse,
} from '@/lib/server/billing';
import { logError } from '@/lib/server/log';
import {
  createRequestId,
  errorResponse,
  jsonWithRequestId,
} from '@/lib/server/request-id';
import { prisma } from '@/server/db';

const payloadSchema = z.object({
  listType: z.enum(['imported', 'pilot']),
  goal: z.string().min(1),
  region: z.string().min(1),
  budget: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const scope = 'api/audience/request';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const record = await prisma.campaign.findFirst({
      where: { tenantId, platform: 'audience_request' },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return respond({ ok: true, data: { request: null }, requestId });
    }

    return respond({
      ok: true,
      data: { request: { id: record.id, ...(record.metaJson as Record<string, unknown>) } },
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

export async function POST(req: NextRequest) {
  const scope = 'api/audience/request';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const requestData = {
      listType: payload.listType,
      goal: payload.goal,
      region: payload.region,
      budget: payload.budget ?? null,
      notes: payload.notes ?? null,
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const record = await prisma.campaign.create({
      data: {
        tenantId,
        platform: 'audience_request',
        name: `${payload.goal} - ${payload.region}`.slice(0, 120),
        metaJson: requestData,
      },
    });

    return respond({
      ok: true,
      data: { request: { id: record.id, ...requestData } },
      requestId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond(
        { ok: false, error: 'Invalid payload', details: error.errors, requestId },
        { status: 400 }
      );
    }
    if (error instanceof FeatureAccessError) {
      return respond(
        { ok: false, requestId, ...featureAccessErrorResponse(error) },
        { status: 403 }
      );
    }
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
