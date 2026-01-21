'use client';

import { useState } from 'react';
import { ArrowUpRight, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadStatusSelect } from '@/components/lead-status-select';
import { deleteLeads } from '@/app/actions/leads';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LeadNotesButton } from '@/components/lead-notes-button';

interface LeadsTableProps {
  leads: any[];
  pagination: React.ReactNode;
  totalCount: number;
  from: number;
  to: number;
  currentSort?: string;
  currentOrder?: string;
}

export function LeadsTable({ leads, pagination, totalCount, from, to, currentSort, currentOrder }: LeadsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} leads?`)) return;
    setIsDeleting(true);
    try {
      await deleteLeads(Array.from(selectedIds));
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to delete leads');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams);
    if (column === currentSort) {
      params.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', column);
      params.set('order', 'asc');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const SortHeader = ({ column, label }: { column: string, label: string }) => {
    const isActive = currentSort === column;
    return (
      <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort(column)}>
        {label}
        {isActive && (currentOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
       {/* Header with Bulk Actions */}
       <div className="p-6 border-b border-white/5 flex items-center justify-between min-h-[88px]">
          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-4 w-full animate-in fade-in">
                <span className="text-sm font-bold text-white">{selectedIds.size} selected</span>
                <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-auto"
                >
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete Selected
                </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
                <div>
                    <h3 className="font-bold">Recent Leads</h3>
                    <p className="text-xs text-zinc-500">Showing {from + 1}-{Math.min(to + 1, totalCount)} of {totalCount}</p>
                </div>
                {pagination}
            </div>
          )}
       </div>

       {/* Table Header */}
       <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 bg-black/20 items-center">
          <div className="w-5">
            <input 
                type="checkbox" 
                className="rounded border-zinc-700 bg-zinc-800 cursor-pointer"
                checked={leads.length > 0 && selectedIds.size === leads.length}
                onChange={toggleSelectAll}
            />
          </div>
          <SortHeader column="name" label="Name" />
          <div>Contact</div>
          <div>Project</div>
          <SortHeader column="status" label="Status" />
          <SortHeader column="created_at" label="Date" />
          <div className="text-right">Actions</div>
       </div>

       {/* Rows */}
       <div className="divide-y divide-white/5">
          {leads.map((lead) => (
             <div key={lead.id} className={`grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center transition-colors text-sm ${selectedIds.has(lead.id) ? 'bg-blue-500/5' : 'hover:bg-white/5'}`}>
                <div className="w-5">
                    <input 
                        type="checkbox" 
                        className="rounded border-zinc-700 bg-zinc-800 cursor-pointer"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                    />
                </div>
                <div className="font-medium text-white">{lead.name}</div>
                <div className="text-zinc-400 flex flex-col">
                   <span>{lead.email}</span>
                   <span className="text-xs">{lead.phone}</span>
                </div>
                <div className="text-zinc-300">
                   {lead.projects?.headline || 'Unknown Project'}
                </div>
                <div>
                   <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
                </div>
                <div className="text-zinc-400 text-xs">
                   {new Date(lead.created_at).toLocaleDateString()}
                </div>
                <div className="text-right flex items-center justify-end gap-1">
                   <LeadNotesButton leadId={lead.id} initialNotes={lead.notes} />
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowUpRight className="h-4 w-4" />
                   </Button>
                </div>
             </div>
          ))}
          {(!leads || leads.length === 0) && (
             <div className="p-8 text-center text-zinc-500">
                No leads found.
             </div>
          )}
       </div>
    </div>
  );
}