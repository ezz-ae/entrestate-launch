'use client';

export interface JobStep {
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: string;
  error?: string;
  timestamp: number;
}

export interface Job {
  id: string;
  ownerUid: string;
  type: 'site_generation' | 'ad_campaign' | 'seo_audit' | 'site_refiner';
  status: 'queued' | 'running' | 'done' | 'error';
  plan: {
    flowId: string;
    steps: string[];
    params: Record<string, any>;
  };
  steps: JobStep[];
  result?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const createJob = async (ownerUid: string, type: Job['type'], params: any) => {
  const response = await fetch('/api/jobs/client', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, params }),
  });
  if (!response.ok) return null;
  return (await response.json()) as Job;
};

export const getJobs = async (_ownerUid: string) => {
  try {
    const response = await fetch('/api/jobs/client');
    if (!response.ok) return [];
    const payload = await response.json();
    return (payload.jobs || []) as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const subscribeToJobs = (ownerUid: string, callback: (jobs: Job[]) => void) => {
  let active = true;
  const poll = async () => {
    if (!active) return;
    const jobs = await getJobs(ownerUid);
    if (active) callback(jobs);
  };
  poll();
  const interval = setInterval(poll, 5000);
  return () => {
    active = false;
    clearInterval(interval);
  };
};

export const processJob = async (jobId: string) => {
  try {
    await fetch('/api/jobs/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'process', jobId }),
    });
  } catch (error) {
    console.error('Error processing job:', error);
  }
};
