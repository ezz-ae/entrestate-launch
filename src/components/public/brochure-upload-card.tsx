'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'processing' | 'done' | 'failed';

interface BrochureUploadCardProps {
  title: string;
  description: string;
  ctaLabel: string;
}

export function BrochureUploadCard({ title, description, ctaLabel }: BrochureUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || (status !== 'uploaded' && status !== 'processing')) return;
    const interval = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/upload/pdf/status?jobId=${jobId}`);
        const payload = await res.json().catch(() => null);
        if (!res.ok || !payload?.ok) {
          setStatus('failed');
          setError(payload?.error || 'Unable to read processing status.');
          return;
        }
        const nextStatus: UploadStatus = payload.data?.status || 'processing';
        setStatus(nextStatus);
        if (nextStatus === 'done') {
          setSummary(payload.data?.text?.slice(0, 420) || null);
        }
        if (nextStatus === 'failed') {
          setError(payload.data?.error || 'Processing failed.');
        }
      } catch {
        setStatus('failed');
        setError('Network error while checking status.');
      }
    }, 2500);
    return () => window.clearInterval(interval);
  }, [jobId, status]);

  const handleUpload = async () => {
    if (!file || status === 'uploading') return;
    setStatus('uploading');
    setError(null);
    setSummary(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        setStatus('failed');
        setError(payload?.error || 'Upload failed.');
        return;
      }
      setJobId(payload.data?.jobId || null);
      setStatus(payload.data?.status || 'uploaded');
    } catch {
      setStatus('failed');
      setError('Upload failed. Please try again.');
    }
  };

  const statusLabel = (() => {
    switch (status) {
      case 'uploading':
        return 'Uploading brochure…';
      case 'uploaded':
      case 'processing':
        return 'Extracting key details…';
      case 'done':
        return 'Draft summary ready.';
      case 'failed':
        return 'Upload failed.';
      default:
        return '';
    }
  })();

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">{title}</h2>
      <p className="text-gray-700 mb-4 text-center">{description}</p>
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
        <div className="text-5xl text-gray-400 mb-2">📄</div>
        <input
          type="file"
          accept=".pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="w-full text-sm text-gray-600"
        />
        {statusLabel && <p className="mt-2 text-xs text-gray-500">{statusLabel}</p>}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
      {summary && (
        <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          {summary}…
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading'}
        className="bg-navy-700 hover:bg-navy-800 disabled:bg-gray-300 disabled:text-gray-600 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
      >
        {ctaLabel}
      </button>
      {status === 'done' && (
        <Link
          href="/builder"
          className="mt-3 text-xs font-semibold text-navy-700 text-center"
        >
          Continue in Builder →
        </Link>
      )}
    </div>
  );
}
