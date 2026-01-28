import React, { useMemo, useState, useEffect } from 'react';
import { Loader2, Sparkles, Filter, X, Mail, Phone, ScanEye, Briefcase, CheckCircle, AlertCircle, MessageCircle, Send, Linkedin, RefreshCw, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from './supabaseClient';

const LeadLine = ({ label, value, accent }) => (
  <div className="flex items-center gap-2 text-[11px] text-gray-500">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className={accent ? 'text-indigo-600 font-bold' : undefined}>{value}</span>
  </div>
);

const PROVIDER_FALLBACK = {
  email: { enabled: false, reason: '' },
  sms: { enabled: false, reason: '' },
};

const LeadDetailsModal = ({ lead: initialLead, onClose }) => {
  const [lead, setLead] = useState(initialLead);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update local state if prop changes (e.g. opening a different lead)
  useEffect(() => {
    setLead(initialLead);
  }, [initialLead]);

  if (!lead) return null;

  const handleRefreshScan = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: { lead_id: lead.id }
      });
      if (error) throw error;
      if (data) setLead(data);
    } catch (err) {
      console.error("Enrichment failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {(lead.name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{lead.name || 'Anonymous Lead'}</h3>
              <p className="text-xs text-gray-500 capitalize">{lead.source} • {new Date(lead.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Score Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-600">Intent Score</span>
              <span className="text-2xl font-bold text-indigo-600">{Math.round((lead.active_probability || 0) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `${(lead.active_probability || 0) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">"{lead.reasoning}"</p>
          </div>

          {/* Digital Footprint / Screener Results */}
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                <ScanEye size={16} /> Digital Footprint {isRefreshing && <span className="text-xs font-normal text-indigo-500 animate-pulse">Scanning...</span>}
              </h4>
              <button 
                onClick={handleRefreshScan}
                disabled={isRefreshing}
                className="text-[10px] font-medium text-indigo-600 bg-white hover:bg-indigo-100 px-2 py-1 rounded-full border border-indigo-200 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={10} className={isRefreshing ? 'animate-spin' : ''} />
                AI Enriched
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 text-xs">Employment</span>
                <div className="font-medium text-gray-900 flex items-center gap-2 truncate">
                  <Briefcase size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{lead.company ? `${lead.job_title || 'Employee'} at ${lead.company}` : 'Not publicly available'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 text-xs">Email Status</span>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  {lead.email_status === 'valid' ? (
                    <><CheckCircle size={14} className="text-green-600" /> Verified</>
                  ) : (
                    <><AlertCircle size={14} className="text-yellow-600" /> {lead.email_status || 'Unverified'}</>
                  )}
                </div>
              </div>

              <div className="space-y-1 col-span-2">
                <span className="text-gray-500 text-xs">Activity & Socials</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border ${lead.whatsapp_status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    <MessageCircle size={12} /> {lead.whatsapp_status === 'active' ? `Active ${lead.last_seen || ''}` : 'No WhatsApp'}
                  </span>
                  
                  {lead.telegram_status && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                      <Send size={12} /> Telegram
                    </span>
                  )}

                  {(lead.socials || []).includes('linkedin') && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <Linkedin size={12} /> LinkedIn
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Details</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">{lead.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">{lead.phone || 'No phone provided'}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Message</h4>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 leading-relaxed">
              {lead.message || 'No message content.'}
            </div>
          </div>
        </div>

        <div className="p-5 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const LeadValidator = ({ leads = [], loading = false, onAcceptLead, onRejectLead, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkEnriching, setIsBulkEnriching] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const itemsPerPage = 5;

  const filteredLeads = useMemo(() => {
    let result = leads;

    if (filter === 'wa_online_today') {
      result = result.filter(l => l.whatsapp_status === 'active' && (l.last_seen || '').toLowerCase().includes('today'));
    } else if (filter !== 'all') {
      result = result.filter((l) => (l.source || '').toLowerCase() === filter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        (l.name || '').toLowerCase().includes(q) || 
        (l.email || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOption === 'intent') {
        return (b.active_probability || 0) - (a.active_probability || 0);
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    return result;
  }, [leads, filter, searchQuery, sortOption]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const handleBulkEnrich = async () => {
    if (filteredLeads.length === 0) return;
    setIsBulkEnriching(true);
    try {
      // Process sequentially to avoid rate limits
      for (const lead of filteredLeads) {
        await supabase.functions.invoke('enrich-lead', { body: { lead_id: lead.id } });
      }
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Bulk enrichment failed:", error);
    } finally {
      setIsBulkEnriching(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 
      'Intent Score', 'Reasoning', 'Message',
      'Company', 'Job Title', 'WhatsApp Status', 'Last Seen', 
      'Telegram Status', 'Socials', 'Created At'
    ];

    const rows = filteredLeads.map(lead => [
      lead.id,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      lead.email || '',
      lead.phone || '',
      lead.source || '',
      lead.status || '',
      lead.active_probability || 0,
      `"${(lead.reasoning || '').replace(/"/g, '""')}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      `"${(lead.company || '').replace(/"/g, '""')}"`,
      `"${(lead.job_title || '').replace(/"/g, '""')}"`,
      lead.whatsapp_status || '',
      `"${(lead.last_seen || '').replace(/"/g, '""')}"`,
      lead.telegram_status ? 'Active' : '',
      `"${(lead.socials || []).join(', ')}"`,
      lead.created_at || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_smart_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderProgress = (score) => {
    const percent = Math.round(score * 100);
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
    );
  };

  const providerDetails = useMemo(
    () => ({
      email: { enabled: true }, // Defaulting to enabled for demo
      sms: { enabled: true },
    }),
    []
  );

  return (
    <>
      {selectedLead && <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Sparkles size={16} /> Lead Validator
              </h3>
              <p className="text-xs text-gray-500">
                Deduplicated across site forms and chat threads.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkEnrich}
                disabled={filteredLeads.length === 0 || isBulkEnriching}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={14} className={isBulkEnriching ? 'animate-spin' : ''} />
                {isBulkEnriching ? 'Enriching...' : 'Enrich All'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={filteredLeads.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Download size={14} /> Export CSV
              </button>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search leads by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="intent">Highest Intent</option>
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter size={14} className="text-gray-400 mr-1 flex-shrink-0" />
            {['all', 'facebook', 'site', 'chat', 'wa_online_today'].map((source) => (
              <button
                key={source}
                onClick={() => setFilter(source)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  filter === source 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {source === 'wa_online_today' ? 'WA Online Today' : source}
              </button>
            ))}
          </div>
        </div>

      {/* Summary section removed as it relies on backend aggregation not present in Supabase fetch yet */}

      {loading && (
        <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          Loading leads…
        </div>
      )}

      <div className="space-y-4">
        {!loading && paginatedLeads.length === 0 && (
          <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl p-6">
            {leads.length === 0 ? 'No leads in the pipe yet.' : `No leads found for "${filter}".`}
          </div>
        )}

        {paginatedLeads.map((lead) => (
          <div key={lead.id} className="border border-gray-100 rounded-2xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
            <div 
              className="flex items-start justify-between gap-4 cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {lead.name || lead.email || lead.phone || 'Anonymous visitor'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
                    {lead.source === 'chat' ? 'Chat' : 'Site form'}
                  </p>
                  {lead.company && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      <Briefcase size={10} /> {lead.company}
                    </span>
                  )}
                  {lead.whatsapp_status === 'active' && (
                    <span className="text-[10px] text-green-600 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                      <MessageCircle size={10} /> WA
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">
                  {Math.round((lead.active_probability || 0) * 100)}% intent
                </p>
              </div>
            </div>
            {renderProgress(lead.active_probability || 0)}
            <p className="text-xs text-gray-500 leading-relaxed">{lead.reasoning}</p>

            <LeadLine label="Message" value={lead.message || 'No message shared'} />
            <LeadLine label="Email" value={lead.email || '—'} accent={Boolean(lead.email)} />
            <LeadLine label="Phone" value={lead.phone || '—'} accent={Boolean(lead.phone)} />

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                disabled={!providerDetails.email.enabled}
                onClick={() => onAcceptLead?.(lead.id)}
                className={`flex-1 min-w-[120px] rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${
                  providerDetails.email.enabled
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                Email
              </button>
              {!providerDetails.email.enabled && (
                <p className="text-[10px] text-red-400 w-full">{providerDetails.email.reason}</p>
              )}

              <button
                disabled={!providerDetails.sms.enabled}
                onClick={() => onAcceptLead?.(lead.id)}
                className={`flex-1 min-w-[120px] rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${
                  providerDetails.sms.enabled
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                SMS
              </button>
              {!providerDetails.sms.enabled && (
                <p className="text-[10px] text-red-400 w-full">{providerDetails.sms.reason}</p>
              )}

              <button
                onClick={() => onRejectLead?.(lead.id)}
                className="flex-1 min-w-[120px] rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 hover:bg-gray-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && filteredLeads.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default LeadValidator;
