'use client';

import React, { useState } from 'react';

interface ColdCallDemoCardProps {
  title: string;
  buttonLabel: string;
  topics: Array<{ value: string; label: string }>;
  context?: string;
}

function buildPreviewScript(phone: string, focus: string) {
  return `Preview call script (no call placed):\n\nHi there, this is Entrestate. I’m calling about ${focus}.\n\nQuick question: what budget range and preferred area should we focus on? We can share details via WhatsApp (${phone}).\n\nIf this is not a fit, let me know and I will stop following up.`;
}

export function ColdCallDemoCard({ title, buttonLabel, topics, context }: ColdCallDemoCardProps) {
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    if (!phone.trim() || !topic.trim()) {
      setError('Please enter a phone number and select a focus.');
      return;
    }
    setError(null);
    setPreview(buildPreviewScript(phone.trim(), topic));
    setLoading(true);
    try {
      await fetch('/api/agent/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Call preview request. Phone: ${phone.trim()}. Focus: ${topic}.`,
          context,
        }),
      });
    } catch {
      // Request is best-effort; preview still renders.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full rounded-3xl border border-white/10 bg-[#14110f]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#f7f1e6] font-[var(--font-display)]">
          {title}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#c7a36b]">Preview</span>
      </div>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b0a09] px-3 py-2 text-sm text-[#f5f1e8] placeholder:text-[#6f665c] focus:outline-none focus:ring-2 focus:ring-[#c7a36b]/40 mb-3"
      />
      <select
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b0a09] px-3 py-2 text-sm text-[#f5f1e8] focus:outline-none focus:ring-2 focus:ring-[#c7a36b]/40 mb-3"
      >
        <option value="">Call me to discuss:</option>
        {topics.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#f5a3a3] mb-3">{error}</p>}
      <button
        onClick={handlePreview}
        disabled={loading}
        className="w-full rounded-xl bg-[#c7a36b] text-[#0b0a09] font-semibold py-3 text-sm uppercase tracking-[0.2em] transition disabled:opacity-50"
      >
        {loading ? 'Saving…' : buttonLabel}
      </button>
      {preview && (
        <div className="mt-4 text-xs text-[#d9d1c6] whitespace-pre-line rounded-xl bg-[#0f0e0c] border border-white/10 p-3">
          {preview}
        </div>
      )}
    </div>
  );
}
