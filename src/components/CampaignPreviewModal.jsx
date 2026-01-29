import React from 'react';

const CampaignPreviewModal = ({ campaign, onClose, onSend, isSending }) => {
  if (!campaign) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>✨ Campaign Strategy</h3>
          <button 
            onClick={onClose} 
            style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', color: '#4B5563' }}
          >
            ×
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '14px', 
            lineHeight: '1.6', 
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            {campaign}
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
          <button 
            className="primary-button" 
            disabled={isSending}
            onClick={() => onSend('email')}
            style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '14px', height: '48px' }}
          >
            📧 Send Email
          </button>
          <button 
            className="primary-button" 
            disabled={isSending}
            onClick={() => onSend('sms')}
            style={{ flex: 1, fontSize: '14px', height: '48px' }}
          >
            {isSending ? 'Sending...' : '📱 Send SMS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreviewModal;