import React, { useCallback } from 'react';

const GOOGLE_ADS_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
const GOOGLE_ADS_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_URI;
const GOOGLE_ADS_SCOPE = 'https://www.googleapis.com/auth/adwords';

export function GoogleAdsConnectButton() {
  const handleConnect = useCallback(() => {
    const params = new URLSearchParams({
      client_id: GOOGLE_ADS_CLIENT_ID || '',
      redirect_uri: GOOGLE_ADS_REDIRECT_URI || '',
      response_type: 'code',
      scope: GOOGLE_ADS_SCOPE,
      access_type: 'offline',
      prompt: 'consent',
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  return (
    <button
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleConnect}
    >
      Connect Google Ads
    </button>
  );
}

// Usage: Place <GoogleAdsConnectButton /> in your dashboard or integration settings UI.
