import { z } from 'zod';
import { envBool } from '@/lib/env';

const serverEnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  FIREBASE_ADMIN_CREDENTIALS: z.string().optional(),
  FIREBASE_ADMIN_PROJECT_ID: z.string().optional(),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  project_id: z.string().optional(),
  client_email: z.string().optional(),
  private_key: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  NOTIFY_EMAIL_TO: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  NOTIFY_SMS_TO: z.string().optional(),
  HUBSPOT_ACCESS_TOKEN: z.string().optional(),
  VERCEL_API_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  VERCEL_TEAM_ID: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  RATE_LIMIT_DISABLED: z.string().optional(),
  USE_STATIC_INVENTORY: z.string().optional(),
  ENABLE_FIREBASE_AUTH: z.string().optional(),
  ENABLE_PAYMENTS: z.string().optional().default('false'),
  ENABLE_GOOGLE_ADS: z.string().optional().default('false'),
  ENABLE_SMS: z.string().optional().default('false'),
  ENABLE_EMAIL: z.string().optional().default('false'),
  ENABLE_SUPABASE: z.string().optional().default('false'),
  ENABLE_CRON: z.string().optional().default('false'),
  META_ACCESS_TOKEN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validateServerEnv(rawEnv: NodeJS.ProcessEnv) {
  const parsed = serverEnvSchema.safeParse(rawEnv);
  if (!parsed.success) {
    throw new Error(`Invalid server env: ${parsed.error.message}`);
  }

  const env = parsed.data;
  const isProductionLike =
    rawEnv.NODE_ENV === 'production' ||
    rawEnv.VERCEL_ENV === 'production' ||
    rawEnv.VERCEL_ENV === 'preview';
  const hasAdminJson = Boolean(env.FIREBASE_ADMIN_CREDENTIALS);
  const hasAdminSplit = Boolean(
    (env.FIREBASE_ADMIN_PROJECT_ID || env.FIREBASE_PROJECT_ID || env.project_id) &&
      (env.FIREBASE_ADMIN_CLIENT_EMAIL || env.FIREBASE_CLIENT_EMAIL || env.client_email) &&
      (env.FIREBASE_ADMIN_PRIVATE_KEY || env.FIREBASE_PRIVATE_KEY || env.private_key)
  );

  if (isProductionLike && !hasAdminJson && !hasAdminSplit) {
    throw new Error(
      'Missing Firebase admin credentials. Set FIREBASE_ADMIN_CREDENTIALS or FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY.'
    );
  }

  return env;
}

export const SERVER_ENV = validateServerEnv(process.env);

export const IS_PAYMENTS_ENABLED =
  SERVER_ENV.ENABLE_PAYMENTS === 'true' || Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
export const IS_GOOGLE_ADS_ENABLED =
  SERVER_ENV.ENABLE_GOOGLE_ADS === 'true' || Boolean(process.env.META_ACCESS_TOKEN);
export const IS_SMS_ENABLED =
  SERVER_ENV.ENABLE_SMS === 'true' || Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
export const IS_EMAIL_ENABLED = SERVER_ENV.ENABLE_EMAIL === 'true' || Boolean(process.env.RESEND_API_KEY);

export const FIREBASE_AUTH_ENABLED = envBool(
  'ENABLE_FIREBASE_AUTH',
  process.env.NODE_ENV === 'production'
);
