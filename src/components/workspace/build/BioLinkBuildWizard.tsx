'use client';

import { useState } from 'react';

export function BioLinkBuildWizard({ orderId }: { orderId: string }) {
  const [state, setState] = useState({
    name: '',
    headline: '',
    whatsapp: '',
    instagram: '',
    projects: '',
    cta: 'WhatsApp me',
  });
  const [status, setStatus] = useState<string | null>(null);

  async function save(enqueuePreview: boolean) {
    setStatus('Saving...');
    const response = await fetch(`/api/workspace/${orderId}/intake`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...state,
        projects: state.projects
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        leadCapture: true,
        enqueuePreview,
      }),
    });

    const data = await response.json();
    setStatus(response.ok ? 'Saved' : data?.error || 'Save failed');
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Provide what you have now — you can submit structured edits later. Use the sample fill if you want to move fast.
      </div>
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Full name" value={state.name} onChange={(event) => setState({ ...state, name: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Headline" value={state.headline} onChange={(event) => setState({ ...state, headline: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="WhatsApp" value={state.whatsapp} onChange={(event) => setState({ ...state, whatsapp: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Instagram" value={state.instagram} onChange={(event) => setState({ ...state, instagram: event.target.value })} />
      <textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Projects (one per line)" value={state.projects} onChange={(event) => setState({ ...state, projects: event.target.value })} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="CTA" value={state.cta} onChange={(event) => setState({ ...state, cta: event.target.value })} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setState({
              name: state.name || 'Agent Name',
              headline: state.headline || 'Dubai property specialist',
              whatsapp: state.whatsapp || '+9715XXXXXXX',
              instagram: state.instagram || '@yourhandle',
              projects: state.projects || 'Featured Project 1\nFeatured Project 2',
              cta: state.cta || 'WhatsApp me',
            })
          }
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          Use sample data
        </button>
        <button onClick={() => save(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Save draft</button>
        <button onClick={() => save(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Save and build preview</button>
      </div>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
