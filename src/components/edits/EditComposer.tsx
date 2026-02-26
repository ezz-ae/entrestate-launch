'use client';

import { useState } from 'react';

export function EditComposer({ orderId }: { orderId: string }) {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    const response = await fetch(`/api/workspace/${orderId}/edits`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ rawText }),
    });
    const data = await response.json();
    if (response.ok) {
      setResult(`Submitted edit request ${data.editRequestId}`);
      setRawText('');
    } else {
      setResult(data?.error || 'Failed to submit edit request');
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Describe your changes. Example: Change logo and update hero headline."
        value={rawText}
        onChange={(event) => setRawText(event.target.value)}
      />
      <button
        type="button"
        onClick={submit}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Submit edit batch
      </button>
      {result ? <p className="text-sm text-slate-600">{result}</p> : null}
    </div>
  );
}
