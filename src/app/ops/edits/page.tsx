import { prisma } from '@/server/db';
import { EditRequestsTable } from '@/components/ops/EditRequestsTable';

export const dynamic = 'force-dynamic';

export default async function OpsEditsPage() {
  const edits = await prisma.editRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Edit requests</h2>
      <EditRequestsTable
        rows={edits.map((edit) => ({
          id: edit.id,
          status: edit.status,
          orderId: edit.orderId,
          deploymentId: edit.deploymentId,
          createdAt: edit.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
