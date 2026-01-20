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
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{title}</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: '1.5' }}>{message}</p>
      <button 
        onClick={onAction}
        style={{
          backgroundColor: 'var(--primary-color, #000)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState;