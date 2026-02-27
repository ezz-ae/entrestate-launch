import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { getWorkspaceData } from '@/lib/server/workspace';
import { getWorkspaceCookieName, hasWorkspaceAccess } from '@/lib/server/workspace-access';

type Props = {
  params: Promise<{ orderId: string }>;
  children: ReactNode;
};

export default async function WorkspaceLayout({ params, children }: Props) {
  const { orderId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(getWorkspaceCookieName(orderId))?.value;
  const allowed = await hasWorkspaceAccess(orderId, token);
  if (!allowed) {
    notFound();
  }
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
