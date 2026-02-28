import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkspaceData } from '@/lib/server/workspace';

type Props = { params: Promise<{ orderId: string }> };

const STEPS = ['Payment', 'Inputs', 'Preview', 'Publish', 'Delivery'] as const;

function hasIntake(intake: unknown) {
  if (!intake || typeof intake !== 'object' || Array.isArray(intake)) return false;
  return Object.keys(intake as Record<string, unknown>).length > 0;
}

function buildProgress(status: string, intakeReady: boolean, previewUrl?: string | null, liveUrl?: string | null) {
  const paymentDone = status !== 'pending_payment';
  const inputsDone = intakeReady;
  const previewDone = Boolean(previewUrl) || ['ready_for_review', 'published', 'delivered'].includes(status);
  const publishDone = Boolean(liveUrl) || ['published', 'delivered'].includes(status);
  const deliveryDone = status === 'delivered';

  const flags = [paymentDone, inputsDone, previewDone, publishDone, deliveryDone];
  const currentIndex = Math.max(0, flags.findIndex((flag) => !flag));

  return STEPS.map((label, index) => ({
    label,
    state: flags[index] ? 'done' : index === currentIndex ? 'current' : 'upcoming',
  }));
}

function resolveNextAction(orderId: string, status: string, intakeReady: boolean, previewUrl?: string | null, liveUrl?: string | null) {
  if (!intakeReady) {
    return { label: 'Complete Setup', href: `/w/${orderId}/build`, disabled: false };
  }
  if (!previewUrl && status !== 'ready_for_review' && status !== 'published' && status !== 'delivered') {
    return { label: 'Building Preview…', href: '', disabled: true };
  }
  if (previewUrl && status !== 'published' && status !== 'delivered') {
    return { label: 'Review Preview', href: `/w/${orderId}/preview`, disabled: false };
  }
  if (!liveUrl && (status === 'ready_for_review' || status === 'published')) {
    return { label: 'Publish', href: `/w/${orderId}/publish`, disabled: false };
  }
  return { label: 'Share + Add-ons', href: `/w/${orderId}/publish`, disabled: false };
}

export default async function WorkspaceHomePage({ params }: Props) {
  const { orderId } = await params;
  const data = await getWorkspaceData(orderId);

  if (!data) notFound();

  const intakeReady = hasIntake(data.order.deployment?.intakeJson);
  const previewUrl = data.order.deployment?.previewUrl || null;
  const liveUrl = data.order.deployment?.liveUrl || null;
  const progress = buildProgress(data.order.status, intakeReady, previewUrl, liveUrl);
  const action = resolveNextAction(orderId, data.order.status, intakeReady, previewUrl, liveUrl);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{data.order.product?.title || 'Deployment'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Order <span className="font-mono">{data.order.id}</span> · SLA {data.order.product?.fulfillmentSlaHours || 24}h
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
            {data.order.status}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground">Progress</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          {progress.map((step) => (
            <div
              key={step.label}
              className={`rounded-lg border px-3 py-3 text-xs font-semibold uppercase tracking-wide ${
                step.state === 'done'
                  ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-600'
                  : step.state === 'current'
                  ? 'border-border bg-muted/50 text-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Preview: {previewUrl || 'pending'} · Live: {liveUrl || 'pending'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground">Next action</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We’ll guide you step-by-step. You can always come back and edit later.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {action.disabled ? (
            <span className="inline-flex rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
              {action.label}
            </span>
          ) : (
            <Link href={action.href} className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {action.label}
            </Link>
          )}
          <Link
            href={`/w/${orderId}/support`}
            className="inline-flex rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}
