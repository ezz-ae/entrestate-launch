import React, { useState } from 'react';

interface Props {
  onSuccess?: () => void;
}

const GoogleAdsCampaignForm: React.FC<Props> = ({ onSuccess }) => {
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/ads/google/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: Number(budget),
          campaignDetails: { name },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create campaign');
      setSuccess(true);
      setBudget('');
      setName('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Create Google Ads Campaign</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Campaign Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Budget</label>
        <input
          type="number"
          min="1"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Campaign created successfully!</div>}
    </form>
  );
};

export default GoogleAdsCampaignForm;
