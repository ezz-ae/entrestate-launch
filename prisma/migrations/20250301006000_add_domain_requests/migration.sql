CREATE TABLE IF NOT EXISTS public."DomainRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "siteId" TEXT,
  "status" TEXT NOT NULL,
  "requestedBy" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."DomainRequest"
  ADD CONSTRAINT "DomainRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "DomainRequest_tenantId_createdAt_idx" ON public."DomainRequest" ("tenantId", "createdAt");
