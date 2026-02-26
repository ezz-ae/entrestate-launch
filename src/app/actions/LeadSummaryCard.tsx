import React, { useState } from 'react';

interface LeadSummaryCardProps {
  summary?: string;
  isLoading?: boolean;
}

/**
 * Displays an AI-generated summary of a lead's professional background.
 */
export function LeadSummaryCard({ summary, isLoading }: LeadSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!summary && !isLoading) return null;

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      padding: '12px', 
      borderRadius: '8px', 
      border: '1px solid var(--border-color)',
      marginTop: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        marginBottom: '6px',
        fontSize: '11px',
        fontWeight: '700',
        color: 'var(--primary-color)',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
      }}>
        <span style={{ flex: 1 }}>✨ AI Summary</span>
        {summary && !isLoading && (
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '10px',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              padding: '2px 4px',
              fontWeight: '600'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {isLoading ? (
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Generating professional insight...
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', margin: 0 }}>
          {summary}
        </p>
      )}
    </div>
  );
}