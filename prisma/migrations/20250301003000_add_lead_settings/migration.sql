CREATE TABLE IF NOT EXISTS public."LeadSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL UNIQUE,
  "notificationEmail" TEXT,
  "crmWebhookUrl" TEXT,
  "crmProvider" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."LeadSetting"
  ADD CONSTRAINT "LeadSetting_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;
