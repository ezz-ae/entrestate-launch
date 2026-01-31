import React, { useState } from 'react';
import { generateSmartSequenceAction } from '../app/actions/ai';

const SmartSenderDashboard = ({ leadIds, projectId, onSend, isSending }) => {
  const [campaignType, setCampaignType] = useState('followup');
  const [sequence, setSequence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const campaignTypes = [
    { id: 'launch', label: '🚀 Launch', desc: 'New project announcement' },
    { id: 'event', label: '📅 Event', desc: 'Invite to roadshow/viewing' },
    { id: 'followup', label: '🤝 Follow-up', desc: 'Nurture existing interest' },
    { id: 'sales', label: '💰 Sales', desc: 'Direct ROI & pricing push' },
    { id: 'public_holiday', label: '🎉 Holiday', desc: 'Festive greetings & offers' },
    { id: 'limited_offer', label: '⏳ Limited', desc: 'Urgency & flash deals' },
  ];

  const handleGenerateSequence = async () => {
    setIsLoading(true);
    try {
      const result = await generateSmartSequenceAction(leadIds, projectId, campaignType);
      if (result.success) {
        setSequence(result.sequence);
      }
    } catch (error) {
      alert("Failed to generate sequence");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => setIsScheduled(false), 3000);
    alert("Sequence scheduled for optimal delivery times!");
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', marginTop: '12px' }}>
      <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Smart Sender Dashboard</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        {campaignTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setCampaignType(type.id)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: `1px solid ${campaignType === type.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: campaignType === type.id ? 'var(--bg-accent)' : 'var(--bg-primary)',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{type.label}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{type.desc}</div>
          </button>
        ))}
      </div>

      {!sequence ? (
        <button 
          onClick={handleGenerateSequence}
          disabled={isLoading}
          style={{ width: '100%', height: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'Analyzing Leads...' : '✨ Generate Smart Sequence'}
        </button>
      ) : (
        <div style={{ marginTop: '16px' }}>
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '12px', 
            lineHeight: '1.5', 
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-primary)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {sequence}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              onClick={() => onSend('email', sequence)}
              disabled={isSending}
              style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              📧 Send Email
            </button>
            <button 
              onClick={() => onSend('sms', sequence)}
              disabled={isSending}
              style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isSending ? 'Sending...' : '📱 Send SMS'}
            </button>
            <button 
              onClick={handleSchedule}
              disabled={isScheduled}
              style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid var(--primary-color)', backgroundColor: 'transparent', color: 'var(--primary-color)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isScheduled ? '✅ Scheduled' : '📅 Schedule'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSenderDashboard;