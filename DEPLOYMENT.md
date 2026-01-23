# Entrestate Deployment Runbook

## Vercel baseline
1. Link the repo to a new Vercel project that uses `npm install` (or `npm ci`) and `npm run build` as the build command. The `vercel.json` already pins the `npm` lifecycle hooks and expects Node 20.x—match that runtime in the project settings.
2. Keep `NEXT_PUBLIC_ENABLE_FIREBASE_AUTH` and other `NEXT_PUBLIC_*` keys in Vercel’s environment settings; they are derived from `ENABLE_FIREBASE_AUTH` via `next.config.mjs`.
3. Use `ENV_FILE=<path> ts-node --esm scripts/deploy/verify_env.ts` (e.g. `.env.production` or `.env.preview`) before deployments to ensure the minimal set plus any gated integrations are configured.

## First Launch (Vercel + Firestore)
1. Copy the six `NEXT_PUBLIC_FIREBASE_*` values and `NEXT_PUBLIC_APP_URL` from the Firebase console (Project Settings → General → Web App). Set `NEXT_PUBLIC_APP_URL` to the canonical Vercel hostname (`https://app.entrestate.com` or similar) so callbacks resolve.
2. Store your Firebase service account in `FIREBASE_ADMIN_CREDENTIALS` (preferred) by pasting the full JSON and escaping newlines as `\n`. If you prefer the split vars, set `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` instead—`verify_env.ts` enforces that one of the two credential paths exists.
3. Keep feature flags off while you focus on the first deploy: `ENABLE_PAYMENTS=false`, `ENABLE_GOOGLE_ADS=false`, `ENABLE_SMS=false`, `ENABLE_EMAIL=false`, `ENABLE_SUPABASE=false`, and `ENABLE_CRON=false`. Set `RATE_LIMIT_DISABLED=true` temporarily until Upstash is ready so the server does not block for caching.
4. Run `ENV_FILE=.env.<env> ts-node --esm scripts/deploy/verify_env.ts` (matching the environment you are deploying) to validate the core vars and gating flags before triggering Vercel.

## Required environment variables
Set the following for every environment (production, preview, staging):
- **Core:** `NEXT_PUBLIC_APP_URL` (canonical app URL used for callbacks/redirects).
- **Firebase public:** the six `NEXT_PUBLIC_FIREBASE_*` variables listed in `.env.example`.
- **Firebase admin:** provide `FIREBASE_ADMIN_CREDENTIALS` (preferred) or the trio `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` (escape `\n` inside the PEM string). The repo enforces that at least one credential path exists.
- **Feature flags:** `ENABLE_FIREBASE_AUTH` (must be set to `true` or `false` explicitly for every environment). Leave `ENABLE_PAYMENTS`, `ENABLE_GOOGLE_ADS`, `ENABLE_SMS`, `ENABLE_EMAIL`, `ENABLE_SUPABASE`, `ENABLE_CRON`, and `RATE_LIMIT_DISABLED` off/false until you ready those flows.

