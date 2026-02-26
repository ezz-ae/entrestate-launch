CREATE TABLE IF NOT EXISTS public."ShareLink" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."ShareLink"
  ADD CONSTRAINT "ShareLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "ShareLink_projectId_idx" ON public."ShareLink" ("projectId");
