import { prisma } from '@/server/db';
import { LeadsTable } from '@/components/ops/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function OpsLeadsPage() {
  const leads = await prisma.lead.findMany({
    where: {
      orderId: {
        not: null,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Workspace leads</h2>
      <LeadsTable
        rows={leads.map((lead) => ({
          id: lead.id,
          name: lead.name || '-',
          phone: lead.phone || '-',
          email: lead.email || '-',
          status: lead.status || '-',
          orderId: lead.orderId || '-',
        }))}
      />
    </div>
  );
}
