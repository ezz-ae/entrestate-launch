import React, { useEffect, useMemo, useState } from 'react';
import './mobile-styles.css';
import { apiFetch } from '@/shared/api/client';
import type { ChatConversation, ChatConversationsResponse } from '@/shared/types/chat-agent';

interface ChatAgentDashboardProps {
  onBack: () => void;
  onUpdateKnowledge: () => void;
  onViewChat: (chat: ChatConversation) => void;
  onShowQR: () => void;
  onTestSimulator: () => void;
  onNavigateTo: (screen: string) => void; // New prop for navigation
}

const ChatAgentDashboard: React.FC<ChatAgentDashboardProps> = ({
  onBack,
  onUpdateKnowledge,
  onViewChat,
  onShowQR,
  onTestSimulator,
  onNavigateTo,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [pausedChats, setPausedChats] = useState<string[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [dmsHandled, setDmsHandled] = useState(0);
  const [meetingsBooked, setMeetingsBooked] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    const result = await apiFetch<ChatConversationsResponse>('/api/chat-agent/conversations?limit=20');
    if (!result.ok || !result.data) {
      const message =
        typeof result.error === 'string'
          ? result.error
          : (result.error as any)?.message || 'Unable to load conversations.';
      setError(message);
      setLoading(false);
      return;
    }

    setConversations(result.data.items);
    setPausedChats(result.data.items.filter((conv) => conv.paused).map((conv) => conv.senderId));
    const totalDMs = result.data.items.reduce((sum, conv) => sum + conv.messages.length, 0);
    setDmsHandled(totalDMs);
    setMeetingsBooked(Math.floor(totalDMs / 10));
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
    const interval = window.setInterval(() => {
      fetchConversations(true);
    }, 8000);
    return () => window.clearInterval(interval);
  }, []);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString();
  };

  const getLastAssistantMessage = (messages: ChatConversation['messages']) => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === 'assistant') {
        return messages[i];
      }
    }
    return undefined;
  };

  const toggleTakeover = async (senderId: string) => {
    const isPaused = pausedChats.includes(senderId);
    setPausedChats((prev) =>
      isPaused ? prev.filter((id) => id !== senderId) : [...prev, senderId]
    );
    const endpoint = isPaused ? '/api/chat-agent/unpause' : '/api/chat-agent/pause';
    const response = await apiFetch<{ senderId: string; paused: boolean }>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId }),
    });
    if (!response.ok) {
      setPausedChats((prev) =>
        isPaused ? [...prev, senderId] : prev.filter((id) => id !== senderId)
      );
      const message =
        typeof response.error === 'string'
          ? response.error
          : (response.error as any)?.message || 'Unable to update chat status.';
      setError(message);
    }
  };

  const handleChatClick = (chat: ChatConversation) => {
    onViewChat(chat);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      {/* Custom Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Digital Consultant</h1>
      </div>

      {/* Status Card */}
      <div className="chat-dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>Status</span>
            <h2 style={{ margin: 0, fontSize: '28px' }}>{isActive ? 'Online 🟢' : 'Paused ⏸️'}</h2>
          </div>
          <div 
            onClick={() => setIsActive(!isActive)}
            style={{
              width: '60px', height: '32px', backgroundColor: isActive ? '#10B981' : '#4B5563', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '26px', height: '26px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isActive ? '31px' : '3px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          {isActive ? 'Actively handling inquiries and booking meetings.' : 'Paused. Manual replies required.'}
        </p>
        
        <button 
          onClick={onTestSimulator}
          style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Test a Conversation
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>💬</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{dmsHandled}</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>DMs Handled</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-accent)', padding: '16px', borderRadius: '16px', border: '1px solid var(--primary-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>📅</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-color)' }}>{meetingsBooked}</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--primary-color)', textTransform: 'uppercase', fontWeight: '700' }}>Meetings Booked</span>
        </div>
      </div>

      {/* Live Feed */}
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Live Activity</h3>
      <div className="live-feed-container">
        {loading && (
          <div style={{ padding: '12px', color: 'var(--text-secondary)' }}>Loading conversations…</div>
        )}
        {!loading && error && (
          <div style={{ padding: '12px', color: '#EF4444' }}>{error}</div>
        )}
        {!loading && !error && conversations.length === 0 && (
          <div style={{ padding: '12px', color: 'var(--text-secondary)' }}>
            No conversations yet. Start a test to see activity.
          </div>
        )}
        {conversations.map(conv => {
          const isPaused = pausedChats.includes(conv.senderId);
          const lastMessage = conv.messages[conv.messages.length - 1];
          const aiReply = getLastAssistantMessage(conv.messages);
          return (
            <div 
              key={conv.id} 
              className="chat-message-preview" 
              style={{ borderLeftColor: isPaused ? '#EF4444' : '#10B981', cursor: 'pointer' }}
              onClick={() => handleChatClick(conv)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '12px' }}>{conv.senderId}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPaused && <span className="takeover-badge takeover-active">✋ Manual Reply</span>}
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {lastMessage ? lastMessage.text : 'No messages yet.'}
              </p>
              {!isPaused && aiReply && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600' }}>{aiReply.text}</div>
              )}
              <button className="takeover-btn" onClick={(e) => { e.stopPropagation(); toggleTakeover(conv.senderId); }}>
                {isPaused ? '▶️ Resume Assisted Replies' : '✋ Reply Manually'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Knowledge Base Quick Action */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
        <button 
          onClick={() => onNavigateTo('consultantLearning')}
          style={{ 
          padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>📋</span>
          <span style={{ fontSize: '12px' }}>Manage Learning Content</span>
        </button>
        <button 
          onClick={onShowQR}
          style={{ 
          padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>🏁</span>
          <span style={{ fontSize: '12px' }}>Get QR Code</span>
        </button>
      </div>
    </div>
  );
};

export default ChatAgentDashboard;
