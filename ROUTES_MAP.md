# ROUTES MAP

| Route | Entry File | Type | Main Imports | APIs Called | Status |
|-------|------------|------|--------------|-------------|--------|
| `/` | `src/app/(marketing)/page.tsx` | Server | Landing components | None | Critical |
| `/dashboard` | `src/app/dashboard/page.tsx` | Client | Dashboard layout, charts | `/api/marketing/metrics` | Critical |
| `/builder` | `src/app/builder/page.tsx` | Client | PageBuilder, Sidebars | `/api/sites`, `/api/generate/landing` | Critical |
| `/start` | `src/app/start/page.tsx` | Server | OnboardingFlow | None | Critical |
| `/login` | `src/app/login/page.tsx` | Client | useAuth | Firebase Auth | Critical |
| `/profile` | `src/app/profile/page.tsx` | Client | useAuth, Firebase | `/api/profile` | High |
| `/dashboard/sites` | `src/app/dashboard/sites/page.tsx` | Client | getUserSites | `/api/sites`, `/api/upload/pdf` | High |
| `/dashboard/google-ads` | `src/app/dashboard/google-ads/page.tsx` | Client | GoogleAdsDashboard | `/api/ads/google/*` | Priority |
| `/dashboard/sms-marketing` | `src/app/dashboard/sms-marketing/page.tsx` | Client | SMSDashboard | `/api/sms/*` | Priority |
| `/dashboard/email-marketing` | `src/app/dashboard/email-marketing/page.tsx` | Client | EmailDashboard | `/api/email/*` | Priority |
| `/p/[siteId]` | `src/app/p/[siteId]/page.tsx` | Server | PageRenderer | `/server/publish-service` | Critical |
| `/api/projects/meta` | `src/app/api/projects/meta/route.ts` | API | Firestore | None | Critical |
| `_gemini-app-frozen` | `src/app/_gemini-app-frozen/page.tsx` | Frozen | - | - | Frozen |
