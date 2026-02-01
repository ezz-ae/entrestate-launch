import React, { useState, useEffect } from 'react';
import { getChatsAction, toggleHumanTakeoverAction, sendHumanMessageAction, getBrandKitAction } from '../app/actions/ai';
import QuickReply from './QuickReply';

const ChatHistoryModal = ({ projectId, projectName, onClose }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isTakingOver, setIsTakingOver] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [brandKit, setBrandKit] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const data = await getChatsAction(projectId);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBrand = async () => {
      const kit = await getBrandKitAction();
      if (kit) setBrandKit(kit);
    };

    if (projectId) {
      fetchChats();
      fetchBrand();
    }
  }, [projectId]);

  const handleSendMessage = async (textOverride) => {
    const content = typeof textOverride === 'string' ? textOverride : newMessage;
    if (!content.trim() || isSending) return;
    setIsSending(true);
    try {
      const result = await sendHumanMessageAction(selectedChat.id, content);
      if (result.success) {
        // Update local UI
        const msg = {
          role: 'agent',
          content: content,
          timestamp: new Date().toISOString(),
          isHuman: true
        };
        setSelectedChat(prev => ({
          ...prev,
          conversation: [...(prev.conversation || []), msg]
        }));
        if (typeof textOverride !== 'string') setNewMessage('');
      }
    } catch (error) {
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleTakeover = async (chatId) => {
    setIsTakingOver(true);
    try {
      const result = await toggleHumanTakeoverAction(chatId, true);
      if (result.success) {
        setSelectedChat(prev => ({ ...prev, humanTakeover: true }));
      }
    } catch (error) {
      alert("Failed to pause AI");
    } finally {
      setIsTakingOver(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {brandKit?.logo && (
              <img src={brandKit.logo} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain' }} />
            )}
            <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>AI Chat History</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>{projectName}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', color: '#4B5563' }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading conversations...</p>
            </div>
          ) : chats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <p>No chat history found for this project.</p>
            </div>
          ) : selectedChat ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button 
                  onClick={() => setSelectedChat(null)}
                  style={{ background: 'none', border: 'none', color: brandKit?.primaryColor || 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}
                >
                  ← Back to list
                </button>
                <button
                  onClick={() => handleTakeover(selectedChat.id)}
                  disabled={isTakingOver || selectedChat.humanTakeover}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    backgroundColor: selectedChat.humanTakeover ? '#F3F4F6' : (brandKit?.primaryColor || 'var(--primary-color)'),
                    color: selectedChat.humanTakeover ? '#9CA3AF' : 'white',
                    border: 'none',
                    cursor: selectedChat.humanTakeover ? 'default' : 'pointer'
                  }}
                >
                  {selectedChat.humanTakeover ? '👤 Human in Control' : '✋ Take Over Chat'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedChat.conversation?.map((msg, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      backgroundColor: msg.role === 'user' ? (brandKit?.primaryColor || 'var(--primary-color)') : 'var(--bg-tertiary)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                      border: msg.isHuman ? `1px solid ${brandKit?.primaryColor || 'var(--primary-color)'}` : 'none'
                    }}
                  >
                    {msg.content}
                    {msg.isHuman && <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px' }}>Sent by you</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChat(chat)}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                        {chat.userContext?.name || chat.userContext?.handle || 'Anonymous User'}
                      </span>
                      {chat.sentiment && (
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontWeight: '700',
                          backgroundColor: chat.sentiment === 'high-intent' ? '#D1FAE5' : chat.sentiment === 'frustrated' ? '#FEE2E2' : 'var(--bg-tertiary)',
                          color: chat.sentiment === 'high-intent' ? '#059669' : chat.sentiment === 'frustrated' ? '#DC2626' : 'var(--text-secondary)',
                          border: '1px solid currentColor'
                        }}>
                          {chat.sentiment.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.conversation?.[chat.conversation.length - 1]?.content || 'No messages'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedChat && selectedChat.humanTakeover && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--bg-primary)', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isSending}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: brandKit?.primaryColor || 'var(--primary-color)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (isSending || !newMessage.trim()) ? 0.6 : 1
              }}
            >
              {isSending ? '...' : '➤'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryModal;