export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import type { ChatConversation, ChatConversationsResponse } from '@/shared/types/chat-agent';
import { getInstagramConversationById, listInstagramConversations } from '@/server/repositories';

export async function GET(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/conversations';
  try {
    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get('limit') || 20);
    const limit = Math.max(1, Math.min(50, Number.isFinite(limitParam) ? limitParam : 20));
    const cursor = url.searchParams.get('cursor');
    if (cursor) {
      const cursorExists = await getInstagramConversationById(cursor);
      if (!cursorExists) {
        return jsonWithRequestId(
          requestId,
          { ok: false, error: { message: 'Cursor not found', scope }, requestId },
          { status: 400 }
        );
      }
    }

    const rows = await listInstagramConversations(limit, cursor);
    const items: ChatConversation[] = rows.map((row) => ({
      id: row.id,
      senderId: row.senderId,
      updatedAt: row.updatedAt.toISOString(),
      paused: row.paused,
      messages: row.messages,
    }));
    const nextCursor = rows.length ? rows[rows.length - 1].id : null;

    const data: ChatConversationsResponse = { items, nextCursor };
    return jsonWithRequestId(requestId, { ok: true, data, requestId });
  } catch (error) {
    console.error('[chat-agent] conversations error', error);
    return errorResponse(requestId, scope);
  }
}
