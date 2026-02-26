'use client';

type Row = {
  id: string;
  type: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  error: string;
};

export function JobsQueueTable({ rows }: { rows: Row[] }) {
  async function runAction(jobId: string, action: 'requeue' | 'needs_human') {
    await fetch(`/api/jobs/${jobId}/action`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    window.location.reload();
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2">Job</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Attempts</th>
            <th className="px-3 py-2">Error</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-3 py-2">{row.type}</td>
              <td className="px-3 py-2">{row.status}</td>
              <td className="px-3 py-2">{row.attempts}/{row.maxAttempts}</td>
              <td className="px-3 py-2 text-xs text-red-600">{row.error || '-'}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button onClick={() => runAction(row.id, 'requeue')} className="rounded border border-slate-300 px-2 py-1 text-xs">Requeue</button>
                  <button onClick={() => runAction(row.id, 'needs_human')} className="rounded border border-slate-300 px-2 py-1 text-xs">Needs human</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
