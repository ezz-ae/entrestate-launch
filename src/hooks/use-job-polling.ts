import { useState, useEffect, useRef } from 'react';

export type JobStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

export interface JobResponse<T = any> {
  status: JobStatus;
  data?: T;
  error?: string;
}

/**
 * Polls an API endpoint for job status until completion or failure.
 * 
 * @param jobId - The ID of the job to poll. Pass null to stop/reset.
 * @param apiEndpoint - The base endpoint (e.g., '/api/jobs'). The hook appends '/{jobId}'.
 * @param intervalMs - Polling interval in milliseconds (default 2000ms).
 */
export function useJobPolling<T = any>(
  jobId: string | null,
  apiEndpoint: string = '/api/jobs',
  intervalMs: number = 2000
) {
  const [jobState, setJobState] = useState<JobResponse<T>>({ status: 'idle' });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset state if jobId is cleared
    if (!jobId) {
      setJobState({ status: 'idle' });
      return;
    }

    const poll = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/${jobId}`);
        
        if (!res.ok) {
          // Keep polling on 500s or network blips, or handle specific codes here
          console.warn(`Polling warning: ${res.status} ${res.statusText}`);
        } else {
          const data: JobResponse<T> = await res.json();
          setJobState(data);

          // Stop polling if finished
          if (data.status === 'completed' || data.status === 'failed') {
            return; 
          }
        }
      } catch (error) {
        console.error('Polling fetch error:', error);
      }

      // Schedule next poll
      timeoutRef.current = setTimeout(poll, intervalMs);
    };

    setJobState({ status: 'pending' });
    poll();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [jobId, apiEndpoint, intervalMs]);

  return jobState;
}