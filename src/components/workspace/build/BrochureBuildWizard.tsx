'use client';

import { useState } from 'react';

export function BrochureBuildWizard({ orderId }: { orderId: string }) {
  const [state, setState] = useState({
    projectName: '',
    location: 'Dubai, UAE',
    goal: 'investor',
    language: 'en',
    whatsapp: '',
    email: '',
    highlights: '',
    brochureUrl: '',
    brochureJobId: '',
    brochureText: '',
    skipBrochure: false,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  async function uploadBrochure(file: File) {
    setUploadStatus('Uploading brochure...');
    const form = new FormData();
    form.append('file', file);
    const response = await fetch('/api/upload/pdf', { method: 'POST', body: form });
    const data = await response.json();
    if (!response.ok) {
      setUploadStatus(data?.error || 'Upload failed');
      return;
    }
    const jobId = data?.data?.jobId as string | undefined;
    if (!jobId) {
      setUploadStatus('Upload queued, but no jobId returned');
      return;
    }
    setState((prev) => ({ ...prev, brochureJobId: jobId }));
    setUploadStatus('Processing brochure text...');
    pollBrochure(jobId);
  }

  async function pollBrochure(jobId: string) {
    const response = await fetch(`/api/upload/pdf/status?jobId=${encodeURIComponent(jobId)}`, {
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.data) {
      setUploadStatus('Brochure processing failed');
      return;
    }
    const record = data.data;
    if (record.status === 'done') {
      setState((prev) => ({ ...prev, brochureText: record.text || '' }));
      setUploadStatus('Brochure processed');
      return;
    }
    if (record.status === 'failed') {
      setUploadStatus(record.error || 'Brochure processing failed');
      return;
    }
    setTimeout(() => pollBrochure(jobId), 1500);
  }

  async function save(enqueuePreview: boolean) {
    setStatus('Saving...');

    const response = await fetch(`/api/workspace/${orderId}/intake`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...state,
        highlights: state.highlights
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        brochureText: state.brochureText || undefined,
        enqueuePreview,
      }),
    });

    const data = await response.json();
    setStatus(response.ok ? 'Saved' : data?.error || 'Save failed');
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Upload a brochure if you have one. If not, fill the essentials below and we can still build a preview.
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold text-slate-700">Brochure PDF (optional)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadBrochure(file);
          }}
        />
        {uploadStatus ? <p className="text-xs text-slate-600">{uploadStatus}</p> : null}
      </div>
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Brochure link (optional)" value={state.brochureUrl} onChange={(event) => setState({ ...state, brochureUrl: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Project name" value={state.projectName} onChange={(event) => setState({ ...state, projectName: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Location" value={state.location} onChange={(event) => setState({ ...state, location: event.target.value })} />
      <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={state.goal} onChange={(event) => setState({ ...state, goal: event.target.value })}>
        <option value="investor">Investor</option>
        <option value="end-user">End user</option>
        <option value="luxury">Luxury</option>
      </select>
      <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={state.language} onChange={(event) => setState({ ...state, language: event.target.value })}>
        <option value="en">English</option>
        <option value="ar">Arabic</option>
        <option value="bilingual">Bilingual</option>
      </select>
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="WhatsApp" value={state.whatsapp} onChange={(event) => setState({ ...state, whatsapp: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contact email" value={state.email} onChange={(event) => setState({ ...state, email: event.target.value })} />
      <textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Highlights (one per line)" value={state.highlights} onChange={(event) => setState({ ...state, highlights: event.target.value })} />
      <label className="flex items-center gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={state.skipBrochure}
          onChange={(event) => setState({ ...state, skipBrochure: event.target.checked })}
        />
        Proceed without brochure extraction
      </label>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => save(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Save draft</button>
        <button onClick={() => save(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Save and build preview</button>
      </div>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
