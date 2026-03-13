-- CreateTable
CREATE TABLE "MarketingSiteConfig" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingSiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingProduct" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "badge" TEXT,
    "priceLabel" TEXT NOT NULL,
    "priceNote" TEXT,
    "highlights" JSONB NOT NULL,
    "deliverables" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "outcomes" JSONB NOT NULL,
    "heroImage" TEXT NOT NULL,
    "demoUrl" TEXT,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingBlogPost" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingBlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingLogo" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingLogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingSiteConfig_key_key" ON "MarketingSiteConfig"("key");

-- CreateIndex
CREATE INDEX "MarketingSiteConfig_tenantId_idx" ON "MarketingSiteConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingProduct_slug_key" ON "MarketingProduct"("slug");

-- CreateIndex
CREATE INDEX "MarketingProduct_tenantId_sortOrder_idx" ON "MarketingProduct"("tenantId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingBlogPost_slug_key" ON "MarketingBlogPost"("slug");

-- CreateIndex
CREATE INDEX "MarketingBlogPost_tenantId_publishedAt_idx" ON "MarketingBlogPost"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "MarketingLogo_tenantId_row_sortOrder_idx" ON "MarketingLogo"("tenantId", "row", "sortOrder");

