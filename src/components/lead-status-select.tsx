'use client';

import { useState } from 'react';
import { updateLeadStatus } from '@/app/actions/leads';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeadStatusSelect({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || 'new');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'qualified': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'lost': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={cn(
          "appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium border bg-transparent focus:outline-none focus:ring-2 focus:ring-white/10 cursor-pointer transition-colors uppercase tracking-wider",
          getStatusColor(status)
        )}
      >
        <option value="new" className="bg-zinc-900 text-zinc-300">New</option>
        <option value="contacted" className="bg-zinc-900 text-zinc-300">Contacted</option>
        <option value="qualified" className="bg-zinc-900 text-zinc-300">Qualified</option>
        <option value="won" className="bg-zinc-900 text-zinc-300">Won</option>
        <option value="lost" className="bg-zinc-900 text-zinc-300">Lost</option>
      </select>
      {loading && <Loader2 className="absolute right-2 top-1.5 h-3 w-3 animate-spin opacity-50" />}
    </div>
  );
}