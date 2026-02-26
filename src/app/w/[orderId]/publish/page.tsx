import { notFound } from 'next/navigation';
import { getWorkspaceData } from '@/lib/server/workspace';
import { PublishStatus } from '@/components/workspace/publish/PublishStatus';
import { PublishActions } from '@/components/workspace/publish/PublishActions';

type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspacePublishPage({ params }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) notFound();

  const canConnectDomain = data.entitlements.some(
    (item) => item.key === 'publish.domainConnect' && (item.valueJson as any)?.allowed === true,
  );

  return (
    <div className="space-y-6">
      <PublishStatus liveUrl={data.order.deployment?.liveUrl} />
      <PublishActions orderId={orderId} canConnectDomain={canConnectDomain} />
    </div>
  );
}
