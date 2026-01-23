import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionLabel, onAction }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '60vh', 
      textAlign: 'center',
      padding: '24px'
    }}>
      {/* Branded Illustration */}
      <div style={{ fontSize: '64px', marginBottom: '24px' }} aria-label="Empty">3e0</div>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>{title}</h2>
      <p style={{ color: '#6B7280', marginBottom: '32px', lineHeight: '1.6', maxWidth: '320px' }}>{message}</p>
      <button 
        onClick={onAction}
        style={{
          backgroundColor: 'var(--primary-color, #2563eb)',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '14px',
          border: 'none',
          fontWeight: '700',
          fontSize: '18px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'background 0.2s',
        }}
        aria-label={actionLabel}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState;