import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { createRequestId, errorResponse, jsonWithRequestId } from '@/lib/server/request-id';

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
  const scope = 'api/chat-agent/pause';
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

    const doc = await findConversationBySenderId(senderId);
    if (!doc) {
      return jsonWithRequestId(
        requestId,
        { ok: false, error: { message: 'Conversation not found', scope }, requestId },
        { status: 404 }
      );
    }

    await doc.ref.update({ paused: true, pausedAt: FieldValue.serverTimestamp() });

    return jsonWithRequestId(requestId, {
      ok: true,
      data: { senderId, paused: true },
      requestId,
    });
  } catch (error) {
    console.error('[chat-agent] pause error', error);
    return errorResponse(requestId, scope);
  }
}
