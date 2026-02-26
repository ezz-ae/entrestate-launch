export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const createSchema = z.object({
  type: z.enum(['site_generation', 'ad_campaign', 'seo_audit', 'site_refiner']),
  params: z.record(z.any()).optional(),
});

const processSchema = z.object({
  jobId: z.string().min(1),
});

function planStepsFor(type: string) {
  if (type === 'site_generation') return ['renderBlocks', 'seoGenerate', 'adsGenerate', 'deploy'];
  if (type === 'ad_campaign') return ['analyzeContent', 'generateKeywords', 'createHeadlines', 'budgetOptimization'];
  if (type === 'site_refiner') return ['analyzeStructure', 'applyRefinements', 'finalReview'];
  return ['init'];
}

export async function GET(req: NextRequest) {
  const { uid } = await requireRole(req, ALL_ROLES);
  const jobs = await prisma.job.findMany({
    where: { ownerUid: uid },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({
    jobs: jobs.map((job) => ({
      id: job.id,
      ownerUid: job.ownerUid,
      type: job.type,
      status: job.status,
      plan: (job.payload as any)?.plan || null,
      steps: (job.payload as any)?.steps || [],
      result: job.result,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { uid, tenantId } = await requireRole(req, ALL_ROLES);
  const body = await req.json().catch(() => ({}));

  if (body?.action === 'process') {
    const { jobId } = processSchema.parse(body);
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'running',
        payload: {
          ...(body.payload || {}),
          steps: [
            { name: 'init', status: 'done', result: 'System initialized', timestamp: Date.now() },
          ],
        },
      },
    });
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done' },
    });
    return NextResponse.json({ success: true });
  }

  const payload = createSchema.parse(body);
  const steps = planStepsFor(payload.type);
  const plan = {
    flowId: `${payload.type}-flow`,
    steps,
    params: payload.params || {},
  };
  const job = await prisma.job.create({
    data: {
      tenantId,
      ownerUid: uid,
      type: payload.type,
      status: 'queued',
      payload: {
        plan,
        steps: [],
      },
    },
  });
  return NextResponse.json({
    id: job.id,
    ownerUid: job.ownerUid,
    type: job.type,
    status: job.status,
    plan,
    steps: [],
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
}
