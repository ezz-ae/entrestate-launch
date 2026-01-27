'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getGoogleAdsAuthUrl } from '@/app/actions/google-ads';
import { Loader2, Link as LinkIcon } from 'lucide-react';

export function GoogleAdsConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const url = await getGoogleAdsAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get auth URL', error);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
      Connect Google Ads
    </Button>
  );
}