'use client';

import { useState } from 'react';
import { Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncLeadsToWebhook } from '@/app/actions/leads';

export function SyncCrmButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    if (!url) return;
    setStatus('loading');
    try {
      const result = await syncLeadsToWebhook(url);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setTimeout(() => {
            setIsOpen(false);
            setStatus('idle');
            setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect.');
    }
  };

  return (
    <>
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
             <Database className="h-6 w-6" />
             <h3 className="font-bold">Data Pool</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-6 flex-1">Enrich lead data and sync with your external CRM or property management system.</p>
          <Button 
             onClick={() => setIsOpen(true)}
             className="w-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/50"
          >
             Sync to External CRM
          </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Sync Configuration</h3>
            <p className="text-zinc-400 text-sm">Enter your destination webhook URL (e.g. Zapier, Make.com) to receive lead data.</p>
            
            <input 
                type="url" 
                placeholder="https://hooks.zapier.com/..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />

            {status === 'success' && <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg"><CheckCircle2 className="h-4 w-4" /> {message}</div>}
            {status === 'error' && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg"><AlertCircle className="h-4 w-4" /> {message}</div>}

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleSync} disabled={status === 'loading' || !url} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Push Data'}
                </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}