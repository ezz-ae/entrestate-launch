import Link from 'next/link';
import { LeadsClient } from '@/components/workspace/LeadsClient';

type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspaceLeadsPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Leads</h2>
        <Link
          href={`/api/workspace/${orderId}/leads?format=csv`}
          className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
        >
          Export CSV
        </Link>
      </div>
      <LeadsClient orderId={orderId} />
    </div>
  );
}
