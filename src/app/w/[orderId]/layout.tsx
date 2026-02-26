import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { getWorkspaceData } from '@/lib/server/workspace';

type Props = {
  params: Promise<{ orderId: string }>;
  children: ReactNode;
};

export default async function WorkspaceLayout({ params, children }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) {
    notFound();
  }

  return (
    <WorkspaceShell
      orderId={orderId}
      title={data.order.product?.title || 'Deployment Workspace'}
      status={data.order.status}
      slaHours={data.order.product?.fulfillmentSlaHours || 24}
      entitlements={data.entitlements}
    >
      {children}
    </WorkspaceShell>
  );
}
