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
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">{title}</h2>
      <div className="flex-grow flex flex-col bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`text-sm text-gray-700 bg-gray-100 p-3 rounded-xl shadow-sm max-w-[85%] ${
                msg.role === 'user' ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex-grow"></div>
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="bg-navy-700 hover:bg-navy-800 disabled:bg-gray-300 disabled:text-gray-600 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
      >
        {loading ? 'Sending…' : buttonLabel}
      </button>
    </div>
  );
}
