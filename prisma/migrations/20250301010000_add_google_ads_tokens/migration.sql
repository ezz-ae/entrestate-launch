ALTER TABLE public."Tenant"
  ADD COLUMN IF NOT EXISTS "googleAdsTokens" JSONB;
