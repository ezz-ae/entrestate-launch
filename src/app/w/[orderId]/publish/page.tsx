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
      {data.order.deployment?.liveUrl ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Delivery summary</h3>
          <p className="mt-2 text-sm text-slate-600">
            Live URL: <a className="text-slate-900 underline" href={data.order.deployment.liveUrl}>{data.order.deployment.liveUrl}</a>
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Includes: build setup, preview QA, publish to managed subdomain.</li>
            <li>Need edits? Use the Edits tab to submit a structured batch.</li>
            <li>Optional add-ons: custom domain, extra landing pages, WhatsApp automation.</li>
          </ul>
        </div>
      ) : null}
      <PublishActions orderId={orderId} canConnectDomain={canConnectDomain} />
    </div>
  );
}
