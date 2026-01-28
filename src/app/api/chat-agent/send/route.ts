import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import type { DocumentSnapshot } from 'firebase-admin/firestore';
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

async function findConversationBySenderId(senderId: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection('instagram_conversations')
    .where('senderId', '==', senderId)
    .orderBy('updatedAt', 'desc')
    .limit(1)
    .get();
  return snapshot.docs[0] ?? null;
}

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

    const db = getAdminDb();
    const message = {
      role: 'assistant',
      text: String(text),
      timestamp: new Date(),
    };

    const doc = await findConversationBySenderId(senderId);
    let snapshot: DocumentSnapshot;
    if (!doc) {
      const ref = await db.collection('instagram_conversations').add({
        senderId,
        messages: [message],
        paused: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      snapshot = await ref.get();
    } else {
      await doc.ref.update({
        messages: FieldValue.arrayUnion(message),
        updatedAt: FieldValue.serverTimestamp(),
      });
      snapshot = await doc.ref.get();
    }

    const data: ChatConversationResponse = {
      conversation: normalizeConversation(snapshot.id, snapshot.data()),
    };

    return jsonWithRequestId(requestId, { ok: true, data, requestId });
  } catch (error) {
    console.error('[chat-agent] send error', error);
    return errorResponse(requestId, scope);
  }
}
