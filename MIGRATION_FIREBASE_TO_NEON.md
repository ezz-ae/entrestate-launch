# Migration Plan (Firebase → Neon)

## Phase 1 — Parallel run

1. **Add Prisma + migrations** (done via `prisma/schema.prisma` and `prisma/migrations/00000000000000_init`).
2. **Seed Neon**: run `npm run seed:neon` after setting `DATABASE_URL`. This creates a dev tenant, admin user, and demo projects/leads/campaigns.
3. **Keep Firebase as fallback**: Firestore remains available. Route handlers should eventually use the new repositories (`src/server/repositories/*`), but until every path is updated, `USE_NEON=false` keeps the old behavior.
4. **Feature flag**: set `USE_NEON=true` only after Neon reads are verified. Otherwise, the app keeps reading from Firebase.

## Phase 2 — Data migration

1. **Run the migration script**: `npm run migrate:firebase-to-neon`. It walks all tenants and copies `inventory`, `leads`, `campaigns`, `agent_training`, and `uploads` subcollections into Neon. The script upserts records by ID/slugs to make it re-runnable.
2. **Verify Neon data**: confirm records appear in the new tables (`projects`, `leads`, `campaigns`, `uploads`, `agent_training`). Use Neon studio or `prisma studio`.
3. **Enable USE_NEON** in your environment once you are confident the data is healthy.

## Phase 3 — Cutover and cleanup

1. **Update all server routes/actions** to import the repository helpers instead of `@/server/firebase-admin`. Each repository centrally controls Neon reads/writes (`projects`, `leads`, `campaigns`, `uploads`, `agents`, `orders`).
2. **Remove Firebase Admin dependency** after every route exclusively uses Neon.
3. **Drop Firebase configs** and service account from repos after smoke tests pass.

## Rollback plan

- If Neon reads fail, set `USE_NEON=false` (or leave it unset) to revert to Firestore instantly.
- Keep Firebase env vars/config live until you confirm Neon has parity.
- Abort migration by stopping `USE_NEON` writes; you can re-run `migrate:firebase-to-neon` after fixing data issues.
