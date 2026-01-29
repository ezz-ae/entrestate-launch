import React, { useState, useEffect } from 'react';
import { getProjectBrandingAction } from '../app/actions/ai';
import { submitLead } from '../app/actions/project';
import QuickReply from './QuickReply';
import '../mobile-styles.css';

/**
 * Public-facing AI Chat Widget.
 * Uses the project owner's branding kit for colors and logo.
 */
const ChatWidgetBlock = ({ projectId, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brandKit, setBrandKit] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI property assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchBranding = async () => {
      const kit = await getProjectBrandingAction(projectId);
      if (kit) setBrandKit(kit);
    };
    if (projectId && projectId !== 'preview') fetchBranding();
  }, [projectId]);

  const handleSend = async (textOverride) => {
    const content = textOverride || input;
    if (!content.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    setIsTyping(true);

    // Lead Capture Heuristic: Detect contact info and trigger capture
    const emailMatch = content.match(/\S+@\S+\.\S+/);
    const phoneMatch = content.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

    if (emailMatch || phoneMatch) {
      const formData = new FormData();
      formData.append('name', 'Chat Prospect');
      if (emailMatch) formData.append('email', emailMatch[0]);
      if (phoneMatch) formData.append('phone', phoneMatch[0]);
      
      try {
        // Fire and forget lead capture
        submitLead(projectId === 'preview' ? 'demo-project' : projectId, formData);
      } catch (e) {
        console.error("Silent lead capture failed", e);
      }
    }

    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'That sounds great! Would you like to schedule a viewing or get more details?' }]);
      setIsTyping(false);
    }, 1500);
  };

  const primaryColor = brandKit?.primaryColor || '#007AFF';

  if (!isOpen && !isPreview) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: primaryColor, color: 'white',
          border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer', fontSize: '24px', zIndex: 1000
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div className={isPreview ? "" : "marketing-agent-container"} style={isPreview ? { height: '400px', position: 'relative', bottom: 0, right: 0, width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' } : {}}>
      {/* Header */}
      <div style={{ padding: '16px', backgroundColor: primaryColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {brandKit?.logo && (
            <img src={brandKit.logo} alt="Logo" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain', backgroundColor: 'white', padding: '2px' }} />
          )}
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>AI Assistant</h3>
        </div>
        {!isPreview && (
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-secondary)' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '10px 14px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.4',
            backgroundColor: msg.role === 'user' ? primaryColor : 'var(--bg-primary)',
            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
            border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            AI is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <QuickReply 
          replies={brandKit?.quickReplies} 
          onSelect={handleSend} 
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '20px',
              border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)', outline: 'none', fontSize: '14px'
            }}
          />
          <button 
            onClick={() => handleSend()}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: primaryColor, color: 'white',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetBlock;