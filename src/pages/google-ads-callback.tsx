import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function GoogleAdsCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { code } = router.query;
    if (typeof code === 'string') {
      fetch('/api/ads/google/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authCode: code }),
      })
        .then(async (res) => {
          if (res.ok) {
            setStatus('success');
            setMessage('Google Ads account connected successfully!');
          } else {
            const data = await res.json();
            setStatus('error');
            setMessage(data.error || 'Failed to connect Google Ads.');
          }
        })
        .catch(() => {
          setStatus('error');
          setMessage('Network error.');
        });
    }
  }, [router.query]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'pending' && <p>Connecting Google Ads account...</p>}
      {status === 'success' && <p className="text-green-600">{message}</p>}
      {status === 'error' && <p className="text-red-600">{message}</p>}
    </div>
  );
}
