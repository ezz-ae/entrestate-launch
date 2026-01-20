import React from 'react';

interface AgentSuccessWidgetProps {
  onAction: () => void;
}

const AgentSuccessWidget: React.FC<AgentSuccessWidgetProps> = ({ onAction }) => {
  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#F0FDF4', 
      border: '1px solid #BBF7D0', 
      borderRadius: '16px', 
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ fontSize: '24px' }}>🏆</div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#166534', margin: 0 }}>Top Agent: Sarah Miller</h3>
        <p style={{ fontSize: '12px', color: '#15803D', margin: '2px 0 0 0' }}>Closed 3 deals this week</p>
      </div>
      <button 
        onClick={onAction}
        style={{
          background: 'white',
          border: '1px solid #BBF7D0',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#166534',
          cursor: 'pointer'
        }}
      >
        View
      </button>
    </div>
  );
};

export default AgentSuccessWidget;