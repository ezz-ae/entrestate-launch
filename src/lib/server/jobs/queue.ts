import { Prisma, type Job } from '@prisma/client';
import { prisma } from '@/server/db';

const JOB_LOCK_TIMEOUT_MS = 5 * 60 * 1000;

export type QueueJobInput = {
  tenantId: string;
  orderId?: string;
  deploymentId?: string;
  type: string;
  payload?: Prisma.InputJsonValue;
};

export async function enqueueJob(input: QueueJobInput) {
  return prisma.job.create({
    data: {
      tenantId: input.tenantId,
      orderId: input.orderId,
      deploymentId: input.deploymentId,
      type: input.type,
      status: 'queued',
      payload: input.payload,
    },
  });
}

export async function enqueueJobs(inputs: QueueJobInput[]) {
  if (!inputs.length) return { count: 0 };
  return prisma.job.createMany({
    data: inputs.map((input) => ({
      tenantId: input.tenantId,
      orderId: input.orderId,
      deploymentId: input.deploymentId,
      type: input.type,
      status: 'queued',
      payload: input.payload,
    })),
  });
}

export async function claimJobs(limit = 5) {
  const lockCutoff = new Date(Date.now() - JOB_LOCK_TIMEOUT_MS);
  const candidates = await prisma.job.findMany({
    where: {
      OR: [
        { status: 'queued' },
        {
          status: 'running',
          lockedAt: { lt: lockCutoff },
        },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: limit * 3,
  });

  const claimed: Job[] = [];
  for (const candidate of candidates) {
    const updated = await prisma.job.updateMany({
      where: {
        id: candidate.id,
        OR: [{ status: 'queued' }, { status: 'running', lockedAt: { lt: lockCutoff } }],
      },
      data: {
        status: 'running',
        lockedAt: new Date(),
        attempts: { increment: 1 },
      },
    });

    if (updated.count > 0) {
      const claimedJob = await prisma.job.findUnique({ where: { id: candidate.id } });
      if (claimedJob) claimed.push(claimedJob);
    }

    if (claimed.length >= limit) break;
  }

  return claimed;
}

export async function markJobDone(id: string, result?: Prisma.InputJsonValue) {
  return prisma.job.update({
    where: { id },
    data: {
      status: 'done',
      result,
      error: null,
      lockedAt: null,
    },
  });
}

export async function markJobFailed(id: string, error: unknown) {
  const current = await prisma.job.findUnique({ where: { id } });
  if (!current) return null;

  const message = error instanceof Error ? error.message : String(error);
  const shouldEscalate = current.attempts >= current.maxAttempts;

  return prisma.job.update({
    where: { id },
    data: {
      status: shouldEscalate ? 'needs_human' : 'queued',
      error: message,
      lockedAt: null,
    },
  });
}
