ALTER TABLE public."Tenant"
  ADD COLUMN IF NOT EXISTS "brandKit" JSONB;

CREATE TABLE IF NOT EXISTS public."ChatSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "projectId" TEXT,
  "humanTakeover" BOOLEAN NOT NULL DEFAULT false,
  "conversation" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."ChatSession"
  ADD CONSTRAINT "ChatSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "ChatSession_tenantId_projectId_idx" ON public."ChatSession" ("tenantId", "projectId");
