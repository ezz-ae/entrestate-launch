export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { claimJobs } from '@/lib/server/jobs/queue';
import { processJob } from '@/lib/server/jobs/runner';

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const vercelCron = req.headers.get('x-vercel-cron');
  if (vercelCron) return true;
  if (!secret) return false;

  const bearer = req.headers.get('authorization');
  const headerSecret = req.headers.get('x-cron-secret');
  if (headerSecret && headerSecret === secret) return true;
  if (bearer && bearer === `Bearer ${secret}`) return true;
  return false;
}

async function handleRun(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const limit = Number(req.nextUrl.searchParams.get('limit') || '5');
  const jobs = await claimJobs(limit);

  const results = [];
  for (const job of jobs) {
    results.push(await processJob(job));
  }

  return NextResponse.json({
    ok: true,
    claimed: jobs.length,
    results,
  });
}

export async function POST(req: NextRequest) {
  return handleRun(req);
}

export async function GET(req: NextRequest) {
  return handleRun(req);
}
