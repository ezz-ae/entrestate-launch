'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
};

export function LeadsClient({ orderId }: { orderId: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const response = await fetch(`/api/workspace/${orderId}/leads`);
    const data = await response.json();
    if (response.ok) {
      setLeads(data.leads || []);
    }
  }

  async function submit() {
    const response = await fetch(`/api/workspace/${orderId}/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, phone, email, source: 'workspace_manual' }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage(`Lead created: ${data.lead.id}`);
      setName('');
      setPhone('');
      setEmail('');
      await load();
    } else {
      setMessage(data?.error || 'Lead create failed');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border border-slate-200 p-3">
        <h3 className="text-sm font-semibold text-slate-900">Capture lead</h3>
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button onClick={submit} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Save lead</button>
        {message ? <p className="text-xs text-slate-600">{message}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-200">
                <td className="px-3 py-2">{lead.name || '-'}</td>
                <td className="px-3 py-2">{lead.phone || '-'}</td>
                <td className="px-3 py-2">{lead.email || '-'}</td>
                <td className="px-3 py-2">{lead.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
