'use client';

import { useState } from 'react';
import { Target, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateLookalikeAudience } from '@/app/actions/leads';

export function AudienceGenerator() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setStatus('loading');
    try {
      const result = await generateLookalikeAudience();
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Audience generated.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to generate audience.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 text-purple-400">
          <Target className="h-6 w-6" />
          <h3 className="font-bold">Smart Audience</h3>
      </div>
      
      <div className="flex-1">
        {status === 'success' ? (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" /> Generated
            </div>
            <p className="text-xs text-zinc-300">{message}</p>
          </div>
        ) : status === 'error' ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 animate-in fade-in">
             <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
              <AlertCircle className="h-4 w-4" /> Error
            </div>
            <p className="text-xs text-zinc-300">{message}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 mb-6">Generate lookalike audiences from your lead pool for Facebook & Google Ads.</p>
        )}
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={status === 'loading' || status === 'success'}
        className="w-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/50"
      >
        {status === 'loading' ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Data...</>
        ) : status === 'success' ? (
          "Audience Ready"
        ) : (
          "Generate Lookalike"
        )}
      </Button>
    </div>
  );
}