'use client';

import { useState } from 'react';

export function PublishActions({ orderId, canConnectDomain }: { orderId: string; canConnectDomain: boolean }) {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function publishSubdomain() {
    setStatus('Queueing publish job...');
    const response = await fetch(`/api/workspace/${orderId}/publish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'subdomain' }),
    });
    const data = await response.json();
    setStatus(response.ok ? `Subdomain publish queued: ${data.jobId}` : data?.error || 'Publish failed');
  }

  async function connectDomain() {
    setStatus('Queueing domain job...');
    const response = await fetch(`/api/workspace/${orderId}/publish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'domain', domain }),
    });
    const data = await response.json();
    setStatus(response.ok ? `Domain job queued: ${data.jobId}` : data?.error || 'Domain publish failed');
  }

  return (
    <div className="space-y-3">
      <button onClick={publishSubdomain} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Publish to managed subdomain
      </button>

      {canConnectDomain ? (
        <div className="space-y-2 rounded-lg border border-border bg-card p-3">
          <p className="text-sm font-medium text-card-foreground">Connect custom domain</p>
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            placeholder="example.com"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          />
          <button onClick={connectDomain} className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted">
            Connect domain
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Domain connect add-on is not enabled for this order.</p>
      )}

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
