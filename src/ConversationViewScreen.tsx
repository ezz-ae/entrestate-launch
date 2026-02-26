import React from 'react';
import './mobile-styles.css';
import { InstagramConversation, Message } from '@/components/ChatAgentDashboard'; // Import updated interfaces

interface ConversationViewScreenProps {
  chat: InstagramConversation | null; // Use new interface
  onBack: () => void;
}

const ConversationViewScreen: React.FC<ConversationViewScreenProps> = ({ chat, onBack }) => {
  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '18px' }}>{chat?.senderId || 'Chat'}</h1>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>● AI Active</span>
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="chat-history-container">
        {chat?.messages.map((msg: Message, index: number) => (
          <div key={index} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
            {msg.text}
            <span style={{ 
              fontSize: '10px', 
              marginTop: '4px', 
              opacity: 0.7, 
              display: 'block', 
              textAlign: msg.role === 'user' ? 'right' : 'left',
              color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'
            }}>
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Takeover Action */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        width: '100%', 
        padding: '16px 24px', 
        backgroundColor: 'var(--bg-primary)', 
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button className="takeover-btn" style={{ width: '100%', padding: '16px', fontSize: '14px' }}>✋ Takeover Conversation</button>
      </div>
    </div>
  );
};

export default ConversationViewScreen;