import React, { useState } from 'react';
import StickyFooter from '@/components/StickyFooter';
import './mobile-styles.css';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes?: string;
}

interface LeadNurtureScreenProps {
  lead: Lead;
  onBack: () => void;
  onUpdateStatus: (status: string) => void;
}

const LeadNurtureScreen: React.FC<LeadNurtureScreenProps> = ({ lead, onBack, onUpdateStatus }) => {
  const [note, setNote] = useState('');
  const [timeline, setTimeline] = useState([
    { id: 1, type: 'event', text: 'Lead captured via Website', time: '2 days ago' },
    { id: 2, type: 'email', text: 'Welcome email sent', time: '2 days ago' },
    { id: 3, type: 'call', text: 'Missed call', time: 'Yesterday' },
  ]);

  const handleAddNote = () => {
    if (!note.trim()) return;
    setTimeline([{ id: Date.now(), type: 'note', text: note, time: 'Just now' }, ...timeline]);
    setNote('');
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}
        >
          ←
        </button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Lead Details</h1>
      </div>

      {/* Lead Info Card */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{lead.name}</h2>
            <span style={{ 
              fontSize: '12px', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              backgroundColor: '#EFF6FF', 
              color: '#1D4ED8',
              fontWeight: '600'
            }}>
              {lead.status}
            </span>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            👤
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <a href={`tel:${lead.phone}`} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#15803D', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
          }}>
            📞 Call
          </a>
          <a href={`mailto:${lead.email}`} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#1D4ED8', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
          }}>
            ✉️ Email
          </a>
          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#166534', textDecoration: 'none', fontWeight: '600', fontSize: '14px', gridColumn: 'span 2'
          }}>
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Quick Actions</h3>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
        {['Interested', 'Follow Up', 'Not Interested', 'Booked'].map(status => (
          <button
            key={status}
            onClick={() => onUpdateStatus(status)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: lead.status === status ? 'var(--text-primary)' : 'white',
              color: lead.status === status ? 'white' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Timeline / Notes */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Activity & Notes</h3>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="text" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
          }}
        />
        <button 
          onClick={handleAddNote}
          disabled={!note.trim()}
          style={{
            padding: '0 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: note.trim() ? 1 : 0.5
          }}
        >
          Add
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {timeline.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: item.type === 'note' ? '#FEF3C7' : '#F3F4F6', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0
            }}>
              {item.type === 'note' ? '📝' : item.type === 'call' ? '📞' : item.type === 'email' ? '✉️' : '📅'}
            </div>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{item.text}</p>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <StickyFooter label="Schedule Meeting" onClick={() => alert('Opening calendar...')} />
    </div>
  );
};

export default LeadNurtureScreen;