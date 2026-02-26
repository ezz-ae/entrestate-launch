export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';

const schema = z.object({
  action: z.enum(['requeue', 'needs_human']),
});

type Context = { params: Promise<{ jobId: string }> };

export async function POST(req: NextRequest, ctx: Context) {
  const { jobId } = await ctx.params;

  try {
    const body = schema.parse(await req.json());
    const status = body.action === 'requeue' ? 'queued' : 'needs_human';

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status,
        lockedAt: null,
      },
    });

    return NextResponse.json({ ok: true, jobId: job.id, status: job.status });
  } catch (error) {
    console.error('[api/jobs/action] error', error);
    return NextResponse.json({ ok: false, error: 'job_action_failed' }, { status: 500 });
  }
}
