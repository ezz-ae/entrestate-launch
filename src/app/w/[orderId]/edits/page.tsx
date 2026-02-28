import { EditComposer } from '@/components/edits/EditComposer';

type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspaceEditsPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Structured edits</h2>
      <p className="text-sm text-muted-foreground">Submit edits in a structured batch to avoid scope drift and speed delivery.</p>
      <EditComposer orderId={orderId} />
    </div>
  );
}
