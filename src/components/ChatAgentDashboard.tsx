'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import './mobile-styles.css';
import { getDbSafe } from '@/lib/firebase/client';
import { collection, query, orderBy, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import ForgivingInput from './ForgivingInput';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import * as tus from 'tus-js-client';

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
  onUpdateKnowledge: (data: any) => Promise<{ success: boolean; errors?: Record<string, string[]> }>;
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
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [agentState, setAgentState] = useState<'draft' | 'configured' | 'active' | 'paused' | 'archived'>('draft');
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
  const [versions, setVersions] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!user?.id) return;

    const updateLocalState = (data: any) => {
      if (!data) return;
      setAgentName(data.name || 'Sarah');
      setCompanyName(data.company_name || 'Elite Properties');
      setCommunicationStyle(data.style || 'professional');
      setCompanyDetails(data.profile?.details || '');
      setExclusiveListing(data.listings?.[0] || '');
      setContactDetails(data.contact?.info || '');
      setTextData(data.system_prompt || '');
      setExistingFileUrls(data.file_urls || []);
      setAgentState(data.state || 'draft');
    };

    const fetchAgentData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }

      const { data, error } = await supabase
        .from('chat_agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching agent data:', error);
        return;
      }

      if (data) {
        updateLocalState(data);
      }

      // Fetch versions
      const { data: versionData } = await supabase
        .from('agent_versions')
        .select('*')
        .eq('agent_id', data?.id)
        .order('version', { ascending: false });
      if (versionData) setVersions(versionData);
    };

    fetchAgentData();

    // Subscribe to real-time changes using Broadcast (via DB Trigger)
    // This is more scalable than postgres_changes for high-traffic apps
    const channel = supabase
      .channel(`agent:${user.id}`, { config: { private: true } })
      .on(
        'broadcast',
        { event: 'INSERT' },
        ({ payload }) => {
          updateLocalState(payload);
        }
      )
      .on(
        'broadcast',
        { event: 'UPDATE' },
        ({ payload }) => {
          updateLocalState(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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
    setUploadProgress(0);
    setFormErrors({});
    try {
      const uploadedUrls: string[] = [];
      
      // Multi-part Resumable Upload using TUS
      let completedFiles = 0;
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user?.id}/${fileName}`;
        
        const { data: { session } } = await supabase.auth.getSession();
        
        await new Promise((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
              authorization: `Bearer ${session?.access_token}`,
              'x-upsert': 'true',
            },
            metadata: {
              bucketName: 'agent-knowledge',
              objectName: filePath,
              contentType: file.type,
            },
            chunkSize: 6 * 1024 * 1024, // 6MB chunks
            onError: (error) => reject(error),
            onProgress: (bytesUploaded, bytesTotal) => {
              const fileProgress = (bytesUploaded / bytesTotal) * 100;
              const totalProgress = ((completedFiles * 100) + fileProgress) / files.length;
              setUploadProgress(Math.round(totalProgress));
            },
            onSuccess: () => {
              const { data: { publicUrl } } = supabase.storage.from('agent-knowledge').getPublicUrl(filePath);
              uploadedUrls.push(publicUrl);
              completedFiles++;
              resolve(null);
            },
          });
          upload.start();
        });
      }

      const result = await onUpdateKnowledge({
        agentName,
        companyName,
        communicationStyle,
        companyDetails,
        exclusiveListing,
        contactDetails,
        textData,
        state: agentState === 'paused' ? 'paused' : 'active',
        fileUrls: [...existingFileUrls, ...uploadedUrls]
      });

      if (result.success) {
        alert('Settings saved successfully!');
        setFiles([]);
      } else if (result.errors) {
        setFormErrors(result.errors);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
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
            <h2 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{agentState === 'active' ? 'Online 🟢' : 'Paused ⏸️'}</h2>
          </div>
          <div 
            onClick={() => setAgentState(agentState === 'active' ? 'paused' : 'active')}
            style={{
              width: '60px', height: '32px', backgroundColor: agentState === 'active' ? '#10B981' : '#4B5563', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '26px', height: '26px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: agentState === 'active' ? '31px' : '3px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          {agentState === 'active' ? 'Actively handling inquiries and booking meetings.' : 'Paused. Manual replies required.'}
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

      {activeTab === 'identity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ForgivingInput 
            label="Consultant Name" 
            value={agentName} 
            onChange={(e) => setAgentName(e.target.value)} 
          />
          {formErrors.agentName && <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px' }}>{formErrors.agentName[0]}</span>}
          <ForgivingInput 
            label="Company Name" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
          />
          {formErrors.companyName && <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px' }}>{formErrors.companyName[0]}</span>}
          <div>
            <label className="control-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)' }}>Communication Style</label>
            <select
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              className="setup-select"
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="direct">Direct</option>
            </select>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="primary-button"
            style={{ marginTop: '12px' }}
          >
            {isSaving ? 'Saving...' : 'Save Identity Settings'}
          </button>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
            {(['structured', 'text', 'file'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setKnowledgeTab(t)}
                style={{ 
                  flex: 1, padding: '8px', borderRadius: '6px', border: 'none', fontSize: '12px',
                  backgroundColor: knowledgeTab === t ? 'var(--bg-primary)' : 'transparent',
                  color: knowledgeTab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: '600'
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {knowledgeTab === 'structured' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ForgivingInput label="Company Details" placeholder="What does your company do?" value={companyDetails} onChange={(e) => setCompanyDetails(e.target.value)} />
              {formErrors.companyDetails && <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-8px' }}>{formErrors.companyDetails[0]}</span>}
              <ForgivingInput label="Exclusive Listings" placeholder="Details about specific properties..." value={exclusiveListing} onChange={(e) => setExclusiveListing(e.target.value)} />
              {formErrors.exclusiveListing && <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-8px' }}>{formErrors.exclusiveListing[0]}</span>}
              <ForgivingInput label="Contact Info" placeholder="Phone, Email, Office Location..." value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} />
              {formErrors.contactDetails && <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-8px' }}>{formErrors.contactDetails[0]}</span>}
            </div>
          )}

          {knowledgeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>System Prompt (Brain)</label>
                <textarea 
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                  placeholder="Define how your agent thinks and acts..."
                  style={{ width: '100%', height: '150px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none' }}
                />
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Version History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {versions.map((v) => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '700' }}>v{v.version}</span>
                      <span style={{ opacity: 0.6 }}>{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {knowledgeTab === 'text' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Raw Knowledge Data</label>
              <textarea 
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder="Paste any additional text, FAQs, or notes here..."
                style={{ width: '100%', height: '200px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none' }}
              />
              {formErrors.textData && <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'block', marginTop: '4px' }}>{formErrors.textData[0]}</span>}
            </div>
          )}

          {knowledgeTab === 'file' && (
            <div style={{ textAlign: 'center', padding: '32px', border: '2px dashed var(--border-color)', borderRadius: '16px' }}>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} multiple accept=".pdf,.doc,.docx,.txt" />
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Upload brochures or floor plans (PDF, DOCX)</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'none', color: 'var(--primary-color)', fontWeight: '600' }}
              >
                Select Files
              </button>
              
              {existingFileUrls.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Existing Files:</p>
                  {existingFileUrls.map((url, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-primary)', padding: '4px 0' }}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                        • {url.split('/').pop()}
                      </a>
                      <button onClick={() => setExistingFileUrls(existingFileUrls.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>New Files to Upload:</p>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-primary)', padding: '4px 0' }}>
                      <span>• {f.name}</span>
                      <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isSaving && uploadProgress > 0 && (
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease' }} />
              <p style={{ fontSize: '10px', textAlign: 'center', marginTop: '4px', color: 'var(--text-secondary)' }}>Uploading files: {uploadProgress}%</p>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="primary-button"
          >
            {isSaving ? 'Processing...' : 'Update Knowledge Base'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatAgentDashboard;
