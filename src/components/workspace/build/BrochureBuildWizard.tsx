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
  });
  const [status, setStatus] = useState<string | null>(null);

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
        enqueuePreview,
      }),
    });

    const data = await response.json();
    setStatus(response.ok ? 'Saved' : data?.error || 'Save failed');
  }

  return (
    <div className="grid gap-3">
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
      <div className="flex flex-wrap gap-2">
        <button onClick={() => save(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Save draft</button>
        <button onClick={() => save(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Save and build preview</button>
      </div>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
