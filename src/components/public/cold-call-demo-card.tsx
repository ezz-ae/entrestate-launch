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
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">{title}</h2>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
      />
      <select
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
      >
        <option value="">Call me to discuss:</option>
        {topics.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <button
        onClick={handlePreview}
        disabled={loading}
        className="bg-navy-700 hover:bg-navy-800 disabled:bg-gray-300 disabled:text-gray-600 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
      >
        {loading ? 'Saving…' : buttonLabel}
      </button>
      {preview && (
        <div className="mt-4 text-xs text-gray-600 whitespace-pre-line rounded-lg bg-gray-50 border border-gray-200 p-3">
          {preview}
        </div>
      )}
    </div>
  );
}
