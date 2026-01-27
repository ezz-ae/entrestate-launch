'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, PhoneCall, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { authorizedFetch } from '@/lib/auth-fetch';

type ColdCallLead = {
  id: string;
  name?: string | null;
  phone?: string | null;
  status?: string | null;
  lastOutcome?: string | null;
  unwelcomedCalls?: number | null;
  ignoredReason?: string | null;
  updatedAt?: string | null;
};

type ListResponse = {
  items: ColdCallLead[];
  ignoredCount: number;
  returnedCount: number;
};

const OUTCOMES: Array<{ value: ColdCallLead['lastOutcome']; label: string }> = [
  { value: 'connected', label: 'Connected' },
  { value: 'call_back', label: 'Call back' },
  { value: 'no_answer', label: 'No answer' },
  { value: 'wrong_number', label: 'Wrong number' },
  { value: 'unwelcomed', label: 'Unwelcomed' },
];

export function ColdCallingBoard() {
  const [leads, setLeads] = useState<ColdCallLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState('Follow-up on new project launches');
  const [projects, setProjects] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [script, setScript] = useState<string | null>(null);
  const [scriptLead, setScriptLead] = useState<ColdCallLead | null>(null);

  const projectList = useMemo(
    () =>
      projects
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [projects]
  );

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authorizedFetch('/api/cold-calling/list', { cache: 'no-store' });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Unable to load cold call list.');
      }
      const data: ListResponse = payload.data || { items: [], ignoredCount: 0, returnedCount: 0 };
      setLeads(data.items || []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load cold call list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    try {
      const res = await authorizedFetch('/api/cold-calling/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Import failed.');
      }
      await fetchLeads();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleOutcome = async (leadId: string, outcome: string) => {
    try {
      const res = await authorizedFetch('/api/cold-calling/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coldCallId: leadId, outcome }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Outcome update failed.');
      }
      await fetchLeads();
    } catch (outcomeError) {
      setError(outcomeError instanceof Error ? outcomeError.message : 'Outcome update failed.');
    }
  };

  const handleScript = async (lead: ColdCallLead) => {
    if (!focus.trim()) {
      setError('Add a focus before generating a script.');
      return;
    }
    try {
      const res = await authorizedFetch('/api/cold-calling/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coldCallId: lead.id,
          language,
          focus: focus.trim(),
          projects: projectList,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || 'Script generation failed.');
      }
      setScript(payload?.data?.script || null);
      setScriptLead(lead);
    } catch (scriptError) {
      setError(scriptError instanceof Error ? scriptError.message : 'Script generation failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Cold Calling</p>
            <h2 className="text-2xl font-bold text-white">Call list + scripts</h2>
            <p className="text-xs text-zinc-500">
              Import up to 100 leads and track outcomes. Five unwelcome calls moves a lead to ignore.
            </p>
          </div>
          <Button
            onClick={handleImport}
            className="bg-white text-black font-bold hover:bg-zinc-200"
            disabled={importing}
          >
            {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Import recent leads
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Focus</label>
            <Input
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              className="bg-black/40 border-white/10 text-white"
              placeholder="Reason for outreach"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Language</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'en' | 'ar')}
              className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <div className="lg:col-span-3 space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Projects</label>
            <Input
              value={projects}
              onChange={(event) => setProjects(event.target.value)}
              className="bg-black/40 border-white/10 text-white"
              placeholder="Comma-separated projects to mention"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-100">
          {error}
        </div>
      )}

      {script && scriptLead && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <PhoneCall className="h-4 w-4" />
            Script for {scriptLead.name || scriptLead.phone || 'Lead'}
          </div>
          <Textarea value={script} readOnly className="min-h-[160px] bg-black/40 border-white/10 text-white" />
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading cold call list...
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/40 p-6 text-xs text-zinc-500">
              No cold call leads yet. Import recent leads to start.
            </div>
          ) : (
            leads.map((lead) => {
              const ignored = lead.status === 'ignored';
              return (
                <div
                  key={lead.id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-5 space-y-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {lead.name || 'Unnamed lead'}
                      </p>
                      <p className="text-xs text-zinc-400">{lead.phone || 'No phone on file'}</p>
                    </div>
                    {ignored ? (
                      <div className="flex items-center gap-2 text-[10px] text-red-200">
                        <ShieldAlert className="h-4 w-4" />
                        {lead.ignoredReason || 'Lead ignored'}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-white/10 text-white"
                        onClick={() => handleScript(lead)}
                      >
                        Generate script
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {OUTCOMES.map((item) => (
                      <Button
                        key={item.value}
                        variant="outline"
                        className="border-white/10 text-xs"
                        disabled={ignored}
                        onClick={() => handleOutcome(lead.id, item.value || 'connected')}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Last outcome: {lead.lastOutcome || 'No updates yet'} · Unwelcome calls:{' '}
                    {lead.unwelcomedCalls || 0}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
