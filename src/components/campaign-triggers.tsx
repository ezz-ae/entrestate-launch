'use client';

import { useState } from 'react';
import { Zap, Mail, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerCampaign } from '@/app/actions/leads';

export function CampaignTriggers({ leadIds, text, projectId }: { leadIds: string[], text: string, projectId: string }) {
  const [loading, setLoading] = useState<'email' | 'sms' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleTrigger = async (type: 'email' | 'sms') => {
    setLoading(type);
    setMessage(null);
    try {
      const result = await triggerCampaign(type, text, leadIds, projectId);
      if (result.success) {
        setMessage(result.message);
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 text-blue-400">
          <Zap className="h-6 w-6" />
          <h3 className="font-bold">Campaign Triggers</h3>
      </div>
      
      <div className="flex-1">
        {message ? (
           <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" /> Triggered
            </div>
            <p className="text-xs text-zinc-300">{message}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 mb-6">Push new leads directly into active SMS and Email nurturing sequences.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Button 
          onClick={() => handleTrigger('email')}
          disabled={!!loading || !leadIds || leadIds.length === 0}
          className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50"
        >
           {loading === 'email' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="mr-2 h-4 w-4" /> Email</>}
        </Button>
        <Button 
          onClick={() => handleTrigger('sms')}
          disabled={!!loading || !leadIds || leadIds.length === 0}
          className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50"
        >
           {loading === 'sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MessageSquare className="mr-2 h-4 w-4" /> SMS</>}
        </Button>
      </div>
    </div>
  );
}