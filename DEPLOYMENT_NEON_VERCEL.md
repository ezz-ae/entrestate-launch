# Deploying with Neon + Vercel

1. **Provision Neon.** Create a Postgres database on Neon (or another serverless-compatible provider) and copy the connection string (`DATABASE_URL`). This repo expects Prisma migrations under `prisma/migrations/00000000000000_init`, so run `npx prisma migrate deploy` after setting `DATABASE_URL`.
2. **Configure Vercel env vars.** Set the following environment variables in each Vercel scope (Preview/Production):
   - `DATABASE_URL` (Neon connection string).
   - `NEXTAUTH_URL` (e.g. `https://app.entrestate.com`).
   - `NEXTAUTH_SECRET` (32+ character secret for NextAuth tokens).
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob write token or equivalent if using S3/R2).
   - Existing Firebase variables (`NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_*`) remain for phase 1 compatibility.
   - Feature flags: set `USE_NEON=true` once the Neon data is populated; leave `ENABLE_FIREBASE_AUTH` on during the transition unless auth is fully replaced.
3. **NextAuth configuration.** This migration introduces a credentials-based NextAuth flow. Ensure `NEXTAUTH_URL`/`NEXTAUTH_SECRET` are set and do not expose `NEXTAUTH_SECRET` to client bundles.
4. **Vercel Blob storage.** Use `BLOB_READ_WRITE_TOKEN` to upload assets (brochures, images) via Vercel Blob API. Store the returned URLs in Postgres via the uploads repository.
5. **Secret rotation & security.** Keep Firebase admin credentials for now (phase 1 parallel run). Remove them only after all routes are fully migrated and Neon is the single source of truth.

After deployment, confirm that `next build` passes, `/dashboard` works with the admin auth flow, projects/leads are served from Neon (`USE_NEON=true`), and brochure uploads return Vercel Blob URLs.
