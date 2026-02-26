# Firebase Usage Map

This map highlights current Firebase touch points across the repository so we can plan the Neon migration. It is not exhaustive but covers the areas we must replace per the SHIFT requirements.

## 1. Client-side Firebase (Auth + Firestore / Storage usage)

- `src/LoginScreen.tsx` / `.jsx`: Handles email/password login via `signInWithEmailAndPassword` (Firebase Auth) and relies on `getAuthSafe` / client SDK helpers.
- `src/SettingsScreen.tsx`: Uses `getAuth` + `signOut` for the settings UI, mostly for admin sign-out.
- `src/ChatAgentDashboard.tsx`: Reads authenticated user data via Firebase Auth context helpers.
- `src/components/firebase-auth-provider.tsx`, `src/context/auth-context.tsx`, `src/components/messaging/*`, `src/hooks/useAuth.tsx`: Various hooks/components rely on `firebase/auth`, `react-firebase-hooks`, or Firestore subscription helpers for auth and user state.
- Storage URLs in `src/lib/placeholder-images.ts` and `components/ui/responsive-image.tsx` currently point to Firebase Storage; brochure upload flows also push to Firebase Storage through `/api/agent/train` routes.

## 2. Server-side Firebase Admin (Firestore + Auth + Storage)

- `src/server/firebase-admin.ts`: Single entry point creating the `adminApp`, `adminAuth`, and `adminDb` instances. Exported helper functions (`getAdminDb`, `getAdminAuth`, etc.) are imported by all route handlers.
- `src/lib/server/auth.ts`: Uses `getAdminAuth` + `getAdminDb` for credential checks (currently for auth/session and usage limits).
- `src/server/publish-service.ts` & `src/server/content.ts`: Use Firestore for draft publish metadata and project content.
- `scripts/*`: Several ingestion/worker scripts (`scripts/ingest-entrestate.ts`, `scripts/workers/refiner-worker.ts`)依 also rely on admin Firestore and storage.

## 3. API Routes referencing Firestore collections

| Route | Firestore collection(s) used |
| --- | --- |
| `app/api/projects/*` (`action`, `search`, `create-draft`, etc.) | `projects`, helper `templates`, `usageLimits` |
| `app/api/inventory/route.ts` | `inventory_projects`, `usageLimits`, `agents` |
| `app/api/leads/*` (`create`, `list`, `update`, `notes`, `settings`, `route`) | `leads`, `lead_notes`, `lead_settings`, `usageLimits` |
| `app/api/campaigns/*` (ads/google, marketing, sms, cold-calling) | `campaigns`, `sms_campaigns`, `usageLimits` |
| `app/api/agent/*` (`train`, `knowledge`, `demo`, etc.) | `agent_training`, `agents`, `agent_sessions`, `brochure_uploads` |
| `app/api/agent/[agentId]/knowledge/route.ts` | Reads/writes to `agent_training` documents |
| `app/api/chat*`, `app/api/bot*`, `app/api/audience/*`, `app/api/team/*`, `app/api/contacts/*`, `app/api/domains/*`, etc. | Primarily usage tracking collections plus team/invite data |
| `app/api/webhooks/*` (PayPal, Ziina), `app/api/email/*`, `app/api/health/*`, `app/api/auth/session`, `app/api/publish/*`, `app/api/sites/*`, `app/api/wallet/*`, `app/api/billing/*` | Misc. admin metadata stored in Firestore (sessions, usage, publish records) |

> *Note:* Many routes still import Firestore helpers (`FieldValue`, `FieldPath`) for updates. These will need equivalent Prisma/Neon replacements per collection.

## 4. Storage usage

- `app/api/agent/train/route.ts` is the primary route that uploads brochures to Firebase Storage (`getStorage` + `UploadTask`). This pipeline feeds the brochure→landing generator.
- Legacy helper code points to `firebasestorage.googleapis.com` in placeholder images (static references to uploaded sample assets).

## 5. Feature flag hooks (planned)

- We will introduce `USE_NEON=true` to gate Postgres reads. During Phase 1 we can run Firestore + Neon in parallel and fallback to Firebase if Neon data is missing.
- Later phases will cut Firebase writes entirely, remove the admin SDK, and fully migrate storage/auth layers.

This map should serve as a reference while decomposing the migration paths for each API surface. Update it whenever we touch new Firebase areas during the SHIFT.
