type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  orderId: string;
};

export function LeadsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2">Lead</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Order</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-3 py-2">{row.name}</td>
              <td className="px-3 py-2">{row.phone}</td>
              <td className="px-3 py-2">{row.email}</td>
              <td className="px-3 py-2">{row.status}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.orderId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
