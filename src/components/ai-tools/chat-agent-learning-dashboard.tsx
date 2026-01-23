'use client';

import React, { useEffect, useState } from 'react';
import { KnowledgeUploader } from './knowledge-uploader';
import './learning-styles.css';

export default function ChatAgentLearningDashboard({ agentId }: { agentId?: string }) {
  const [trainingJobs, setTrainingJobs] = useState<any[]>([]);
  const [recentSends, setRecentSends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const jobPollRef = React.useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Try loading persisted dev sends (dev-friendly)
        const s = await fetch('/api/dev/sends');
        if (s.ok) {
          const js = await s.json();
          if (mounted) setRecentSends(js.recentSends || []);
        }
      } catch (e) {
        // ignore in prod
      }

      // Try loading simulated training jobs (dev)
      try {
        const j = await fetch('/api/dev/jobs');
        if (j.ok) {
          const json = await j.json();
          if (mounted) setTrainingJobs(json.recentJobs || []);
        }
      } catch (e) {
        // ignore
        if (mounted) setTrainingJobs([]);
      }
      setLoading(false);
    }
    load();
    // Poll jobs periodically so the UI shows lifecycle transitions
    const iv = setInterval(() => {
      (async () => {
        try {
          const j = await fetch('/api/dev/jobs');
          if (!j.ok) return;
          const json = await j.json();
          if (mounted) setTrainingJobs(json.recentJobs || []);
        } catch (e) {
          // ignore polling errors in dev
        }
      })();
    }, 2000);
    // cleanup interval
    return () => { mounted = false; clearInterval(iv); };
  }, [agentId]);

  // Open a job detail and start per-job polling
  function openJob(id: string) {
    setSelectedJobId(id);
    // clear any previous poll
    if (jobPollRef.current) {
      clearInterval(jobPollRef.current);
      jobPollRef.current = null;
    }

    const fetchOne = async () => {
      try {
        const res = await fetch(`/api/dev/jobs/${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const j = await res.json();
        setSelectedJob(j.job || null);
        // stop if finished
        if (j.job && (j.job.status === 'succeeded' || j.job.status === 'failed')) {
          if (jobPollRef.current) { clearInterval(jobPollRef.current); jobPollRef.current = null; }
        }
      } catch (e) {
        // ignore
      }
    };

    // fetch immediately and then poll
    fetchOne();
    const iv = setInterval(fetchOne, 1500) as unknown as number;
    jobPollRef.current = iv;
  }

  function closeJob() {
    setSelectedJobId(null);
    setSelectedJob(null);
    if (jobPollRef.current) { clearInterval(jobPollRef.current); jobPollRef.current = null; }
  }

  // SSE subscription for live updates (dev)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/dev/jobs/stream');
      es.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload && payload.type === 'job:update' && payload.job) {
            const job = payload.job;
            setTrainingJobs(prev => {
              const idx = prev.findIndex(p => p.id === job.id);
              if (idx === -1) return [job, ...prev].slice(0, 100);
              const copy = [...prev]; copy[idx] = job; return copy;
            });
            if (selectedJobId === job.id) setSelectedJob(job);
          }
        } catch (e) {
          // ignore parse errors
        }
      };
      es.onerror = () => {
        try { es?.close(); } catch (e) {}
      };
    } catch (e) {
      // EventSource not supported or network error — polling remains as fallback
    }
    return () => { try { es?.close(); } catch (e) {} };
  }, [selectedJobId]);

  function onUploadSuccess(fileName: string) {
    // add a lightweight training job entry for UI feedback
    const localJob = { id: `job-${Date.now()}`, name: fileName, status: 'queued', ts: new Date().toISOString() };
    setTrainingJobs(prev => [localJob, ...prev]);

    // Persist a simulated job in dev so it appears across reloads
    try {
      fetch('/api/dev/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'upload', name: fileName }) }).then(() => {}).catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="learning-dashboard" style={{ padding: 24 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Learning Dashboard</h2>
      <p style={{ marginTop: 6, color: 'var(--text-secondary)' }}>Upload brochures and documents to teach the AI about your projects. Monitor recent training activity and evaluation runs.</p>

      <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>Knowledge Uploader</h4>
            <KnowledgeUploader onUploadSuccess={onUploadSuccess} />
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>Quick Actions</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              <button onClick={() => alert('Run evaluation (not implemented)')} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'inherit' }}>Run Evaluation</button>
              <button onClick={async () => {
                try {
                  const res = await fetch('/api/dev/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'retrain', name: 'Manual retrain' }) });
                  if (res.ok) {
                    const js = await res.json();
                    setTrainingJobs(prev => [js.job, ...prev]);
                  } else {
                    alert('Failed to start retrain');
                  }
                } catch (e) {
                  alert('Failed to contact dev jobs endpoint');
                }
              }} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'inherit' }}>Retrain Agent</button>
              <button onClick={async () => { if (!confirm('Clear local dev sends?')) return; await fetch('/api/dev/sends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'meta', action: 'clear' }) }); setRecentSends([]); }} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'rgba(248, 113, 113, 0.16)', color: 'inherit' }}>Clear Dev Sends</button>
              <button onClick={async () => { if (!confirm('Clear local dev jobs?')) return; await fetch('/api/dev/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'meta', action: 'clear' }) }); setTrainingJobs([]); }} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'rgba(248, 113, 113, 0.16)', color: 'inherit' }}>Clear Dev Jobs</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: 0 }}>Recent Training Jobs</h4>
            {loading && <div style={{ marginTop: 8 }}>Loading…</div>}
            {!loading && trainingJobs.length === 0 && <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>No recent jobs.</div>}
            {trainingJobs.map(job => (
              <div key={job.id} onClick={() => openJob(job.id)} style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                <div style={{ fontWeight: 700 }}>{job.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{job.status} • {new Date(job.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: 0 }}>Recent Dev Activity</h4>
            {recentSends.length === 0 && <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>No dev activity yet.</div>}
            {recentSends.map(s => (
              <div key={s.id} style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'var(--bg-secondary)' }}>
                <div style={{ fontWeight: 700 }}>{s.type.toUpperCase()} → {s.to}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.result?.success ? 'OK' : JSON.stringify(s.result)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{new Date(s.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedJob && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{selectedJob.name || selectedJob.id}</strong>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedJob.status} • {new Date(selectedJob.ts).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selectedJob.status !== 'succeeded' && selectedJob.status !== 'failed' && selectedJob.status !== 'cancelled' && (
                <button onClick={async () => {
                  if (!selectedJobId) return;
                  try {
                    const r = await fetch(`/api/dev/jobs/${encodeURIComponent(selectedJobId)}/cancel`, { method: 'POST' });
                    if (r.ok) {
                      setSelectedJob((s) => s ? { ...s, status: 'cancelled' } : s);
                      setTrainingJobs(prev => prev.map(j => j.id === selectedJobId ? { ...j, status: 'cancelled' } : j));
                    } else {
                      alert('Failed to cancel job');
                    }
                  } catch (e) { alert('Failed to contact server'); }
                }} style={{ padding: '6px 8px', borderRadius: 8 }}>Cancel</button>
              )}
              { (selectedJob.status === 'failed' || selectedJob.status === 'cancelled') && (
                <button onClick={async () => {
                  if (!selectedJobId) return;
                  try {
                    const r = await fetch(`/api/dev/jobs/${encodeURIComponent(selectedJobId)}/retry`, { method: 'POST' });
                    if (!r.ok) { alert('Retry failed'); return; }
                    const js = await r.json();
                    if (js && js.job) {
                      // add the new job to the list and open it
                      setTrainingJobs(prev => [js.job, ...prev]);
                      setSelectedJobId(js.job.id);
                      setSelectedJob(js.job);
                    } else {
                      alert('Retry did not return a job');
                    }
                  } catch (e) { alert('Failed to contact server'); }
                }} style={{ padding: '6px 8px', borderRadius: 8 }}>Retry</button>
              )}
              <button onClick={closeJob} style={{ padding: '6px 8px', borderRadius: 8 }}>Close</button>
            </div>
          </div>
          <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedJob, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
