'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import './mobile-styles.css';
import { getDbSafe } from '@/lib/firebase/client';
import { collection, query, orderBy, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import ForgivingInput from './ForgivingInput';

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface InstagramConversation {
  id: string;
  senderId: string;
  updatedAt: Date;
  messages: Message[];
  // Add other fields as needed, e.g., agentId, status
}

interface ChatAgentDashboardProps {
  onBack: () => void;
  onUpdateKnowledge: () => void;
  onViewChat: (chat: InstagramConversation) => void;
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
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(true);
  const [pausedChats, setPausedChats] = useState<string[]>([]); // Changed to string for senderId
  const [conversations, setConversations] = useState<InstagramConversation[]>([]);
  const [dmsHandled, setDmsHandled] = useState(0);
  const [meetingsBooked, setMeetingsBooked] = useState(0);

  const [activeTab, setActiveTab] = useState<'activity' | 'knowledge' | 'identity'>(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'knowledge' || tab === 'identity' || tab === 'activity') return tab as any;
    return 'activity';
  });

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'knowledge' || tab === 'identity' || tab === 'activity') {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  
  // Identity State
  const [agentName, setAgentName] = useState('Sarah');
  const [companyName, setCompanyName] = useState('Elite Properties');
  const [communicationStyle, setCommunicationStyle] = useState('professional');
  const [conversionGoal, setConversionGoal] = useState('booking');

  // Knowledge State
  const [knowledgeTab, setKnowledgeTab] = useState<'structured' | 'text' | 'file'>('structured');
  const [companyDetails, setCompanyDetails] = useState('');
  const [importantInfo, setImportantInfo] = useState('');
  const [exclusiveListing, setExclusiveListing] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [textData, setTextData] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const firestore = getDbSafe();
    if (!firestore) {
      console.error("Firestore DB is not initialized.");
      return;
    }

    const q = query(collection(firestore, 'instagram_conversations'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedConversations: InstagramConversation[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          updatedAt: data.updatedAt.toDate(), // Convert Firestore Timestamp to Date
          messages: data.messages.map((msg: any) => ({
            role: msg.role,
            text: msg.text,
            timestamp: msg.timestamp.toDate(), // Convert Firestore Timestamp to Date
          })),
        };
      });
      setConversations(fetchedConversations);

      // Update stats (simple count for now)
      let totalDMs = 0;
      fetchedConversations.forEach(conv => {
        totalDMs += conv.messages.length;
      });
      setDmsHandled(totalDMs);
      // Placeholder for meetings booked - needs real logic
      setMeetingsBooked(Math.floor(totalDMs / 10)); // Example: 1 meeting per 10 DMs
    });

    return () => unsubscribe();
  }, []);

  const toggleTakeover = (senderId: string) => { // Changed to senderId
    if (pausedChats.includes(senderId)) {
      setPausedChats(pausedChats.filter(id => id !== senderId));
    } else {
      setPausedChats([...pausedChats, senderId]);
    }
  };

  const handleChatClick = (chat: InstagramConversation) => {
    onViewChat(chat);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
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
            <h2 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{isActive ? 'Online 🟢' : 'Paused ⏸️'}</h2>
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

      {/* Tab Switcher */}
      <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px' }}>
        {(['activity', 'knowledge', 'identity'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none', 
              backgroundColor: activeTab === tab ? 'var(--bg-primary)' : 'transparent', 
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)', 
              fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'activity' && (
        <>
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

        <button 
          onClick={onShowQR}
          style={{ 
          padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>🏁</span>
          <span style={{ fontSize: '12px' }}>Get QR Code</span>
        </button>
        </>
      )}
    </div>
  );
};

export default ChatAgentDashboard;
