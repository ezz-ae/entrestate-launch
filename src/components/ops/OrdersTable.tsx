type Row = {
  id: string;
  status: string;
  amount: string;
  product: string;
  customerEmail: string;
  createdAt: string;
};

export function OrdersTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2">Order</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Customer</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Ops</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-3 py-2">{row.status}</td>
              <td className="px-3 py-2">{row.product}</td>
              <td className="px-3 py-2">{row.amount}</td>
              <td className="px-3 py-2">{row.customerEmail}</td>
              <td className="px-3 py-2">{row.createdAt}</td>
              <td className="px-3 py-2">
                <a href={`/ops/orders/${row.id}`} className="text-xs text-slate-700 underline">
                  Manage
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
