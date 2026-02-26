'use client';

import { useState } from 'react';

export function PreviewActions({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function requestPreview() {
    setStatus('Requesting preview build...');
    const response = await fetch(`/api/workspace/${orderId}/preview`, { method: 'POST' });
    const data = await response.json();
    setStatus(response.ok ? `Preview job queued: ${data.jobId}` : data?.error || 'Request failed');
  }

  return (
    <div className="space-y-2">
      <button onClick={requestPreview} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
        Build preview now
      </button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
