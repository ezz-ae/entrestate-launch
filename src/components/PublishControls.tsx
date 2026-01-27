import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  siteId: string;
  initialStatus?: 'draft' | 'published';
}

export default function PublishControls({ siteId, initialStatus = 'draft' }: Props) {
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: 'publish' | 'unpublish') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, action }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || data?.message || 'Failed to update status');
      }
      setStatus(data?.data?.status || status);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <h3 className="font-bold mb-2">Publish Status: <span className={status === 'published' ? 'text-green-600' : 'text-gray-500'}>{status}</span></h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2">
        <Button onClick={() => handleAction('publish')} disabled={loading || status === 'published'}>Publish</Button>
        <Button onClick={() => handleAction('unpublish')} disabled={loading || status === 'draft'} variant="secondary">Unpublish</Button>
      </div>
    </div>
  );
}
