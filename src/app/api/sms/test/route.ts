export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { IS_SMS_ENABLED } from '@/lib/server/env';

export async function GET(req: NextRequest) {
  const isConfigured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
  
  return NextResponse.json({
    enabled: IS_SMS_ENABLED,
    configured: isConfigured,
    status: (IS_SMS_ENABLED && isConfigured) ? 'ok' : 'disabled',
  });
}
