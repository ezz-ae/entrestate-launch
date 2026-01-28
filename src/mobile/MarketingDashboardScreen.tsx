import React, { useState, useEffect } from 'react';
import TemplateEditor from './TemplateEditor';
import './mobile-styles.css';

interface MarketingDashboardScreenProps {
  campaign?: any;
  onBack: () => void;
}

const MarketingDashboardScreen: React.FC<MarketingDashboardScreenProps> = ({ campaign, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, design, leads
  const [isEditing, setIsEditing] = useState(false);

  const [recipients, setRecipients] = useState<any[]>([]);
  const [recipsLoading, setRecipsLoading] = useState(false);
  const [recentSends, setRecentSends] = useState<any[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Dummy data if no campaign passed
  const data = campaign || {
    name: "October Newsletter",
    type: "Email Campaign",
    status: "Completed",
    sent: 1250,
    delivered: 1240,
    opened: 560,
    clicked: 125,
    preview: "Subject: Exclusive Pre-Launch in Downtown\n\nHi [Name],\n\nWe have a new opportunity that matches your investment criteria..."
  };

  const openRate = Math.round((data.opened / data.delivered) * 100);
  const clickRate = Math.round((data.clicked / data.opened) * 100);

  useEffect(() => {
    let mounted = true;
    async function loadFixtures() {
      setRecipsLoading(true);
      try {
        const resp = await fetch('/api/dev/fixtures', { headers: { Accept: 'application/json' } });
        if (!mounted) return;
        if (resp.ok) {
          const j = await resp.json();
          setRecipients(j.leads || []);
          // setRecentSends(j.recentSends || []);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setRecipsLoading(false);
      }
    }
    async function loadSends() {
      try {
        const s = await fetch('/api/dev/sends');
        if (s.ok) {
          const js = await s.json();
          setRecentSends(js.recentSends || []);
        }
      } catch (e) {
        // ignore
      }
    }
    loadSends();
    loadFixtures();
    return () => { mounted = false; };
  }, []);

  async function sendTestEmail(recipient: any) {
    if (!recipient?.email) return;
    setSendingId(recipient.id);
    try {
      const resp = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient.email, subject: `Test: ${data.name}`, body: `Hello ${recipient.name || ''}, this is a test email.` }),
        credentials: 'include',
      });
      const j = await resp.json();
      // persist to dev sends store
      try {
        await fetch('/api/dev/sends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'email', to: recipient.email, result: j }),
          credentials: 'include',
        });
      } catch (e) {
        // ignore
      }
      setRecentSends(prev => [{ id: `email-${Date.now()}`, type: 'email', to: recipient.email, result: j, ts: new Date().toISOString() }, ...prev]);
    } catch (e) {
      const errObj = { error: String(e) };
      try {
        await fetch('/api/dev/sends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'email', to: recipient.email, result: errObj }),
          credentials: 'include',
        });
      } catch (er) {}
      setRecentSends(prev => [{ id: `email-${Date.now()}`, type: 'email', to: recipient.email, result: errObj, ts: new Date().toISOString() }, ...prev]);
    } finally {
      setSendingId(null);
    }
  }

  async function sendTestSMS(recipient: any) {
    if (!recipient?.phone) return;
    setSendingId(recipient.id);
    try {
      const resp = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient.phone, message: `Test SMS to ${recipient.name || ''}` }),
        credentials: 'include',
      });
      const j = await resp.json();
      try {
        await fetch('/api/dev/sends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'sms', to: recipient.phone, result: j }),
          credentials: 'include',
        });
      } catch (e) {}
      setRecentSends(prev => [{ id: `sms-${Date.now()}`, type: 'sms', to: recipient.phone, result: j, ts: new Date().toISOString() }, ...prev]);
    } catch (e) {
      const errObj = { error: String(e) };
      try {
        await fetch('/api/dev/sends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'sms', to: recipient.phone, result: errObj }),
          credentials: 'include',
        });
      } catch (er) {}
      setRecentSends(prev => [{ id: `sms-${Date.now()}`, type: 'sms', to: recipient.phone, result: errObj, ts: new Date().toISOString() }, ...prev]);
    } finally {
      setSendingId(null);
    }
  }

  function downloadCSV() {
    if (!recipients || recipients.length === 0) return;
    const header = ['id', 'name', 'email', 'phone', 'projectId', 'status', 'createdAt'];
    const rows = recipients.map(r => [r.id, r.name || '', r.email || '', r.phone || '', r.projectId || '', r.status || '', r.createdAt || r.createdAt]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipients.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '18px' }}>{data.name}</h1>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>● {data.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        {['Overview', 'Design', 'Recipients'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--primary-color)' : 'none',
              color: activeTab === tab.toLowerCase() ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="marketing-stat-row">
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{data.sent}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sent</div>
            </div>
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>{openRate}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Open Rate</div>
            </div>
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-color)' }}>{clickRate}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Click Rate</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Delivery Funnel</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Delivered</span>
                <span>{data.delivered}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: '99%', height: '100%', backgroundColor: '#3B82F6' }}></div></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Opened</span>
                <span>{data.opened}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: `${openRate}%`, height: '100%', backgroundColor: '#10B981' }}></div></div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Clicked Link</span>
                <span>{data.clicked}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: `${(data.clicked/data.delivered)*100}%`, height: '100%', backgroundColor: '#F59E0B' }}></div></div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'design' && (
        isEditing ? (
          <TemplateEditor 
            initialContent={data.preview} 
            onSave={(newDesign: any) => {
              setIsEditing(false);
              alert("Design Saved!");
            }} 
          />
        ) : (
          <div className="marketing-preview-card">
            <div className="preview-header">
              <span>PREVIEW</span>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>✎ EDIT DESIGN</button>
            </div>
            <div className="preview-body" style={{ whiteSpace: 'pre-wrap' }}>
              {data.preview}
            </div>
          </div>
        )
      )}

      {activeTab === 'recipients' && (
        <div>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--text-secondary)' }}>{recipsLoading ? 'Loading recipients...' : `${recipients.length} recipients`}</div>
            <div>
              <button onClick={downloadCSV} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'none', color: 'var(--primary-color)' }}>Download CSV</button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {recipients.map(r => (
              <div key={r.id} style={{ padding: 12, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.name || r.email}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.email || ''} {r.phone ? `· ${r.phone}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button disabled={!r.email || sendingId === r.id} onClick={() => sendTestEmail(r)} style={{ padding: '8px 10px', borderRadius: 8, background: r.email ? 'var(--primary-color)' : '#333', color: 'white', border: 'none', cursor: r.email ? 'pointer' : 'not-allowed' }}>{sendingId === r.id ? 'Sending…' : 'Send test email'}</button>
                  <button disabled={!r.phone || sendingId === r.id} onClick={() => sendTestSMS(r)} style={{ padding: '8px 10px', borderRadius: 8, background: r.phone ? 'var(--bg-accent)' : '#333', color: r.phone ? 'var(--primary-color)' : '#888', border: '1px solid var(--border-color)', cursor: r.phone ? 'pointer' : 'not-allowed' }}>{sendingId === r.id ? 'Sending…' : 'Send test SMS'}</button>
                </div>
              </div>
            ))}
          </div>

          {recentSends.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ margin: '8px 0', color: 'var(--text-primary)' }}>Recent sends</h4>
              <div style={{ display: 'grid', gap: 6 }}>
                {recentSends.map(s => (
                  <div key={s.id} style={{ padding: 8, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: 13 }}>
                    <div style={{ fontWeight: 700 }}>{s.type.toUpperCase()} → {s.to}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.result?.success ? 'OK' : JSON.stringify(s.result)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{new Date(s.ts).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketingDashboardScreen;