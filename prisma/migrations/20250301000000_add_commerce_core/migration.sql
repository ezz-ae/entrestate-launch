-- Adds commerce + workspace tables to match current Prisma schema.

ALTER TABLE public."Tenant"
  ADD COLUMN "email" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE public."UserTenant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."Order"
  ADD COLUMN "productId" TEXT,
  ALTER COLUMN "status" SET DEFAULT 'pending_payment',
  ADD COLUMN "currency" TEXT DEFAULT 'AED',
  ADD COLUMN "customerEmail" TEXT,
  ADD COLUMN "customerPhone" TEXT,
  ADD COLUMN "metaJson" JSONB,
  ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public."Lead"
  ADD COLUMN "orderId" TEXT,
  ADD COLUMN "deploymentId" TEXT;

CREATE TABLE public."Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AED',
  "price" INTEGER NOT NULL,
  "fulfillmentSlaHours" INTEGER NOT NULL DEFAULT 24,
  "fulfillmentType" TEXT NOT NULL,
  "includesJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerRef" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "amount" NUMERIC,
  "currency" TEXT DEFAULT 'AED',
  "rawWebhook" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Entitlement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT,
  "productId" TEXT,
  "key" TEXT NOT NULL,
  "valueJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Deployment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'created',
  "previewUrl" TEXT,
  "liveUrl" TEXT,
  "templateRef" TEXT,
  "brandKitJson" JSONB,
  "intakeJson" JSONB,
  "siteDocJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."EditRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "deploymentId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'drafting',
  "rawText" TEXT,
  "compiledTasks" JSONB,
  "inputsJson" JSONB,
  "submittedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Job" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT,
  "deploymentId" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 3,
  "payload" JSONB,
  "result" JSONB,
  "error" TEXT,
  "lockedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."UserTenant"
  ADD CONSTRAINT "UserTenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE;

ALTER TABLE public."UserTenant"
  ADD CONSTRAINT "UserTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Product"
  ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE SET NULL;

ALTER TABLE public."Order"
  ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"("id") ON DELETE SET NULL;

ALTER TABLE public."Payment"
  ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Payment"
  ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE CASCADE;

ALTER TABLE public."Entitlement"
  ADD CONSTRAINT "Entitlement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Entitlement"
  ADD CONSTRAINT "Entitlement_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE SET NULL;

ALTER TABLE public."Entitlement"
  ADD CONSTRAINT "Entitlement_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"("id") ON DELETE SET NULL;

ALTER TABLE public."Deployment"
  ADD CONSTRAINT "Deployment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Deployment"
  ADD CONSTRAINT "Deployment_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"("id") ON DELETE CASCADE;

ALTER TABLE public."Deployment"
  ADD CONSTRAINT "Deployment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE CASCADE;

ALTER TABLE public."EditRequest"
  ADD CONSTRAINT "EditRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."EditRequest"
  ADD CONSTRAINT "EditRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE CASCADE;

ALTER TABLE public."EditRequest"
  ADD CONSTRAINT "EditRequest_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES public."Deployment"("id") ON DELETE CASCADE;

ALTER TABLE public."Job"
  ADD CONSTRAINT "Job_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Job"
  ADD CONSTRAINT "Job_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE SET NULL;

ALTER TABLE public."Job"
  ADD CONSTRAINT "Job_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES public."Deployment"("id") ON DELETE SET NULL;

ALTER TABLE public."Lead"
  ADD CONSTRAINT "Lead_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"("id") ON DELETE SET NULL;

ALTER TABLE public."Lead"
  ADD CONSTRAINT "Lead_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES public."Deployment"("id") ON DELETE SET NULL;

CREATE UNIQUE INDEX "UserTenant_userId_tenantId_key" ON public."UserTenant" ("userId", "tenantId");
CREATE UNIQUE INDEX "Payment_provider_providerRef_key" ON public."Payment" ("provider", "providerRef");
CREATE INDEX "Entitlement_tenantId_key_idx" ON public."Entitlement" ("tenantId", "key");
CREATE INDEX "Job_status_createdAt_idx" ON public."Job" ("status", "createdAt");
