ALTER TABLE public."Lead"
  ADD COLUMN IF NOT EXISTS "emailNormalized" TEXT,
  ADD COLUMN IF NOT EXISTS "phoneNormalized" TEXT,
  ADD COLUMN IF NOT EXISTS "message" TEXT,
  ADD COLUMN IF NOT EXISTS "priority" TEXT,
  ADD COLUMN IF NOT EXISTS "touches" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "context" JSONB,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB,
  ADD COLUMN IF NOT EXISTS "intentScore" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "intentFocus" TEXT,
  ADD COLUMN IF NOT EXISTS "intentReasoning" TEXT,
  ADD COLUMN IF NOT EXISTS "intentProjectIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "intentNextAction" TEXT,
  ADD COLUMN IF NOT EXISTS "pipelineDecision" TEXT,
  ADD COLUMN IF NOT EXISTS "pipelineDecisionAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "pipelineDecisionReason" TEXT,
  ADD COLUMN IF NOT EXISTS "ignoredReason" TEXT;

CREATE INDEX IF NOT EXISTS "Lead_tenantId_createdAt_idx" ON public."Lead" ("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_emailNormalized_idx" ON public."Lead" ("emailNormalized");
CREATE INDEX IF NOT EXISTS "Lead_phoneNormalized_idx" ON public."Lead" ("phoneNormalized");

ALTER TABLE public."Tenant"
  ADD COLUMN IF NOT EXISTS "profileJson" JSONB;

CREATE TABLE IF NOT EXISTS public."Contact" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "name" TEXT,
  "source" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."Contact"
  ADD CONSTRAINT "Contact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "Contact_tenantId_channel_idx" ON public."Contact" ("tenantId", "channel");
CREATE INDEX IF NOT EXISTS "Contact_email_idx" ON public."Contact" ("email");
CREATE INDEX IF NOT EXISTS "Contact_phone_idx" ON public."Contact" ("phone");

CREATE TABLE IF NOT EXISTS public."InventoryItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "dataJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."InventoryItem"
  ADD CONSTRAINT "InventoryItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "InventoryItem_tenantId_createdAt_idx" ON public."InventoryItem" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."ProjectDraft" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "ownerUid" TEXT,
  "projectId" TEXT,
  "status" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "prompt" TEXT,
  "source" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."ProjectDraft"
  ADD CONSTRAINT "ProjectDraft_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;
ALTER TABLE public."ProjectDraft"
  ADD CONSTRAINT "ProjectDraft_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "ProjectDraft_tenantId_createdAt_idx" ON public."ProjectDraft" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."AdsBlueprint" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "siteId" TEXT,
  "dataJson" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsBlueprint"
  ADD CONSTRAINT "AdsBlueprint_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "AdsBlueprint_tenantId_createdAt_idx" ON public."AdsBlueprint" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."AdsCampaign" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "dataJson" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsCampaign"
  ADD CONSTRAINT "AdsCampaign_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "AdsCampaign_tenantId_createdAt_idx" ON public."AdsCampaign" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."AdsDeployment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "campaignId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payload" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsDeployment"
  ADD CONSTRAINT "AdsDeployment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."AdsCampaign"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "AdsDeployment_campaignId_createdAt_idx" ON public."AdsDeployment" ("campaignId", "createdAt");

CREATE TABLE IF NOT EXISTS public."AdsReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "campaignId" TEXT NOT NULL,
  "dateId" TEXT NOT NULL,
  "dataJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsReport"
  ADD CONSTRAINT "AdsReport_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."AdsCampaign"("id") ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS "AdsReport_campaignId_dateId_key" ON public."AdsReport" ("campaignId", "dateId");

CREATE TABLE IF NOT EXISTS public."AdsLearningSignal" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "dataJson" JSONB NOT NULL,
  "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsLearningSignal"
  ADD CONSTRAINT "AdsLearningSignal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."AdsLearningSignal"
  ADD CONSTRAINT "AdsLearningSignal_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."AdsCampaign"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "AdsLearningSignal_tenantId_recordedAt_idx" ON public."AdsLearningSignal" ("tenantId", "recordedAt");

CREATE TABLE IF NOT EXISTS public."AdsRefinerRun" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "result" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."AdsRefinerRun"
  ADD CONSTRAINT "AdsRefinerRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "AdsRefinerRun_tenantId_createdAt_idx" ON public."AdsRefinerRun" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."Wallet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL UNIQUE,
  "balance" NUMERIC NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."Wallet"
  ADD CONSTRAINT "Wallet_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public."WalletTransaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "walletId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "amount" NUMERIC NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."WalletTransaction"
  ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public."Wallet"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "WalletTransaction_walletId_createdAt_idx" ON public."WalletTransaction" ("walletId", "createdAt");

CREATE TABLE IF NOT EXISTS public."TeamInvite" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "invitedBy" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."TeamInvite"
  ADD CONSTRAINT "TeamInvite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "TeamInvite_tenantId_createdAt_idx" ON public."TeamInvite" ("tenantId", "createdAt");

CREATE TABLE IF NOT EXISTS public."ProjectAction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "projectId" TEXT,
  "type" TEXT NOT NULL,
  "text" TEXT,
  "payload" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."ProjectAction"
  ADD CONSTRAINT "ProjectAction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;
ALTER TABLE public."ProjectAction"
  ADD CONSTRAINT "ProjectAction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "ProjectAction_tenantId_createdAt_idx" ON public."ProjectAction" ("tenantId", "createdAt");
