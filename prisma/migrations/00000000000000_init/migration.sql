-- Prisma Migrate Migration
CREATE TABLE public."Tenant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "projectId" TEXT,
  "status" TEXT,
  "amount" NUMERIC,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "city" TEXT,
  "community" TEXT,
  "developer" TEXT,
  "priceMin" NUMERIC,
  "priceMax" NUMERIC,
  "rentalYield" NUMERIC,
  "sortScore" INTEGER,
  "firstPage" BOOLEAN,
  "imagesJson" JSONB,
  "dataJson" JSONB,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Campaign" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "utmSource" TEXT,
  "utmCampaign" TEXT,
  "spend" NUMERIC,
  "metaJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."Lead" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "projectId" TEXT,
  "name" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "source" TEXT,
  "utmJson" JSONB,
  "notes" TEXT,
  "status" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE public."UploadKind" AS ENUM ('brochure', 'image', 'logo');

CREATE TABLE public."Upload" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "kind" public."UploadKind" NOT NULL,
  "filename" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "size" INT NOT NULL,
  "url" TEXT NOT NULL,
  "projectId" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public."AgentTraining" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "projectId" TEXT,
  "uploadId" TEXT,
  "status" TEXT,
  "extractedJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public."User"
  ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Project"
  ADD CONSTRAINT "Project_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Order"
  ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Order"
  ADD CONSTRAINT "Order_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

ALTER TABLE public."Campaign"
  ADD CONSTRAINT "Campaign_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Lead"
  ADD CONSTRAINT "Lead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Lead"
  ADD CONSTRAINT "Lead_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

ALTER TABLE public."Upload"
  ADD CONSTRAINT "Upload_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."Upload"
  ADD CONSTRAINT "Upload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

ALTER TABLE public."AgentTraining"
  ADD CONSTRAINT "AgentTraining_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"("id") ON DELETE CASCADE;

ALTER TABLE public."AgentTraining"
  ADD CONSTRAINT "AgentTraining_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"("id") ON DELETE SET NULL;

ALTER TABLE public."AgentTraining"
  ADD CONSTRAINT "AgentTraining_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES public."Upload"("id") ON DELETE SET NULL;

CREATE UNIQUE INDEX "Project_tenantId_slug_key" ON public."Project" ("tenantId", "slug");
