'use client';

import { useState } from 'react';

const CHECKLIST = [
  { id: 'paymentVerified', label: 'Payment verified' },
  { id: 'intakeComplete', label: 'Intake complete' },
  { id: 'previewBuilt', label: 'Preview built' },
  { id: 'qaPassed', label: 'QA passed' },
  { id: 'published', label: 'Published' },
  { id: 'deliverySent', label: 'Delivery sent' },
];

export function OpsOrderActions({
  orderId,
  checklist,
  caseStudyNote,
}: {
  orderId: string;
  checklist: Record<string, boolean>;
  caseStudyNote: string;
}) {
  const [localChecklist, setLocalChecklist] = useState<Record<string, boolean>>(checklist || {});
  const [status, setStatus] = useState<string | null>(null);
  const [note, setNote] = useState(caseStudyNote || '');

  async function updateChecklist(id: string, value: boolean) {
    const next = { ...localChecklist, [id]: value };
    setLocalChecklist(next);
    const res = await fetch(`/api/ops/orders/${orderId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update_checklist', checklist: { [id]: value } }),
    });
    if (!res.ok) {
      setStatus('Failed to update checklist');
    }
  }

  async function requeuePreview() {
    setStatus('Queueing preview job...');
    const res = await fetch(`/api/ops/orders/${orderId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'requeue_preview' }),
    });
    const data = await res.json();
    setStatus(res.ok ? `Preview job queued: ${data.jobId}` : data?.error || 'Failed to requeue preview');
  }

  async function markNeedsHuman() {
    setStatus('Marking needs human...');
    const res = await fetch(`/api/ops/orders/${orderId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'mark_needs_human' }),
    });
    const data = await res.json();
    setStatus(res.ok ? 'Marked needs_human' : data?.error || 'Failed to update status');
  }

  async function saveCaseStudyNote() {
    setStatus('Saving case study note...');
    const res = await fetch(`/api/ops/orders/${orderId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'save_case_study_note', note }),
    });
    setStatus(res.ok ? 'Case study note saved' : 'Failed to save note');
  }

  const missingInputsTemplate =
    'We are ready to build your preview. Please confirm: (1) preferred WhatsApp number, (2) final headline, (3) logo URL or file, (4) any must-have sections.';

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">Ops checklist</h3>
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          {CHECKLIST.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(localChecklist[item.id])}
                onChange={(event) => updateChecklist(item.id, event.target.checked)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Ops actions</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={requeuePreview} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            Requeue preview job
          </button>
          <button onClick={markNeedsHuman} className="rounded-lg border border-amber-300 px-3 py-2 text-sm text-amber-700">
            Mark needs human
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Missing inputs template</p>
          <p className="mt-1">{missingInputsTemplate}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Case study note</h3>
        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Capture delivery highlights or client feedback for a case study card."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button onClick={saveCaseStudyNote} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
          Save case study note
        </button>
      </div>

      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </div>
  );
}
