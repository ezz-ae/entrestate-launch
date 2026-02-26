import { prisma } from '@/server/db';
import { JobsQueueTable } from '@/components/ops/JobsQueueTable';

export const dynamic = 'force-dynamic';

export default async function OpsJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Jobs</h2>
      <JobsQueueTable
        rows={jobs.map((job) => ({
          id: job.id,
          type: job.type,
          status: job.status,
          attempts: job.attempts,
          maxAttempts: job.maxAttempts,
          error: job.error || '',
        }))}
      />
    </div>
  );
}
