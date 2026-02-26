ALTER TABLE public."Job"
  ADD COLUMN IF NOT EXISTS "ownerUid" TEXT;

CREATE INDEX IF NOT EXISTS "Job_ownerUid_idx" ON public."Job" ("ownerUid");
