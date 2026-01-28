'use client';

import ChatAgentFunnel from '@/components/marketing/funnels/chat-agent-funnel';
import { LabShell } from '../lab-shell';

export default function ChatAgentLabPage() {
  return (
    <LabShell title="Chat Agent Funnel">
      <div className="rounded-2xl border border-white/10 bg-white">
        <ChatAgentFunnel />
      </div>
    </LabShell>
  );
}
