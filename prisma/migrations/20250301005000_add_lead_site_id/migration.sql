ALTER TABLE public."Lead"
  ADD COLUMN IF NOT EXISTS "siteId" TEXT;

CREATE INDEX IF NOT EXISTS "Lead_siteId_idx" ON public."Lead" ("siteId");
