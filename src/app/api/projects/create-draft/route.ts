export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { prisma } from '@/server/db';

const CLAMP = (value?: string, fallback = 'Untitled Project'): string =>
  (value?.trim()?.slice(0, 100) || fallback);

export async function POST(req: NextRequest) {
  const scope = 'api/projects/create-draft';
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);
    const body = await req.json().catch(() => ({}));
    const now = new Date().toISOString();
    const draft = await prisma.projectDraft.create({
      data: {
        tenantId,
        ownerUid: uid || null,
        status: 'draft',
        title: CLAMP(body?.title || body?.prompt),
        prompt: body?.prompt || null,
        source: body?.source || null,
      },
    });

    console.log(
      JSON.stringify({
        event: 'builder.start',
        tenantId,
        draftId: draft.id,
        source: body?.source || null,
        requestId,
      })
    );

    return respond(
      {
        ok: true,
        data: {
          draftId: draft.id,
          draft: {
            ...draft,
            owner: tenantId,
            createdAt: draft.createdAt.toISOString(),
            updatedAt: draft.updatedAt.toISOString(),
          },
        },
        requestId,
      }
    );
  } catch (error) {
    logError(scope, error, { requestId });
    return errorResponse(requestId, scope);
  }
}
