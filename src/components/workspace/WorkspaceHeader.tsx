export function WorkspaceHeader({
  title,
  status,
  slaHours,
}: {
  title: string;
  status: string;
  slaHours?: number;
}) {
  return (
    <header className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Delivery SLA: {slaHours || 24}h</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase text-muted-foreground">
          {status}
        </span>
      </div>
    </header>
  );
}
