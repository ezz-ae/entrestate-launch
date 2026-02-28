'use client';

import { useCallback, useEffect, useState } from 'react';

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

  const load = useCallback(async () => {
    const response = await fetch(`/api/workspace/${orderId}/leads`);
    const data = await response.json();
    if (response.ok) {
      setLeads(data.leads || []);
    }
  }, [orderId]);

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
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border border-border bg-card p-3">
        <h3 className="text-sm font-semibold text-card-foreground">Capture lead</h3>
        <input className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <input className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button onClick={submit} className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Save lead</button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border text-card-foreground">
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
