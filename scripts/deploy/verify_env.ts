import fs from 'fs';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env.local';

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const strict = process.argv.includes('--strict') || process.env.STRICT === '1';

const required: string[] = [];
const optional: string[] = [];

function requireKey(key: string) {
  if (!process.env[key]) {
    required.push(key);
  }
}

function optionalKey(key: string, comment?: string) {
  if (!process.env[key]) {
    optional.push(comment ? `${key} (${comment})` : key);
  }
}

const shortBool = (key: string) => process.env[key] === 'true';

const coreClientKeys = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];
coreClientKeys.forEach(requireKey);

requireKey('ENABLE_FIREBASE_AUTH');

const adminJson = Boolean(process.env.FIREBASE_ADMIN_CREDENTIALS?.trim());
if (!adminJson) {
  requireKey('FIREBASE_ADMIN_PROJECT_ID');
  requireKey('FIREBASE_ADMIN_CLIENT_EMAIL');
  requireKey('FIREBASE_ADMIN_PRIVATE_KEY');
} else {
  optionalKey('FIREBASE_ADMIN_PROJECT_ID', 'only needed when you cannot provide FIREBASE_ADMIN_CREDENTIALS');
  optionalKey('FIREBASE_ADMIN_CLIENT_EMAIL', 'only needed when you cannot provide FIREBASE_ADMIN_CREDENTIALS');
  optionalKey('FIREBASE_ADMIN_PRIVATE_KEY', 'only needed when you cannot provide FIREBASE_ADMIN_CREDENTIALS');
}

if (shortBool('ENABLE_CRON')) {
  requireKey('CRON_SECRET');
} else {
  optionalKey('CRON_SECRET', 'set only when ENABLE_CRON=true');
}

const enforceRateLimits = process.env.RATE_LIMIT_DISABLED !== 'true';
if (enforceRateLimits) {
  requireKey('UPSTASH_REDIS_REST_URL');
  requireKey('UPSTASH_REDIS_REST_TOKEN');
} else {
  optionalKey('UPSTASH_REDIS_REST_URL', 'rate limiting explicitly disabled');
  optionalKey('UPSTASH_REDIS_REST_TOKEN', 'rate limiting explicitly disabled');
}

if (shortBool('ENABLE_EMAIL')) {
  requireKey('RESEND_API_KEY');
  requireKey('FROM_EMAIL');
} else {
  optionalKey('RESEND_API_KEY', 'only required when ENABLE_EMAIL=true');
  optionalKey('FROM_EMAIL', 'only required when ENABLE_EMAIL=true');
}
optionalKey('NOTIFY_EMAIL_TO', 'optional fallback notification address');

if (shortBool('ENABLE_SMS')) {
  requireKey('TWILIO_ACCOUNT_SID');
  requireKey('TWILIO_AUTH_TOKEN');
  requireKey('TWILIO_FROM_NUMBER');
} else {
  optionalKey('TWILIO_ACCOUNT_SID', 'only required when ENABLE_SMS=true');
  optionalKey('TWILIO_AUTH_TOKEN', 'only required when ENABLE_SMS=true');
  optionalKey('TWILIO_FROM_NUMBER', 'only required when ENABLE_SMS=true');
}
optionalKey('NOTIFY_SMS_TO', 'optional fallback SMS recipient');

if (shortBool('ENABLE_GOOGLE_ADS')) {
  requireKey('GOOGLE_ADS_CLIENT_ID');
  requireKey('GOOGLE_ADS_CLIENT_SECRET');
  requireKey('NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID');
} else {
  optionalKey('GOOGLE_ADS_CLIENT_ID', 'only required when ENABLE_GOOGLE_ADS=true');
  optionalKey('GOOGLE_ADS_CLIENT_SECRET', 'only required when ENABLE_GOOGLE_ADS=true');
  optionalKey('NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID', 'only required when ENABLE_GOOGLE_ADS=true');
}
optionalKey('GOOGLE_ADS_REDIRECT_URI', 'optional redirect override');
optionalKey('NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_URI', 'optional client redirect override');
optionalKey('ADS_NOTIFICATION_EMAIL', 'optional email for Google Ads sync alerts');

if (shortBool('ENABLE_PAYMENTS')) {
  requireKey('PAYPAL_CLIENT_ID');
  requireKey('PAYPAL_CLIENT_SECRET');
  requireKey('ZIINA_API_KEY');
  requireKey('ZIINA_WEBHOOK_SECRET');
} else {
  optionalKey('PAYPAL_CLIENT_ID', 'only required when ENABLE_PAYMENTS=true');
  optionalKey('PAYPAL_CLIENT_SECRET', 'only required when ENABLE_PAYMENTS=true');
  optionalKey('ZIINA_API_KEY', 'only required when ENABLE_PAYMENTS=true');
  optionalKey('ZIINA_WEBHOOK_SECRET', 'only required when ENABLE_PAYMENTS=true');
}
optionalKey('NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'optional client ID for PayPal buttons');
optionalKey('PAYPAL_WEBHOOK_ID', 'only needed when you configure live PayPal webhooks');
optionalKey('PAYPAL_API_BASE', 'override optional; defaults to https://api-m.paypal.com');
optionalKey('ZIINA_BASE_URL', 'optional API endpoint override');

if (shortBool('ENABLE_SUPABASE')) {
  requireKey('NEXT_PUBLIC_SUPABASE_URL');
  requireKey('NEXT_PUBLIC_SUPABASE_ANON_KEY');
} else {
  optionalKey('NEXT_PUBLIC_SUPABASE_URL', 'legacy Supabase flows disabled');
  optionalKey('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'legacy Supabase flows disabled');
}

optionalKey('NEXT_PUBLIC_ROOT_DOMAIN', 'only required for custom rewrites');
optionalKey('NEXT_PUBLIC_SITE_DOMAIN', 'optional published site suffix');
optionalKey('NEXT_PUBLIC_FACEBOOK_APP_ID', 'only needed if you use the Facebook SDK');

optionalKey('GEMINI_API_KEY', 'needed when AI/email/SMS flows are enabled');
optionalKey('META_ACCESS_TOKEN', 'legacy Meta toggle; use only if still needed');
optionalKey('HUBSPOT_ACCESS_TOKEN', 'optional CRM token');
optionalKey('DOMAIN_REQUEST_EMAIL', 'receives domain requests when enabled');
optionalKey('SUPPORT_EMAIL', 'optional support contact for notifications');
optionalKey('RATE_LIMIT_DISABLED', 'set to true only when you intentionally disable rate limits');

optionalKey('SENTRY_DSN', 'optional observability integration');
optionalKey('NEXT_PUBLIC_SENTRY_DSN', 'optional observability integration');

optionalKey('VERCEL_API_TOKEN', 'for CLI automation only; avoid runtime use');
optionalKey('VERCEL_PROJECT_ID', 'for CLI automation only; avoid runtime use');
optionalKey('VERCEL_TEAM_ID', 'for CLI automation only; avoid runtime use');

if (required.length) {
  console.error('Missing required env vars:');
  required.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

if (strict && optional.length) {
  console.error('Missing optional env vars in --strict mode:');
  optional.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

if (optional.length) {
  console.warn('Optional env vars not set:');
  optional.forEach((key) => console.warn(`- ${key}`));
}

console.log('All required env vars are set.');
