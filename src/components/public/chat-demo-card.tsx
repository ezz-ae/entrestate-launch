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
    <div className="relative h-full rounded-3xl border border-white/10 bg-[#101829]/90 p-6 shadow-[0_20px_60px_rgba(4,10,24,0.55)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#f4f7ff] font-[var(--font-display)]">
          {title}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#7aa5ff]">Live</span>
      </div>
      <div className="flex-grow flex flex-col rounded-2xl border border-white/10 bg-[#0b1222] p-4 mb-4 min-h-[320px]">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`text-sm text-[#e8edf7] p-4 rounded-2xl max-w-[85%] border border-white/10 shadow-sm ${
                msg.role === 'user'
                  ? 'self-end rounded-br-sm bg-[#1b243a]'
                  : 'self-start rounded-bl-sm bg-[#0f172a]'
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
          className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-3 py-2 text-sm text-[#f4f7ff] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7aa5ff]/40"
        />
      </div>
      {error && <p className="text-xs text-[#ffb3b3] mb-3">{error}</p>}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="w-full rounded-xl bg-[#7aa5ff] text-[#0a0f1c] font-semibold py-3 text-sm uppercase tracking-[0.2em] transition disabled:opacity-50"
      >
        {loading ? 'Sending…' : buttonLabel}
      </button>
    </div>
  );
}
