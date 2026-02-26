import { notFound } from 'next/navigation';
import { getWorkspaceData } from '@/lib/server/workspace';
import { BioLinkBuildWizard } from '@/components/workspace/build/BioLinkBuildWizard';
import { BrochureBuildWizard } from '@/components/workspace/build/BrochureBuildWizard';

type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspaceBuildPage({ params }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) notFound();

  const slug = data.order.product?.slug;
  const useBrochure = slug === 'brokerage-launch-kit' || slug === 'project-launch-kit';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Build Intake</h2>
      <p className="text-sm text-slate-600">
        Submit the required deployment inputs. Structured edits can be sent later in the edits tab.
      </p>
      {useBrochure ? <BrochureBuildWizard orderId={orderId} /> : <BioLinkBuildWizard orderId={orderId} />}
    </div>
  );
}
