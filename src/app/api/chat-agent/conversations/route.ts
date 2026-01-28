import { NextRequest } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';
import type { ChatConversation, ChatConversationsResponse } from '@/shared/types/chat-agent';

function toIso(value: any) {
  if (!value) return new Date(0).toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(0).toISOString();
}

function normalizeConversation(id: string, data: any): ChatConversation {
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
  const scope = 'api/chat-agent/conversations';
  try {
    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get('limit') || 20);
    const limit = Math.max(1, Math.min(50, Number.isFinite(limitParam) ? limitParam : 20));
    const cursor = url.searchParams.get('cursor');
    const db = getAdminDb();
    let query = db.collection('instagram_conversations').orderBy('updatedAt', 'desc').limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection('instagram_conversations').doc(cursor).get();
      if (!cursorDoc.exists) {
        return jsonWithRequestId(
          requestId,
          { ok: false, error: { message: 'Cursor not found', scope }, requestId },
          { status: 400 }
        );
      }
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => normalizeConversation(doc.id, doc.data()));
    const nextCursor = snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1].id : null;

    const data: ChatConversationsResponse = { items, nextCursor };
    return jsonWithRequestId(requestId, { ok: true, data, requestId });
  } catch (error) {
    console.error('[chat-agent] conversations error', error);
    return errorResponse(requestId, scope);
  }
}
