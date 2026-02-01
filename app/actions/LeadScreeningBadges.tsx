import React from 'react';

interface LeadScreeningBadgesProps {
  screening?: {
    emailValid: boolean;
    domain: string;
    apps: {
      whatsapp: boolean;
      telegram: boolean;
    };
    enrichment?: {
      linkedin_url?: string;
      job_title?: string;
    };
  };
}

export function LeadScreeningBadges({ screening }: LeadScreeningBadgesProps) {
  if (!screening) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
      {/* App Connectivity Icons */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span 
          title={screening.apps.whatsapp ? "WhatsApp Available" : "No WhatsApp"} 
          style={{ 
            opacity: screening.apps.whatsapp ? 1 : 0.2, 
            filter: screening.apps.whatsapp ? 'none' : 'grayscale(100%)',
            fontSize: '14px',
            cursor: 'default'
          }}
        >
          💬
        </span>
        <span 
          title={screening.apps.telegram ? "Telegram Available" : "No Telegram"} 
          style={{ 
            opacity: screening.apps.telegram ? 1 : 0.2, 
            filter: screening.apps.telegram ? 'none' : 'grayscale(100%)',
            fontSize: '14px',
            cursor: 'default'
          }}
        >
          ✈️
        </span>
      </div>

      {/* Domain Badge */}
      <span style={{ 
        fontSize: '10px', 
        padding: '2px 6px', 
        backgroundColor: 'var(--bg-tertiary)', 
        borderRadius: '4px',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
        textTransform: 'lowercase'
      }}>
        {screening.domain}
      </span>

      {/* Enrichment Badge */}
      {screening.enrichment?.job_title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ 
            fontSize: '10px', 
            padding: '2px 6px', 
            backgroundColor: 'var(--bg-accent)', 
            borderRadius: '4px',
            color: 'var(--primary-color)',
            fontWeight: '700',
            border: '1px solid var(--primary-color)'
          }}>
            {screening.enrichment.job_title}
          </span>
          {screening.enrichment.linkedin_url && (
            <a 
              href={screening.enrichment.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '12px', textDecoration: 'none', opacity: 0.8 }}
              title="LinkedIn Profile"
            >
              🔗
            </a>
          )}
        </div>
      )}
    </div>
  );
}