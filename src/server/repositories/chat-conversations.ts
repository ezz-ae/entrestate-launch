import { prisma } from '@/server/db';
import type { ChatMessage } from '@/shared/types/chat-agent';

export type InstagramConversationRecord = {
  id: string;
  senderId: string;
  messages: ChatMessage[];
  paused: boolean;
  pausedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const normalizeMessages = (value: unknown): ChatMessage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const msg = item as { role?: string; text?: string; timestamp?: string };
      return {
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        text: String(msg.text ?? ''),
        timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date(0).toISOString(),
      };
    })
    .filter((msg) => msg.text.length > 0);
};

const toRecord = (row: {
  id: string;
  senderId: string;
  messages: unknown;
  paused: boolean;
  pausedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): InstagramConversationRecord => ({
  id: row.id,
  senderId: row.senderId,
  messages: normalizeMessages(row.messages),
  paused: row.paused,
  pausedAt: row.pausedAt,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export async function listInstagramConversations(limit: number, cursor?: string | null) {
  const rows = await prisma.instagramConversation.findMany({
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
  });
  return rows.map(toRecord);
}

export async function getInstagramConversationById(id: string) {
  const row = await prisma.instagramConversation.findUnique({ where: { id } });
  return row ? toRecord(row) : null;
}

export async function getInstagramConversationBySenderId(senderId: string) {
  const row = await prisma.instagramConversation.findUnique({ where: { senderId } });
  return row ? toRecord(row) : null;
}

export async function appendInstagramMessage(senderId: string, message: ChatMessage) {
  const existing = await prisma.instagramConversation.findUnique({ where: { senderId } });
  const nextMessages = existing ? normalizeMessages(existing.messages).concat(message) : [message];

  const row = await prisma.instagramConversation.upsert({
    where: { senderId },
    update: {
      messages: nextMessages,
      updatedAt: new Date(),
    },
    create: {
      senderId,
      messages: nextMessages,
      paused: false,
    },
  });

  return toRecord(row);
}

export async function setInstagramConversationPaused(senderId: string, paused: boolean) {
  const row = await prisma.instagramConversation.update({
    where: { senderId },
    data: {
      paused,
      pausedAt: paused ? new Date() : null,
    },
  });
  return toRecord(row);
}
