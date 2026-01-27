'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { disconnectGoogleAds } from '@/app/actions/google-ads';
import { Loader2, Unplug } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GoogleAdsDisconnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnectGoogleAds();
      router.refresh();
    } catch (error) {
      console.error('Failed to disconnect', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleDisconnect} 
      disabled={isLoading} 
      variant="destructive"
      className="bg-red-600 hover:bg-red-700 text-white"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unplug className="mr-2 h-4 w-4" />}
      Disconnect Google Ads
    </Button>
  );
}