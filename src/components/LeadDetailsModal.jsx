import React, { useState, useEffect } from 'react';
import { LeadScreeningBadges } from '../app/actions/LeadScreeningBadges';
import { LeadSummaryCard } from '../app/actions/LeadSummaryCard';
import { generateReviveLeadMessageAction, summarizeLeadAction, generateBulkReviveCampaignAction, connectInstagramDMAction } from '../app/actions/ai';
import { calculateLeadScore, triggerCampaign, getCampaignLogsAction, exportLeadsByProjectAction, getLeadsForExport } from '../app/actions/leads';
import SmartSenderDashboard from './SmartSenderDashboard';
import ChatHistoryModal from './ChatHistoryModal';
import ShareModal from './ShareModal';


const LeadDetailsModal = ({ project, onClose, onLeadSelect }) => {
  const [recordingId, setRecordingId] = useState(null);
  const [loadingReviveId, setLoadingReviveId] = useState(null);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'history'
  const [notes, setNotes] = useState({}); // Store notes by lead ID
  const [summaries, setSummaries] = useState({}); // leadId -> summary
  const [loadingSummaries, setLoadingSummaries] = useState({}); // leadId -> bool
  const [showSmartSender, setShowSmartSender] = useState(false);
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showShareAgent, setShowShareAgent] = useState(false);
  const [isConnectingIG, setIsConnectingIG] = useState(false);
  const [leadScores, setLeadScores] = useState({});
  const [displayLeads, setDisplayLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingLeads(true);
      try {
        const data = await getLeadsForExport();
        const filtered = data.filter(l => l.project_id === project.id);
        setDisplayLeads(filtered);
        
        const scores = {};
        for (const lead of filtered) {
          scores[lead.id] = await calculateLeadScore(lead);
        }
        setLeadScores(scores);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingLeads(false);
      }
    };
    loadData();
  }, [project.id]);

  const fetchSummary = async (leadId) => {
    if (summaries[leadId] || loadingSummaries[leadId]) return;

    setLoadingSummaries(prev => ({ ...prev, [leadId]: true }));
    try {
      const result = await summarizeLeadAction(leadId);
      if (result.success) {
        setSummaries(prev => ({ ...prev, [leadId]: result.summary }));
      }
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const fetchHistory = async () => {
    if (campaignHistory.length > 0) return;
    setIsLoadingHistory(true);
    try {
      const logs = await getCampaignLogsAction(project.id);
      setCampaignHistory(logs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleVoiceNote = (e, leadId) => {
    e.stopPropagation();
    
    if (recordingId === leadId) {
      // Stop recording
      setRecordingId(null);
      return;
    }

    // Start recording simulation (or actual API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      setRecordingId(leadId);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNotes(prev => ({ ...prev, [leadId]: transcript }));
        setRecordingId(null);
      };
    } else {
      alert("Voice recording not supported on this browser.");
    }
  };

  const handleReviveLead = async (e, lead) => {
    e.stopPropagation();
    if (loadingReviveId) return;

    setLoadingReviveId(lead.id);
    try {
      const result = await generateReviveLeadMessageAction(lead.id, project.id);
      if (result.success) {
        const encodedMsg = encodeURIComponent(result.message);
        window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate message");
    } finally {
      setLoadingReviveId(null);
    }
  };

  const handleSendCampaign = async (type, text) => {
    setIsSendingCampaign(true);
    const highIntentLeads = displayLeads.filter(l => calculateLeadScore(l) >= 5);
    try {
      const result = await triggerCampaign(type, text, highIntentLeads.map(l => l.id), project.id);
      if (result.success) {
        alert(result.message);
        setShowSmartSender(false);
      }
    } catch (error) {
      alert("Failed to send campaign");
    } finally {
      setIsSendingCampaign(false);
    }
  };

  const handleExportLeads = async () => {
    setIsExporting(true);
    try {
      const result = await exportLeadsByProjectAction(project.id);
      if (result.success) {
        const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", result.fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      alert("Failed to export leads");
    } finally {
      setIsExporting(false);
    }
  };

  const handleConnectInstagram = async () => {
    const handle = prompt("Enter your Instagram handle (e.g. luxury_homes_dxb):");
    if (!handle) return;

    setIsConnectingIG(true);
    try {
      const result = await connectInstagramDMAction(project.id, handle);
      alert(result.message);
    } catch (error) {
      alert("Failed to connect Instagram");
    } finally {
      setIsConnectingIG(false);
    }
  };

  if (!project) return null;

  const agentLink = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.chat.entrestate.com`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>{project.name}</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>{project.leads} Leads Generated</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleConnectInstagram}
              disabled={isConnectingIG}
              style={{ background: 'var(--bg-accent)', border: 'none', borderRadius: '8px', padding: '0 12px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--primary-color)', opacity: isConnectingIG ? 0.6 : 1 }}
            >
              {isConnectingIG ? '⌛' : '📸 Connect IG'}
            </button>
            <button 
              onClick={() => setShowShareAgent(true)}
              style={{ background: 'var(--bg-accent)', border: 'none', borderRadius: '8px', padding: '0 12px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--primary-color)' }}
            >
              🔗 Share Agent
            </button>
            <button 
              onClick={() => setShowChatHistory(true)}
              style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px', padding: '0 12px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              💬 Chats
            </button>
            <button 
              onClick={onClose} 
              style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', color: '#4B5563' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
          <button 
            onClick={() => setActiveTab('leads')}
            style={{ flex: 1, padding: '12px', border: 'none', background: 'none', fontSize: '14px', fontWeight: activeTab === 'leads' ? '700' : '500', color: activeTab === 'leads' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'leads' ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer' }}
          >
            Leads
          </button>
          <button 
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            style={{ flex: 1, padding: '12px', border: 'none', background: 'none', fontSize: '14px', fontWeight: activeTab === 'history' ? '700' : '500', color: activeTab === 'history' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'history' ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer' }}
          >
            History
          </button>
        </div>

        {/* Leads List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {activeTab === 'leads' ? (
            displayLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <p>No leads received yet.</p>
            </div>
          ) : (
            displayLeads.map(lead => (
              <div key={lead.id} className="lead-item" onClick={() => {
                onLeadSelect(lead);
                fetchSummary(lead.id);
              }} style={{ cursor: 'pointer' }}>
                <div className="lead-info" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="lead-name">{lead.name}</span>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: '800', 
                      color: leadScores[lead.id] >= 5 ? '#059669' : 'var(--text-secondary)',
                      backgroundColor: leadScores[lead.id] >= 5 ? '#D1FAE5' : 'var(--bg-tertiary)',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      border: '1px solid currentColor'
                    }}>
                      Score: {leadScores[lead.id] || 0}/8
                    </span>
                    <LeadScreeningBadges screening={lead.screening} />
                  </div>
                  <span className="lead-time">{lead.time}</span>
                  {notes[lead.id] && (
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', fontStyle: 'italic' }}>
                      📝 "{notes[lead.id]}"
                    </div>
                  )}
                  {recordingId === lead.id && (
                    <div className="recording-ui">
                      🔴 Listening...
                    </div>
                  )}
                  <LeadSummaryCard 
                    summary={summaries[lead.id]} 
                    isLoading={loadingSummaries[lead.id]} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => handleReviveLead(e, lead)}
                    disabled={loadingReviveId === lead.id}
                    style={{ background: 'var(--bg-accent)', border: 'none', borderRadius: '8px', padding: '0 12px', height: '36px', cursor: loadingReviveId === lead.id ? 'wait' : 'pointer', fontSize: '12px', fontWeight: '600', color: 'var(--primary-color)', opacity: loadingReviveId === lead.id ? 0.6 : 1 }}
                  >
                    {loadingReviveId === lead.id ? '⏳' : '✨ Revive'}
                  </button>
                  <button 
                    onClick={(e) => handleVoiceNote(e, lead.id)}
                    style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}
                  >
                    {recordingId === lead.id ? '⏹️' : '🎙️'}
                  </button>
                  <a href={`tel:${lead.phone}`} className="lead-action" onClick={e => e.stopPropagation()}>
                    📞 Call
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px 0' }}>
              {isLoadingHistory ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
              ) : campaignHistory.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No campaigns sent yet.</div>
              ) : (
                campaignHistory.map(log => (
                  <div key={log.id} style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                        {log.type === 'email' ? '📧 Email' : '📱 SMS'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {new Date(log.createdAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', margin: '0 0 8px 0', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{log.content}</p>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Sent to {log.leadIds?.length || 0} leads
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleExportLeads}
            disabled={isExporting}
            className="primary-button" style={{ height: '48px', fontSize: '14px', flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)', opacity: isExporting ? 0.6 : 1 }}>
            {isExporting ? 'Exporting...' : 'Download CSV'}
          </button>
          <button 
            onClick={() => setShowSmartSender(!showSmartSender)}
            className="primary-button" style={{ height: '48px', fontSize: '14px', flex: 2 }}>
            {showSmartSender ? 'Close Dashboard' : '✨ Smart Outreach'}
          </button>
        </div>

        {showSmartSender && (
          <div style={{ padding: '0 20px 20px 20px' }}>
            <SmartSenderDashboard 
              leadIds={displayLeads.filter(l => leadScores[l.id] >= 5).map(l => l.id)}
              projectId={project.id}
              isSending={isSendingCampaign}
              onSend={handleSendCampaign}
            />
          </div>
        )}

        {showChatHistory && (
          <ChatHistoryModal 
            projectId={project.id}
            projectName={project.name}
            onClose={() => setShowChatHistory(false)}
          />
        )}

        {showShareAgent && (
          <ShareModal 
            url={agentLink} 
            title="Share Chat Agent"
            onClose={() => setShowShareAgent(false)} 
            showQRCode={true}
          />
        )}
      </div>
    </div>
  );
};

export default LeadDetailsModal;