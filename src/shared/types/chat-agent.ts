export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  text: string;
  timestamp: string;
};

export type ChatConversation = {
  id: string;
  senderId: string;
  updatedAt: string;
  messages: ChatMessage[];
  paused?: boolean;
};

export type ChatConversationsResponse = {
  items: ChatConversation[];
  nextCursor?: string | null;
};

export type ChatConversationResponse = {
  conversation: ChatConversation;
};
