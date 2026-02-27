'use client';

import { useEffect, useState } from 'react';

type TaskField = {
  id: string;
  label: string;
  placeholder?: string;
};

type TaskTemplate = {
  key: string;
  label: string;
  fields: TaskField[];
  match: RegExp;
};

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    key: 'logo',
    label: 'Logo update',
    match: /logo|brand mark|brandmark/i,
    fields: [{ id: 'logoUrl', label: 'New logo URL', placeholder: 'https://...' }],
  },
  {
    key: 'colors',
    label: 'Color palette',
    match: /color|palette|branding/i,
    fields: [
      { id: 'primaryColor', label: 'Primary color', placeholder: '#0f172a' },
      { id: 'secondaryColor', label: 'Secondary color', placeholder: '#38bdf8' },
    ],
  },
  {
    key: 'headline',
    label: 'Headline or hero copy',
    match: /headline|hero|title|tagline|headline copy/i,
    fields: [{ id: 'headlineText', label: 'New headline', placeholder: '...' }],
  },
  {
    key: 'contact',
    label: 'Contact details',
    match: /whatsapp|phone|email|contact/i,
    fields: [
      { id: 'contactName', label: 'Contact name', placeholder: 'Full name' },
      { id: 'contactPhone', label: 'WhatsApp/phone', placeholder: '+971...' },
      { id: 'contactEmail', label: 'Email', placeholder: 'name@email.com' },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery/images',
    match: /image|gallery|photo|render/i,
    fields: [{ id: 'imageUrls', label: 'Image URLs (comma separated)', placeholder: 'https://..., https://...' }],
  },
  {
    key: 'cta',
    label: 'CTA button',
    match: /cta|call to action|button/i,
    fields: [
      { id: 'ctaText', label: 'CTA label', placeholder: 'Book a call' },
      { id: 'ctaLink', label: 'CTA link', placeholder: 'https://wa.me/...' },
    ],
  },
];

function deriveTasks(rawText: string) {
  const normalized = rawText.toLowerCase();
  const matched = TASK_TEMPLATES.filter((task) => task.match.test(normalized));
  if (!matched.length) {
    return [
      {
        key: 'general',
        label: 'General updates',
        fields: [{ id: 'generalNotes', label: 'Notes', placeholder: 'Describe the updates' }],
      },
    ];
  }
  return matched;
}

export function EditComposer({ orderId }: { orderId: string }) {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Array<{ key: string; label: string; fields: TaskField[] }>>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ id: string; status: string; rawText?: string | null; createdAt: string }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(`/api/workspace/${orderId}/edits`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data?.ok && Array.isArray(data.edits)) {
          setHistory(
            data.edits.map((edit: any) => ({
              id: edit.id,
              status: edit.status,
              rawText: edit.rawText,
              createdAt: new Date(edit.createdAt).toISOString(),
            })),
          );
        }
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  const canSubmit = rawText.trim().length > 0;

  async function generateTasks() {
    const next = deriveTasks(rawText);
    setTasks(next);
  }

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const response = await fetch(`/api/workspace/${orderId}/edits`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rawText,
        inputs: {
          tasks: tasks.map((task) => ({
            key: task.key,
            label: task.label,
            fields: task.fields.map((field) => ({
              id: field.id,
              value: inputs[field.id] || '',
            })),
          })),
        },
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setResult(`Submitted edit request ${data.editRequestId}`);
      setRawText('');
      setTasks([]);
      setInputs({});
      setHistory((prev) => [
        {
          id: data.editRequestId,
          status: 'submitted',
          rawText,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else {
      setResult(data?.error || 'Failed to submit edit request');
    }
    setSubmitting(false);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Request</p>
          <textarea
            className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Describe your changes. Example: Change logo and update hero headline."
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generateTasks}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              Generate task cards
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit || submitting}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                !canSubmit || submitting ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white'
              }`}
            >
              Submit edit batch
            </button>
          </div>
          {result ? <p className="mt-2 text-sm text-slate-600">{result}</p> : null}
        </div>

        {tasks.length ? (
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">Structured tasks</p>
            {tasks.map((task) => (
              <div key={task.key} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-800">{task.label}</p>
                <div className="mt-2 grid gap-2">
                  {task.fields.map((field) => (
                    <input
                      key={field.id}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      placeholder={field.placeholder || field.label}
                      value={inputs[field.id] || ''}
                      onChange={(event) =>
                        setInputs((prev) => ({ ...prev, [field.id]: event.target.value }))
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-sm font-medium text-slate-700">Edit history</p>
        {loadingHistory ? (
          <p className="text-sm text-slate-500">Loading history…</p>
        ) : history.length ? (
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {history.map((item) => (
              <li key={item.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs">{item.id}</span>
                  <span className="text-xs uppercase text-slate-500">{item.status}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.rawText || '—'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No edit requests yet.</p>
        )}
      </div>
    </div>
  );
}
