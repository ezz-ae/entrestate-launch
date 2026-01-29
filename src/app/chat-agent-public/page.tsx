import React from 'react';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const ChatAgentPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,165,255,0.28),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(64,201,198,0.22),_transparent_60%)]" />
        <div className="relative mx-auto max-w-2xl px-6 py-12 lg:py-20">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-4">Real Estate Intelligence</h1>
              <p className="text-zinc-400">Ground your assistant in live UAE inventory. No hallucinations, just data.</p>
            </div>
            <ChatDemoCard
              title="Project Expert Demo"
              intro="Ask about a project, payment plan, or availability. The agent replies and asks what matters next."
              placeholder="Ask about a listing..."
              buttonLabel="Open Chat"
              context="Chat agent public demo."
              endpoint="/api/agent/demo"
            />
        </div>
      </section>
    </FunnelShell>
  );
};

export default ChatAgentPublicPage;
