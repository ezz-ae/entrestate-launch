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
    <header className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">Delivery SLA: {slaHours || 24}h</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-700">
          {status}
        </span>
      </div>
    </header>
  );
}
