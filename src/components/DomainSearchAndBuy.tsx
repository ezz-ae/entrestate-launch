import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DomainSearchAndBuy() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSuccess(null);
    try {
      const res = await fetch(`/api/domains/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search');
      setResults(data.results);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (domain: string) => {
    setPurchasing(domain);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/domains/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to purchase');
      setSuccess(`Domain ${domain} registered!`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search & Buy Domain</h2>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Enter domain name (without TLD)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={!query || loading}>Search</Button>
      </div>
      {loading && <div>Searching...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {results.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Domain</th>
              <th className="p-2">Available</th>
              <th className="p-2">Price</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.domain}>
                <td className="p-2 font-mono">{r.domain}</td>
                <td className="p-2">{r.available ? 'Yes' : 'No'}</td>
                <td className="p-2">{r.price} {r.currency}</td>
                <td className="p-2">
                  {r.available ? (
                    <Button size="sm" onClick={() => handleBuy(r.domain)} disabled={purchasing === r.domain}>
                      {purchasing === r.domain ? 'Purchasing...' : 'Buy'}
                    </Button>
                  ) : (
                    <span className="text-zinc-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
