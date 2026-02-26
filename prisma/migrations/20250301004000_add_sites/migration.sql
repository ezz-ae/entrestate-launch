CREATE TABLE IF NOT EXISTS public."Site" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT,
  "ownerUid" TEXT,
  "title" TEXT,
  "subdomain" TEXT,
  "customDomain" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "publishedUrl" TEXT,
  "status" TEXT,
  "dataJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "lastPublishedAt" TIMESTAMPTZ
);

ALTER TABLE public."Site"
  ADD CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Site_tenantId_idx" ON public."Site" ("tenantId");
CREATE INDEX IF NOT EXISTS "Site_ownerUid_idx" ON public."Site" ("ownerUid");
CREATE INDEX IF NOT EXISTS "Site_subdomain_idx" ON public."Site" ("subdomain");
CREATE INDEX IF NOT EXISTS "Site_customDomain_idx" ON public."Site" ("customDomain");
