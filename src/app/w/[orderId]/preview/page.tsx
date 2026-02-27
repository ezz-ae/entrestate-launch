import { notFound } from 'next/navigation';
import { getWorkspaceData } from '@/lib/server/workspace';
import { PreviewPanel } from '@/components/workspace/preview/PreviewPanel';
import { PreviewActions } from '@/components/workspace/preview/PreviewActions';

type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspacePreviewPage({ params }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) notFound();

  return (
    <div className="space-y-6">
      <PreviewPanel previewUrl={data.order.deployment?.previewUrl} />
      <PreviewActions orderId={orderId} previewUrl={data.order.deployment?.previewUrl} />
    </div>
  );
}
