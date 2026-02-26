export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import type { ChatConversationResponse } from '@/shared/types/chat-agent';
import { getInstagramConversationById } from '@/server/repositories';

export async function GET(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/conversation';
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'id is required', scope }, requestId },
        { status: 400 }
      );
    }

    const record = await getInstagramConversationById(id);
    if (!record) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'Conversation not found', scope }, requestId },
        { status: 404 }
      );
    }

    const data: ChatConversationResponse = {
      conversation: {
        id: record.id,
        senderId: record.senderId,
        updatedAt: record.updatedAt.toISOString(),
        paused: record.paused,
        messages: record.messages,
      },
    };

    return jsonWithRequestId(requestId, { ok: true, data, requestId });
  } catch (error) {
    console.error('[chat-agent] conversation error', error);
    return errorResponse(requestId, scope);
  }
}
