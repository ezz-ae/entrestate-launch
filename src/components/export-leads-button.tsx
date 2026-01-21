'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLeadsForExport } from '@/app/actions/leads';

export function ExportLeadsButton({ query }: { query?: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const leads = await getLeadsForExport(query);
      
      if (!leads || leads.length === 0) {
        // You could use a toast here instead of alert
        alert('No leads to export');
        return;
      }

      // Convert to CSV
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Project', 'Status', 'Source', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...leads.map((lead: any) => [
          lead.id,
          `"${lead.name || ''}"`,
          lead.email || '',
          lead.phone || '',
          `"${lead.projects?.headline || ''}"`,
          lead.status || '',
          lead.source || '',
          lead.created_at
        ].join(','))
      ].join('\n');

      // Trigger Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={loading}
      className="bg-white text-black hover:bg-zinc-200"
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
      Export CSV
    </Button>
  );
}