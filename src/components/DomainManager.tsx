import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Domain {
  id?: string;
  domain: string;
  status: string;
  [key: string]: any;
}

export default function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/domains');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setDomains(data.domains);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDomains(); }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain }),
      });
      if (!res.ok) throw new Error('Failed to add');
      setNewDomain('');
      fetchDomains();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/domains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchDomains();
    } catch {}
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Domain Management</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="yourdomain.com"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={!newDomain}>Add</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Domain</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => (
              <tr key={domain.id}>
                <td className="p-2">{domain.domain}</td>
                <td className="p-2">{domain.status}</td>
                <td className="p-2">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(domain.id!)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6 p-4 bg-blue-50 border rounded">
        <h4 className="font-bold mb-2">DNS Setup Instructions</h4>
        <p>To verify your domain, add a CNAME record pointing to <span className="font-mono bg-gray-100 px-1">verify.entresite.ai</span> in your DNS provider.</p>
      </div>
    </div>
  );
}
