import { prisma } from '@/server/db';
import { applyEditTasks } from '@/lib/server/edits/executor/apply';

export async function processApplyEditBatch(job: { deploymentId?: string | null; orderId?: string | null }) {
  if (!job.deploymentId || !job.orderId) throw new Error('Missing deployment or order id');

  const edit = await prisma.editRequest.findFirst({
    where: {
      deploymentId: job.deploymentId,
      orderId: job.orderId,
      status: { in: ['submitted', 'in_progress'] },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (!edit) return { skipped: true };

  await prisma.editRequest.update({ where: { id: edit.id }, data: { status: 'in_progress' } });

  const compiled = (edit.compiledTasks as { tasks?: Array<Record<string, unknown>> } | null) || {};
  const tasks = Array.isArray(compiled.tasks) ? compiled.tasks : [];

  await applyEditTasks(job.deploymentId, tasks);
  await prisma.editRequest.update({ where: { id: edit.id }, data: { status: 'done' } });

  return { editRequestId: edit.id, appliedTasks: tasks.length };
}
