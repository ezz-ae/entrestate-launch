'use client';

import { useState } from 'react';

const CHECKLIST_ITEMS = [
  { id: 'cta', label: 'WhatsApp/CTA button works' },
  { id: 'contact', label: 'Contact details are correct' },
  { id: 'lead', label: 'Lead form submits successfully' },
  { id: 'media', label: 'Images load correctly' },
];

export function PreviewActions({ orderId, previewUrl }: { orderId: string; previewUrl?: string | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [allowBypass, setAllowBypass] = useState(false);

  const allChecked = CHECKLIST_ITEMS.every((item) => checked[item.id]);

  async function requestPreview() {
    setStatus('Requesting preview build...');
    const response = await fetch(`/api/workspace/${orderId}/preview`, { method: 'POST' });
    const data = await response.json();
    setStatus(response.ok ? `Preview job queued: ${data.jobId}` : data?.error || 'Request failed');
  }

  async function publish() {
    setStatus('Queueing publish job...');
    const response = await fetch(`/api/workspace/${orderId}/publish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'subdomain' }),
    });
    const data = await response.json();
    setStatus(response.ok ? `Publish queued: ${data.jobId}` : data?.error || 'Publish failed');
  }

  const publishDisabled = !previewUrl || (!allChecked && !allowBypass);

  return (
    <div className="space-y-4">
      <button onClick={requestPreview} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
        Build preview now
      </button>

      <div className="rounded-lg border border-slate-200 p-3">
        <p className="text-sm font-medium text-slate-800">QA checklist</p>
        <div className="mt-2 space-y-2 text-sm text-slate-600">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked[item.id] || false}
                onChange={(event) => setChecked((prev) => ({ ...prev, [item.id]: event.target.checked }))}
              />
              {item.label}
            </label>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={allowBypass}
            onChange={(event) => setAllowBypass(event.target.checked)}
          />
          Publish without completing checklist (not recommended)
        </label>
      </div>

      <button
        onClick={publish}
        disabled={publishDisabled}
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          publishDisabled ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white'
        }`}
      >
        Publish now
      </button>

      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
