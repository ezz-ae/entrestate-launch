type Props = { params: Promise<{ orderId: string }> };

export default async function WorkspaceSupportPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Support</h2>
      <p className="text-sm text-muted-foreground">
        Use structured edits for changes. For blocked delivery, include order id <span className="font-mono">{orderId}</span>
        {' '}in your support request.
      </p>
      <p className="text-sm text-muted-foreground">Escalation channel: support@entrestate.com</p>
    </div>
  );
}
