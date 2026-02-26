import { prisma } from '@/server/db';
import { DeploymentsTable } from '@/components/ops/DeploymentsTable';

export const dynamic = 'force-dynamic';

export default async function OpsDeploymentsPage() {
  const deployments = await prisma.deployment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Deployments</h2>
      <DeploymentsTable
        rows={deployments.map((deployment) => ({
          id: deployment.id,
          status: deployment.status,
          previewUrl: deployment.previewUrl || '',
          liveUrl: deployment.liveUrl || '',
          orderId: deployment.orderId,
        }))}
      />
    </div>
  );
}
