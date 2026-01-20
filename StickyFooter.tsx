import React from 'react';

interface StickyFooterProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ label, onClick, disabled }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px 24px 32px', // Extra padding for safe area on mobile
      backgroundColor: 'white',
      borderTop: '1px solid #E5E7EB',
      zIndex: 100,
      maxWidth: '480px', // Matches App.tsx max-width
      margin: '0 auto'
    }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: disabled ? '#E5E7EB' : 'var(--primary-color, #000)',
          color: disabled ? '#9CA3AF' : 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '16px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {label}
      </button>
    </div>
  );
};

export default StickyFooter;