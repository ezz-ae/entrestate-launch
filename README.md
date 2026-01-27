# Entrestate OS

This workspace contains the Entrestate OS marketing site, dashboard, API routes, and Firebase-powered backend services. The UI is already implemented, so day-to-day work focuses on wiring those surfaces to live data and integrations (Entrestate inventory ingestion, SendGrid, SMS, Google Ads, PayPal, Vercel domains, etc.).

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your environment file**

   Copy `.env.example` to `.env` (or `.env.local`) and provide the required credentials:

   ```bash
   cp .env.example .env
   ```

   The template includes every variable referenced in the codebase (Firebase, Gemini, SendGrid, SMS, PayPal, Ziina, Vercel, Meta, cron secret, etc.). Never commit populated env files or provider keys.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The Next.js app will boot on `http://localhost:3000` and talk to Firebase using the credentials you provided.

## Data Ingestion (Entrestate)

Run `scripts/ingest-entrestate.ts` with service-account credentials to keep the `inventory_projects` collection fresh:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json npx ts-node scripts/ingest-entrestate.ts
```

The script loads the curated dataset in `src/data/entrestate-inventory.ts` and stores normalized documents in Firestore. Trigger it manually or via Cloud Scheduler hitting a dedicated cron endpoint. During development the `/api/projects` endpoints automatically fall back to this dataset if Firestore is empty, ensuring the UI always renders a complete catalogue.

## Launch Readiness Checks

- `npm run lint` &mdash; Next.js + ESLint (`next/core-web-vitals`) with custom React rules disabled only where marketing copy would otherwise fail the build.
- `npm run smoke` &mdash; Runs a lightweight TypeScript script to validate the Entrestate dataset (queries by city, keyword, and price range) plus pagination safety before you push fresh inventory or depend on fallback data in production.
- `npm run test:env-safety` — Verifies Firebase/Supabase modules load even when public env vars are absent.
- `npm run test:vercel-env-sanity` — Reports boolean signals for the Vercel/Firebase/Supabase environment.
- `npm run test:supabase-chain` — Confirms the mock Supabase client honors `.ilike().order().range().limit()` chains.

## Secrets & Security Checklist

- Secrets must stay out of git. The repository ignores `.env*` and provider dumps such as `sendgrid.env` (rotated/removed).
- Firebase config is now read from environment variables—no more hardcoded keys in `src/firebase/config.ts`.
- The Facebook SDK bootstrap reads `NEXT_PUBLIC_FACEBOOK_APP_ID` before loading the script; omit this env var if you don’t want the SDK on a given deployment.
- Before shipping, update `firestore.rules` to the tenant-aware ruleset and deploy through the Firebase CLI.
- Dashboard-only API routes (e.g., `/api/leads/list`, `/api/sms/send`, `/api/email/send`, `/api/payments/*`, `/api/domains`) require a Firebase ID token via `Authorization: Bearer <idToken>`; fetch the token with `getIdToken()` on the client before calling these endpoints, and include the tenant ID when applicable.

## Production minimum env

Every production or preview deployment must expose the booleans reported by `/api/health/runtime`. At a minimum, make sure the following variables exist or evaluate to the expected truthy values before you ship:

- `ENABLE_FIREBASE_AUTH` (server) **and** `NEXT_PUBLIC_ENABLE_FIREBASE_AUTH` (public) are always defined as `true`/`false`.
- `FIREBASE_ADMIN_CREDENTIALS` **or** the trio `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` so Firebase Admin can bootstrap.
- Public Firebase config: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`.
- `NEXT_PUBLIC_SUPABASE_URL` plus either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` when any Supabase-backed API is enabled.
- `NEXT_PUBLIC_APP_URL` (the canonical hostname your deployment uses, e.g., `https://app.entrestate.com`).

## Next Steps

The immediate roadmap is captured in the planning notes (locking Firestore rules, wiring data ingestion, replacing client-side secret storage, making every dashboard module call a real backend). Use this README as a quick reference for environment setup while implementing those stages.

## Vercel Env Checklist

- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` &mdash; must all exist when `NEXT_PUBLIC_ENABLE_FIREBASE_AUTH` is `true`.
- `NEXT_PUBLIC_ENABLE_FIREBASE_AUTH` — flip to `false` to treat Firebase auth as disabled in public builds; the server still enforces `ENABLE_FIREBASE_AUTH` when running with admin creds.
- `FIREBASE_ADMIN_CREDENTIALS` **or** the trio `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` &mdash; required for every production/preview deployment so Firebase Admin can initialize.
- `NEXT_PUBLIC_SUPABASE_URL` plus either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` when Supabase-backed APIs are enabled; otherwise the mock client is used.
- `NEXT_PUBLIC_APP_URL` — keep site metadata and webhooks aligned between Preview and Production (this repo reads it when submitting forms or generating metadata).
- No root `proxy.ts` or `middleware.ts` files remain, so Vercel will never build a middleware lambda.

## Deployment via Git

1. Configure the Production and Preview environment variables listed above inside the Vercel dashboard and confirm the Firebase admin credentials are visible for both targets.
2. Push to `main` (or the linked production branch) and trigger a Clear Cache deploy so Vercel discards the cached middleware bundle before packaging the new build.
3. After the deployment completes, curl the health endpoints (see below) to confirm the runtime flags and Firebase connectivity.
4. For local sanity before pushing, run `npm run test:vercel-env-sanity` and `npm run test:supabase-chain` so the environment booleans update and the Supabase chain still resolves without the public keys.

## Health Endpoints

- `curl https://<your-deploy>/api/health` &mdash; verifies the admin SDK and Firestore connectivity.
- `curl https://<your-deploy>/api/health/env` &mdash; returns boolean flags for Firebase auth, Supabase configuration, and the Node/Vercel env.
- `curl https://<your-deploy>/api/auth/me` &mdash; confirms guest/dev/anonymous modes remain stable; authenticated clients should check `user?.uid`.
