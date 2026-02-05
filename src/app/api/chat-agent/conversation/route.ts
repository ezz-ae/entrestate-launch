export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import type { ChatConversationResponse } from '@/shared/types/chat-agent';

function toIso(value: any) {
  if (!value) return new Date(0).toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(0).toISOString();
}

function normalizeConversation(id: string, data: any) {
  const messages = Array.isArray(data?.messages) ? data.messages : [];
  return {
    id,
    senderId: data?.senderId || 'unknown',
    updatedAt: toIso(data?.updatedAt),
    paused: Boolean(data?.paused),
    messages: messages
      .filter((msg: any) => msg && msg.text)
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        text: String(msg.text ?? ''),
        timestamp: toIso(msg.timestamp),
      })),
  };
}

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

    const db = getAdminDb();
    const doc = await db.collection('instagram_conversations').doc(id).get();
    if (!doc.exists) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'Conversation not found', scope }, requestId },
        { status: 404 }
      );
    }

    const data: ChatConversationResponse = {
      conversation: normalizeConversation(doc.id, doc.data()),
    };

    return jsonWithRequestId(requestId, { ok: true, data, requestId });
  } catch (error) {
    console.error('[chat-agent] conversation error', error);
    return errorResponse(requestId, scope);
  }
}
