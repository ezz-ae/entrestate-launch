export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import type { ChatConversationResponse } from '@/shared/types/chat-agent';
import { appendInstagramMessage } from '@/server/repositories';

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const scope = 'api/chat-agent/send';
  try {
    const body = await request.json().catch(() => ({}));
    const senderId = body?.senderId;
    const text = body?.text;
    if (!senderId || !text) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'senderId and text are required', scope }, requestId },
        { status: 400 }
      );
    }

    const message = {
      role: 'assistant',
      text: String(text),
      timestamp: new Date().toISOString(),
    };
    const record = await appendInstagramMessage(senderId, message);

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
    console.error('[chat-agent] send error', error);
    return errorResponse(requestId, scope);
  }
}
