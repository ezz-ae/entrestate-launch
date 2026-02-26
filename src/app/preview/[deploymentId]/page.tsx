import { notFound } from 'next/navigation';
import { prisma } from '@/server/db';

type Props = { params: Promise<{ deploymentId: string }> };

export default async function DeploymentPreviewPage({ params }: Props) {
  const { deploymentId } = await params;

  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { product: true, tenant: true },
  });

  if (!deployment) notFound();

  const siteDoc = (deployment.siteDocJson as Record<string, unknown>) || {};

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-xs uppercase tracking-wide text-slate-500">Preview</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{String((siteDoc.hero as any)?.name || deployment.product.title)}</h1>
          <p className="mt-2 text-slate-600">{String((siteDoc.hero as any)?.headline || deployment.tenant.name)}</p>

          <div className="mt-6 grid gap-3">
            <p className="text-sm text-slate-700">Kind: {String((siteDoc.kind as string) || 'deployment')}</p>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
              {JSON.stringify(siteDoc, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
