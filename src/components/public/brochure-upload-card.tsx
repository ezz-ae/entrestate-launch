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
    <div className="relative h-full rounded-3xl border border-white/10 bg-[#101829]/90 p-6 shadow-[0_20px_60px_rgba(4,10,24,0.55)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#f4f7ff] font-[var(--font-display)]">
          {title}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#ff9ad5]">PDF</span>
      </div>
      <p className="text-sm text-[#b7c3df] mb-4">{description}</p>
      <div className="flex-grow flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0b1222] p-4 mb-4 text-center">
        <div className="text-4xl text-[#6b7280] mb-3">⬇</div>
        <input
          type="file"
          accept=".pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="w-full text-xs text-[#cbd5f5]"
        />
        {statusLabel && <p className="mt-2 text-xs text-[#94a3b8]">{statusLabel}</p>}
        {error && <p className="mt-2 text-xs text-[#ffb3b3]">{error}</p>}
      </div>
      {summary && (
        <div className="text-xs text-[#dbe2f7] bg-[#0b1222] border border-white/10 rounded-xl p-3 mb-3">
          {summary}…
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading'}
        className="w-full rounded-xl bg-[#ff9ad5] text-[#0a0f1c] font-semibold py-3 text-sm uppercase tracking-[0.2em] transition disabled:opacity-50"
      >
        {ctaLabel}
      </button>
      {status === 'done' && (
        <Link
          href="/builder"
          className="mt-3 text-xs font-semibold text-[#ff9ad5] text-center"
        >
          Continue in Builder →
        </Link>
      )}
    </div>
  );
}
