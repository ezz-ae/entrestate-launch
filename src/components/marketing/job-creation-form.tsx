'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useJobPolling } from '@/hooks/use-job-polling';
import { useAuth } from '@/AuthContext';
import { FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

type JobType = 'WRITE_COPY' | 'DESIGN_IMAGE' | 'CREATE_CAMPAIGN';

interface FormData {
  type: JobType;
  prompt: string;
}

export interface JobCreationFormProps {
  defaultType?: JobType;
  initialPrompt?: string;
  contextData?: any; // Data from Inventory, Ads, Site Builder, etc.
  contextLabel?: string; // e.g. "Property: Villa #102"
  className?: string;
  isEmbedded?: boolean;
}

export function JobCreationForm({ 
  defaultType = 'WRITE_COPY', 
  initialPrompt = '', 
  contextData,
  contextLabel,
  className = '',
  isEmbedded = false
}: JobCreationFormProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const { user } = useAuth();
  const loading = false;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { type: defaultType, prompt: initialPrompt }
  });

  // 1. Poll for status once we have a jobId
  // This assumes your polling API is at /api/jobs/[id]
  const { status, data, error } = useJobPolling(jobId);

  const onSubmit = async (formData: FormData) => {
    if (!user && !FIREBASE_AUTH_DISABLED) {
      alert('You must be logged in to create a job.');
      return;
    }

    try {
      setJobId(null); // Reset previous job tracking
      let headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (!FIREBASE_AUTH_DISABLED) {
        const token = await (user as any).getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      // 2. Call the API to create the job
      const res = await fetch('/api/marketing/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: formData.type,
          payload: { 
            prompt: formData.prompt,
            // Pass the context (Inventory item, Ad settings) to the agent
            context: contextData 
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to create job');

      const responseData = await res.json();
      
      // 3. Set the ID to start polling
      setJobId(responseData.jobId);
    } catch (err) {
      console.error(err);
      alert('Error submitting job');
    }
  };

  return (
    <div className={isEmbedded ? className : `p-6 border rounded-lg shadow-sm bg-white max-w-lg ${className}`}>
      {!isEmbedded && <h2 className="text-xl font-bold mb-4">Vertex Marketing Agent</h2>}
      
      {/* Show context label if we are working on a specific item */}
      {contextLabel && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100 flex items-center gap-2">
          <span className="font-semibold">Context:</span> {contextLabel}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Task Type</label>
          <select {...register('type')} className="w-full border p-2 rounded bg-background">
            <option value="WRITE_COPY">Write Copy</option>
            <option value="DESIGN_IMAGE">Design Image</option>
            <option value="CREATE_CAMPAIGN">Create Campaign</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea 
            {...register('prompt', { required: 'Prompt is required', minLength: { value: 10, message: 'Min 10 chars' } })} 
            className="w-full border p-2 rounded bg-background" 
            rows={4}
            placeholder="Describe what you need..."
          />
          {errors.prompt && <p className="text-red-500 text-sm mt-1">{errors.prompt.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || status === 'processing' || loading || !user}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'processing' ? 'Agent Working...' : 'Start Job'}
        </button>
      </form>

      {/* Status & Results Display */}
      {jobId && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className={`text-sm font-bold uppercase ${
              status === 'completed' ? 'text-green-600' : 
              status === 'failed' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {status}
            </span>
          </div>
          
          {status === 'completed' && data && (
            <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Result:</p>
              <div className="whitespace-pre-wrap">
                {data.content || data.imageUrl || JSON.stringify(data, null, 2)}
              </div>
            </div>
          )}

          {status === 'failed' && (
            <p className="text-red-600 text-sm mt-2">Error: {error}</p>
          )}
        </div>
      )}
    </div>
  );
}