export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { IS_EMAIL_ENABLED } from '@/lib/server/env';

export async function GET(req: NextRequest) {
  const isConfigured = Boolean(process.env.RESEND_API_KEY);
  
  return NextResponse.json({
    enabled: IS_EMAIL_ENABLED,
    configured: isConfigured,
    status: (IS_EMAIL_ENABLED && isConfigured) ? 'ok' : 'disabled',
  });
}