## Optional feature groups
- **Rate limiting:** When `RATE_LIMIT_DISABLED=false` (the default), you must set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Set `RATE_LIMIT_DISABLED=true` locally only if you cannot talk to Upstash yet.
- **Cron jobs:** Only set `CRON_SECRET` when `ENABLE_CRON=true` and the scheduled endpoints are in use.
- **AI & messaging:** Supply `GEMINI_API_KEY` when SMS/email/chat generation endpoints are enabled (`ENABLE_SMS=true` or `ENABLE_EMAIL=true`); otherwise these routes will immediately error.
- **Email:** Flip `ENABLE_EMAIL=true` and provide `RESEND_API_KEY`, `FROM_EMAIL`, plus optional `NOTIFY_EMAIL_TO` when you activate Resend flows.
- **SMS:** Set `ENABLE_SMS=true` plus the three Twilio keys (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`) before hitting SMS endpoints; `NOTIFY_SMS_TO` is optional for alerts.
- **Google Ads:** Enable `ENABLE_GOOGLE_ADS=true` and configure the server/client IDs (`GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID`). Override the redirect URIs or notification email via `GOOGLE_ADS_REDIRECT_URI`, `NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_URI`, and `ADS_NOTIFICATION_EMAIL` only when you need custom flows.
- **Payments:** Toggle `ENABLE_PAYMENTS=true` to turn on PayPal/Ziina. Provide `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `ZIINA_API_KEY`, and `ZIINA_WEBHOOK_SECRET`. Optional helpers: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_API_BASE`, and `ZIINA_BASE_URL`.
- **Supabase:** Enable `ENABLE_SUPABASE=true` only if legacy Supabase flows are required, and populate `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Domains & rewrites:** Optionally set `NEXT_PUBLIC_ROOT_DOMAIN`, `NEXT_PUBLIC_SITE_DOMAIN`, and `NEXT_PUBLIC_FACEBOOK_APP_ID` if you rely on custom rewrites or the Facebook SDK.
- **Observability:** `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` are optional, while `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_TEAM_ID` belong in CLI automation tooling, not runtime deployments.

## Firebase service account
1. Generate a Firebase service account key JSON from the Firebase console (Settings → Service Accounts → Generate new private key).
2. Copy the JSON, escape newlines (`\n`), and paste the entire string into `FIREBASE_ADMIN_CREDENTIALS`. If you cannot store the JSON, use the three split variables instead—`scripts/deploy/verify_env.ts` enforces that every production environment has either the JSON or each split value.
3. Apply the credentials to both Preview and Production environments in Vercel so server actions & API routes authenticate with Firestore.

## Firestore rules & indexes
- Deploy rules & indexes with:
  ```bash
  firebase deploy --only firestore:rules,firestore:indexes --project <projectId>
  ```
- Keep `firestore.rules` and `firestore.indexes.json` in sync with your queries; `npm run build` will also warn about missing composite indexes announced by Firebase during build time.

## Deployment checklist
1. Run `ENV_FILE=.env.<env> ts-node --esm scripts/deploy/verify_env.ts` to validate the minimal + gated env set.
2. Run `npm ci` (or `npm install`), then `npm run lint` and `npm run build` locally to confirm no TypeScript/lint regressions.
3. Deploy Firestore rules/indexes (`firebase deploy --only firestore:rules,firestore:indexes --project <projectId>`) before shipping the build.
4. Trigger a Vercel deployment, then sanity-check `/api/health` and `/api/health/monetization` (they should return `200`).

## Common failures & fixes
- **Missing Firebase admin creds:** If the build logs `Missing Firebase admin credentials`, either add `FIREBASE_ADMIN_CREDENTIALS` or set all three `FIREBASE_ADMIN_*` variables. Use `scripts/deploy/verify_env.ts` to catch it early.
- **Private key newline issues:** Replace literal line breaks in `FIREBASE_ADMIN_PRIVATE_KEY` with `\n` or wrap the value in quotes so Vercel preserves the PEM formatting.
- **Missing `NEXT_PUBLIC_APP_URL`:** This variable powers PayPal, Ziina, and Google Ads callbacks—set it to your deployment hostname (e.g., `https://app.entrestate.com`).
- **Upstash rate limit errors:** When `RATE_LIMIT_DISABLED=false`, the server requires `UPSTASH_REDIS_REST_URL`/`TOKEN`. The deployment script warns if they are missing.
- **AI endpoint failures:** Without `GEMINI_API_KEY`, calls to `/api/ai/generate-image`, `/api/email/*`, `/api/sms/*`, and chat bots return `500`. Provide the key whenever those flows are active.
- **Firestore composite indexes:** Firebase will raise index errors for `jobs` queries (e.g., `ownerUid+createdAt` or `type+status+createdAt`). Keep `firestore.indexes.json` updated and redeploy after adding new queries.

## Troubleshooting
- **middleware.js.nft.json missing:** Vercel often reports `ENOENT: no such file or directory, open '/vercel/path0/.next/server/middleware.js.nft.json'`. The new `postbuild` hook runs `node scripts/fix-middleware-nft.mjs` to copy the missing metadata (and proxy) into place; rerun the script yourself if the build fails before the hook fires.
- **Auth null crash:** If the browser logs `Firebase auth is disabled` or `FIREBASE_NOT_CONFIGURED`, double-check that all `NEXT_PUBLIC_FIREBASE_*` values are populated and `ENABLE_FIREBASE_AUTH` is set (`true` or `false`). The client now surfaces `FIREBASE_NOT_CONFIGURED` instead of throwing, so you can safely run locally without those envs.
- **Admin credentials parse errors:** Invalid JSON in `FIREBASE_ADMIN_CREDENTIALS` now bails early while `verify_env.ts` logs the culprit. Ensure the JSON is well-formed, the PEM private key uses `\n` for line breaks, and the service account has the right Firestore scope before deployment.
