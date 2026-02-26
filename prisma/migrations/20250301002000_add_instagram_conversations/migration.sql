CREATE TABLE IF NOT EXISTS public."InstagramConversation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "senderId" TEXT NOT NULL UNIQUE,
  "messages" JSONB,
  "paused" BOOLEAN NOT NULL DEFAULT false,
  "pausedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "InstagramConversation_updatedAt_idx"
  ON public."InstagramConversation" ("updatedAt");
