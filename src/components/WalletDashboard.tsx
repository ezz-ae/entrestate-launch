import React, { useEffect, useState } from 'react';

export function WalletDashboard() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      } else {
        setError(data.error || 'Failed to fetch wallet');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Wallet funded!');
        setAmount('');
        fetchWallet();
      } else {
        setError(data.error || 'Failed to fund wallet');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Wallet</h2>
      <div className="mb-4">
        <span className="font-semibold">Balance:</span> <span className="text-green-600">${balance.toFixed(2)}</span>
      </div>
      <form onSubmit={handleFund} className="flex gap-2 mb-6">
        <input
          type="number"
          min="1"
          step="any"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Amount to fund"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          Fund Wallet
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <h3 className="font-semibold mb-2">Recent Transactions</h3>
      <ul className="divide-y">
        {transactions.length === 0 && <li className="text-gray-500">No transactions yet.</li>}
        {transactions.map((tx, i) => (
          <li key={i} className="py-2 flex justify-between text-sm">
            <span>{tx.type === 'fund' ? 'Funded' : tx.type}</span>
            <span>${tx.amount?.toFixed(2) || tx.amount}</span>
            <span className="text-gray-400">{tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleString() : String(tx.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
