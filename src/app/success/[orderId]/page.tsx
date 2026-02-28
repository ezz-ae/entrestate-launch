import Link from 'next/link';
import { prisma } from '@/server/db';
import { WorkspaceTokenBootstrap } from '@/components/workspace/WorkspaceTokenBootstrap';

type Props = { params: Promise<{ orderId: string }>; searchParams?: { t?: string } };

export default async function SuccessPage({ params, searchParams }: Props) {
  const { orderId } = await params;
  const token = searchParams?.t?.trim() || '';
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { product: true } });

  return (
    <main className="min-h-screen bg-background">
      <WorkspaceTokenBootstrap orderId={orderId} token={token} />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="text-sm uppercase tracking-wide text-emerald-600">Order received</p>
          <h1 className="mt-2 text-3xl font-semibold text-card-foreground">Your workspace is ready</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {order?.product?.title || 'Deployment'} order <span className="font-mono">{orderId}</span> has been created.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/w/${orderId}`} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Open workspace
            </Link>
            <Link href="/" className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Back to market
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
