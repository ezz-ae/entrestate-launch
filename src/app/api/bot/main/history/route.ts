export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { logError } from '@/lib/server/log';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { prisma } from '@/server/db';

export async function GET(req: NextRequest) {
  const scope = 'api/bot/main/history';
  const requestId = createRequestId();
  const path = req.url;
  const respond = (body: unknown, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);

  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const sessions = await prisma.chatSession.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });
    const threads = sessions.map((session) => ({
      id: session.id,
      updatedAt: session.updatedAt,
      conversation: session.conversation || [],
    }));
    return respond({ ok: true, data: { threads }, requestId });
  } catch (error) {
    logError(scope, error, { url: path, requestId });
    return errorResponse(requestId, scope);
  }
}
