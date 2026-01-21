'use client';

import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConnectCrmButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const webhookPath = '/api/webhooks/leads';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${origin}${webhookPath}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="border-zinc-800 hover:bg-zinc-900 text-zinc-300"
        onClick={() => setIsOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" /> Connect CRM
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Connect External CRM</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Push leads from Zapier, Salesforce, or HubSpot directly into this pipeline.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Webhook URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-400 break-all">
                  {fullUrl}
                </code>
                <Button size="icon" variant="ghost" onClick={handleCopy} className="shrink-0 hover:bg-white/10">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">JSON Payload Example</label>
              <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed">
{`{
  "project_id": "YOUR_PROJECT_UUID",
  "name": "Lead Name",
  "email": "lead@example.com",
  "phone": "+1234567890",
  "source": "zapier"
}`}
              </pre>
              <p className="text-[10px] text-zinc-600">Note: You can find your Project ID in the URL of the project details page.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}