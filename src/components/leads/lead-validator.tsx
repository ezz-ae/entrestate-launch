'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useToast } from '@/hooks/use-toast';

type LeadPipeRecord = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  source: 'site' | 'chat';
  createdAt: string;
  activeProbability: number;
  reasoning: string;
};

type LeadPipeResponse = {
  leads: LeadPipeRecord[];
  summary?: {
    total?: number;
    sourceTotals?: { site?: number; chat?: number };
  };
  providers?: {
    email?: { enabled: boolean; reason?: string | null };
    sms?: { enabled: boolean; reason?: string | null };
  };
};

const PROVIDER_FALLBACK = {
  email: { enabled: false, reason: 'Email sender not configured.' },
  sms: { enabled: false, reason: 'SMS sender not configured.' },
};

export function LeadValidator() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<LeadPipeRecord[]>([]);
  const [summary, setSummary] = useState<LeadPipeResponse['summary']>(null);
  const [providers, setProviders] = useState(PROVIDER_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authorizedFetch('/api/lead-pipe', { cache: 'no-store' });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Unable to load leads.');
      }
      const data: LeadPipeResponse = payload.data || {};
      setLeads(data.leads || []);
      setSummary(data.summary || null);
      setProviders({
        email: data.providers?.email || PROVIDER_FALLBACK.email,
        sms: data.providers?.sms || PROVIDER_FALLBACK.sms,
      });
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const handleAction = async (lead: LeadPipeRecord, channel: 'email' | 'sms') => {
    try {
      const res = await authorizedFetch('/api/lead-pipe/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, channel }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Action failed.');
      }
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      toast({
        title: 'Queued for outreach',
        description: `${channel.toUpperCase()} draft created for this lead.`,
      });
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Action failed.';
      toast({ title: 'Action failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" /> Lead Validator
          </h3>
          <p className="text-xs text-zinc-500">Deduplicated across site submissions and chat threads.</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white" onClick={fetchLeads}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-[9px]">Site</p>
            <p className="text-white text-sm font-semibold">{summary.sourceTotals?.site ?? 0}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-[9px]">Chat</p>
            <p className="text-white text-sm font-semibold">{summary.sourceTotals?.chat ?? 0}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-[9px]">Active</p>
            <p className="text-white text-sm font-semibold">{summary.total ?? 0}</p>
          </div>
        </div>
      )}

      {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>}

      {loading && !leads.length ? (
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading leads...
        </div>
      ) : null}

      {!loading && leads.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 bg-black/40 p-4 text-xs text-zinc-400">
          No leads in the pipe yet.
        </div>
      )}

      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {lead.name || lead.email || lead.phone || 'Anonymous visitor'}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {lead.source === 'chat' ? 'Chat' : 'Site'}
                </p>
              </div>
              <div className="text-right text-[10px] text-zinc-500">
                <p>{new Date(lead.createdAt).toLocaleString()}</p>
                <p>{Math.round(lead.activeProbability * 100)}% intent</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500">{lead.reasoning}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={!providers.email.enabled}
                className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700"
                onClick={() => handleAction(lead, 'email')}
              >
                Email
              </Button>
              <Button
                disabled={!providers.sms.enabled}
                className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleAction(lead, 'sms')}
              >
                SMS
              </Button>
            </div>
            {!providers.email.enabled && (
              <p className="text-[10px] text-red-300">{providers.email.reason}</p>
            )}
            {!providers.sms.enabled && (
              <p className="text-[10px] text-red-300">{providers.sms.reason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
