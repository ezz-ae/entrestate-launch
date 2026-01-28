'use client';

import React, { useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

interface ChatDemoCardProps {
  title: string;
  intro: string;
  placeholder: string;
  buttonLabel: string;
  context?: string;
  endpoint?: string;
}

export function ChatDemoCard({
  title,
  intro,
  placeholder,
  buttonLabel,
  context,
  endpoint = '/api/agent/demo',
}: ChatDemoCardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: intro },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = input.trim().length > 0 && !loading;

  const historyPayload = useMemo(
    () =>
      messages.map((entry) => ({
        role: entry.role === 'assistant' ? 'agent' : 'user',
        text: entry.text,
      })),
    [messages]
  );

  const handleSend = async () => {
    if (!canSend) return;
    const message = input.trim();
    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: historyPayload, context }),
      });
      const payload = await res.json().catch(() => null);
      const reply = payload?.data?.reply || payload?.reply;
      if (!res.ok || !payload?.ok) {
        const messageText =
          payload?.error?.message ||
          payload?.error ||
          'Unable to respond right now. Please try again.';
        setError(messageText);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply || 'Thanks for the details. What budget and area should I focus on?' },
      ]);
    } catch (err) {
      setError('Network error. Please try again.');
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
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#c7a36b]">Live</span>
      </div>
      <div className="flex-grow flex flex-col rounded-2xl border border-white/10 bg-[#0f0e0c] p-4 mb-4 min-h-[260px]">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`text-sm text-[#e8e1d8] p-3 rounded-2xl max-w-[85%] border border-white/10 ${
                msg.role === 'user'
                  ? 'self-end rounded-br-sm bg-[#1f1a14]'
                  : 'self-start rounded-bl-sm bg-[#12100e]'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex-grow" />
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0b0a09] px-3 py-2 text-sm text-[#f5f1e8] placeholder:text-[#6f665c] focus:outline-none focus:ring-2 focus:ring-[#c7a36b]/40"
        />
      </div>
      {error && <p className="text-xs text-[#f5a3a3] mb-3">{error}</p>}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="w-full rounded-xl bg-[#c7a36b] text-[#0b0a09] font-semibold py-3 text-sm uppercase tracking-[0.2em] transition disabled:opacity-50"
      >
        {loading ? 'Sending…' : buttonLabel}
      </button>
    </div>
  );
}
