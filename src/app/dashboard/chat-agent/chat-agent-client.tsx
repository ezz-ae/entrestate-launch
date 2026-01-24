'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InteractiveAgentCreator } from '@/components/ai-tools/interactive-agent-creator';
import ChatAgentLearningDashboard from '@/components/ai-tools/chat-agent-learning-dashboard';
import { cn } from '@/lib/utils';

type ChatAgentTab = 'studio' | 'training';

export default function ChatAgentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryTab = searchParams?.get('tab') === 'training' ? 'training' : 'studio';
  const [activeTab, setActiveTab] = useState<ChatAgentTab>(queryTab);

  useEffect(() => {
    setActiveTab(queryTab);
  }, [queryTab]);

  const handleTabChange = (nextTab: ChatAgentTab) => {
    setActiveTab(nextTab);
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (nextTab === 'training') {
      params.set('tab', 'training');
    } else {
      params.delete('tab');
    }
    const query = params.toString();
    router.replace(query ? `/dashboard/chat-agent?${query}` : '/dashboard/chat-agent', { scroll: false });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Chat Assistant</p>
          <h1 className="text-3xl font-bold text-white">Agent Studio</h1>
          <p className="text-zinc-500 text-sm">Configure your assistant or manage training uploads.</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => handleTabChange('studio')}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
              activeTab === 'studio' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            )}
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('training')}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
              activeTab === 'training' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            )}
          >
            Training
          </button>
        </div>
      </div>

      {activeTab === 'studio' ? <InteractiveAgentCreator /> : <ChatAgentLearningDashboard />}
    </div>
  );
}
