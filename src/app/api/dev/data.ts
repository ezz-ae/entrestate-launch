// Dev fixtures and recent sends store with optional disk persistence.
// Keep this runtime-only and minimal so it works in the Next.js dev server.
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const STORE_PATH = path.join(CACHE_DIR, 'dev-sends.json');
const JOB_STORE_PATH = path.join(CACHE_DIR, 'dev-jobs.json');

export const projects = [
  {
    id: 'dev-project-1',
    headline: 'Demo Project — Sky Residences',
    description: 'A beautiful modern condominium with sea views and great amenities.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-project-2',
    headline: 'Demo Project — Oak Villas',
    description: 'Family homes in a quiet suburban neighborhood.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const leads = [
  { id: 'lead-1', name: 'Sarah Miller', email: 'sarah@example.com', phone: '+15551230001', projectId: 'dev-project-1', status: 'New', createdAt: new Date().toISOString() },
  { id: 'lead-2', name: 'Mike Ross', email: 'mike@example.com', phone: '+15551230002', projectId: 'dev-project-2', status: 'Contacted', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'lead-3', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+15551230003', projectId: 'dev-project-1', status: 'New', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export const recentSends: any[] = [];
export const recentJobs: any[] = [];

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function loadFromDisk() {
  try {
    if (!fs.existsSync(STORE_PATH)) return;
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      recentSends.splice(0, recentSends.length, ...parsed);
    }
  } catch (e) {
    // ignore
  }
}

function loadJobsFromDisk() {
  try {
    if (!fs.existsSync(JOB_STORE_PATH)) return;
    const raw = fs.readFileSync(JOB_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      recentJobs.splice(0, recentJobs.length, ...parsed);
    }
  } catch (e) {
    // ignore
  }
}

function saveToDisk() {
  try {
    ensureCacheDir();
    fs.writeFileSync(STORE_PATH, JSON.stringify(recentSends.slice(0, 100), null, 2), 'utf-8');
  } catch (e) {
    // ignore
  }
}

function saveJobsToDisk() {
  try {
    ensureCacheDir();
    fs.writeFileSync(JOB_STORE_PATH, JSON.stringify(recentJobs.slice(0, 100), null, 2), 'utf-8');
  } catch (e) {
    // ignore
  }
}

// initialize from disk
loadFromDisk();
loadJobsFromDisk();

export function addSend(entry: any) {
  const e = { id: `${entry.type || 'send'}-${Date.now()}`, ts: new Date().toISOString(), ...entry };
  recentSends.unshift(e);
  // keep bounded history
  if (recentSends.length > 100) recentSends.splice(100);
  saveToDisk();
  return e;
}

export function addJob(entry: any) {
  const e: any = { id: `${entry.type || 'job'}-${Date.now()}`, ts: new Date().toISOString(), status: 'queued', ...entry };
  // initialize logs
  e.logs = e.logs || [{ ts: new Date().toISOString(), message: 'job queued' }];
  recentJobs.unshift(e);
  if (recentJobs.length > 100) recentJobs.splice(100);
  saveJobsToDisk();
  // Start a simulated lifecycle for dev jobs so the UI can poll status.
  try {
    scheduleJobProgress(e.id);
  } catch (err) {
    // ignore in constrained runtimes
  }
  return e;
}

// Simple in-memory scheduler: transition queued -> running -> succeeded
const jobTimers: Record<string, NodeJS.Timeout[]> = {};

// SSE / broadcast listeners
type JobListener = (job: any) => void;
const jobListeners: Set<JobListener> = new Set();

export function addJobListener(fn: JobListener) {
  jobListeners.add(fn);
  return () => jobListeners.delete(fn);
}

export function removeJobListener(fn: JobListener) {
  jobListeners.delete(fn);
}

function updateJobStatus(id: string, status: string) {
  const idx = recentJobs.findIndex(j => j.id === id);
  if (idx === -1) return;
  const now = new Date().toISOString();
  recentJobs[idx] = { ...recentJobs[idx], status, updatedAt: now };
  // append a log entry
  try { recentJobs[idx].logs = recentJobs[idx].logs || []; recentJobs[idx].logs.push({ ts: now, message: `status=${status}` }); } catch (e) {}
  saveJobsToDisk();
  // notify listeners
  try {
    const jobCopy = { ...recentJobs[idx] };
    for (const l of jobListeners) {
      try { l(jobCopy); } catch (e) { /* ignore listener errors */ }
    }
  } catch (e) {
    // ignore
  }
}

function scheduleJobProgress(id: string) {
  // clear previous timers
  if (!jobTimers[id]) jobTimers[id] = [];
  // after short delay go to running
  const t1 = setTimeout(() => {
    updateJobStatus(id, 'running');
  }, 800);
  jobTimers[id].push(t1);

  // then finish
  const t2 = setTimeout(() => {
    // 90% success
    const success = Math.random() < 0.9;
    updateJobStatus(id, success ? 'succeeded' : 'failed');
    // cleanup timers
    if (jobTimers[id]) {
      jobTimers[id].forEach(t => clearTimeout(t));
      delete jobTimers[id];
    }
  }, 3800);
  jobTimers[id].push(t2);
}

export function cancelJob(id: string) {
  const idx = recentJobs.findIndex(j => j.id === id);
  if (idx === -1) return false;
  // clear any timers
  if (jobTimers[id]) {
    jobTimers[id].forEach(t => clearTimeout(t));
    delete jobTimers[id];
  }
  const now = new Date().toISOString();
  recentJobs[idx] = { ...recentJobs[idx], status: 'cancelled', updatedAt: now };
  try { recentJobs[idx].logs = recentJobs[idx].logs || []; recentJobs[idx].logs.push({ ts: now, message: 'job cancelled' }); } catch (e) {}
  saveJobsToDisk();
  // notify listeners
  try {
    const jobCopy = { ...recentJobs[idx] };
    for (const l of jobListeners) {
      try { l(jobCopy); } catch (e) { /* ignore */ }
    }
  } catch (e) {}
  return true;
}

export function getJobLogs(id: string) {
  const job = (recentJobs || []).find(j => j.id === id);
  if (!job) return null;
  return job.logs || [];
}

export function retryJob(id: string) {
  const orig = (recentJobs || []).find(j => j.id === id);
  if (!orig) return null;
  // create a new job entry referencing parent
  const newJob = addJob({ type: `retry`, name: `Retry of ${orig.name || orig.id}`, parentId: id });
  // append a log on the original job
  try { const now = new Date().toISOString(); orig.logs = orig.logs || []; orig.logs.push({ ts: now, message: `requeued as ${newJob.id}` }); saveJobsToDisk(); } catch (e) {}
  return newJob;
}

export function clearSends() {
  recentSends.splice(0, recentSends.length);
  saveToDisk();
}

export function clearJobs() {
  recentJobs.splice(0, recentJobs.length);
  saveJobsToDisk();
}

