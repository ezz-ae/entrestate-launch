type Row = {
  id: string;
  status: string;
  orderId: string;
  deploymentId: string;
  createdAt: string;
};

export function EditRequestsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2">Edit Request</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Order</th>
            <th className="px-3 py-2">Deployment</th>
            <th className="px-3 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-3 py-2">{row.status}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.orderId}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.deploymentId}</td>
              <td className="px-3 py-2">{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
