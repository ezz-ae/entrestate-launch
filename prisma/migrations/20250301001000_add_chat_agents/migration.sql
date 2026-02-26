-- Adds chat agent tables to Neon (Supabase-specific policies/triggers excluded).

CREATE TABLE IF NOT EXISTS public."ChatAgent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "companyName" TEXT,
  "style" TEXT,
  "systemPrompt" TEXT,
  "profile" JSONB,
  "listings" JSONB,
  "tools" JSONB,
  "contact" JSONB,
  "constraints" JSONB,
  "fileUrls" TEXT[] NOT NULL DEFAULT '{}',
  "state" TEXT NOT NULL DEFAULT 'draft',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."AgentMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agentId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."AgentVersion" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agentId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "systemPrompt" TEXT,
  "profile" JSONB,
  "listings" JSONB,
  "constraints" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."LoginToken" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."ChatAgent"
  ADD CONSTRAINT "ChatAgent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE;

ALTER TABLE public."ChatAgent"
  ADD CONSTRAINT "ChatAgent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE SET NULL;

ALTER TABLE public."AgentMessage"
  ADD CONSTRAINT "AgentMessage_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."ChatAgent"("id") ON DELETE CASCADE;

ALTER TABLE public."AgentVersion"
  ADD CONSTRAINT "AgentVersion_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."ChatAgent"("id") ON DELETE CASCADE;

ALTER TABLE public."LoginToken"
  ADD CONSTRAINT "LoginToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE;

CREATE UNIQUE INDEX "ChatAgent_userId_name_key" ON public."ChatAgent" ("userId", "name");
CREATE INDEX "AgentMessage_agentId_createdAt_idx" ON public."AgentMessage" ("agentId", "createdAt");
