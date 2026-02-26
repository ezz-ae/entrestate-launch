export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import { getInstagramConversationBySenderId, setInstagramConversationPaused } from '@/server/repositories';

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/unpause';
  try {
    const body = await request.json().catch(() => ({}));
    const senderId = body?.senderId;
    if (!senderId) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'senderId is required', scope }, requestId },
        { status: 400 }
      );
    }

    const record = await getInstagramConversationBySenderId(senderId);
    if (!record) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'Conversation not found', scope }, requestId },
        { status: 404 }
      );
    }

    await setInstagramConversationPaused(senderId, false);

    return jsonWithRequestId(requestId, {
      ok: true,
      data: { senderId, paused: false },
      requestId,
    });
  } catch (error) {
    console.error('[chat-agent] unpause error', error);
    return errorResponse(requestId, scope);
  }
}
