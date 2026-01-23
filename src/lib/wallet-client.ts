// Client-side wallet API helpers
export async function fetchWallet() {
  const res = await fetch('/api/wallet');
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}

export async function fetchWalletTransactions() {
  const res = await fetch('/api/wallet?transactions=1');
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}
