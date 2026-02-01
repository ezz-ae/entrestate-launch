import React from 'react';
import { ChatDemoCard } from '@/components/public/chat-demo-card';
import { FunnelShell } from '@/components/public/funnel-shell';

const InstagramAssistantPublicPage = () => {
  return (
    <FunnelShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,213,0.22),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(122,165,255,0.2),_transparent_60%)]" />
        <div className="relative mx-auto max-w-2xl px-6 py-20 lg:py-28">
            <ChatDemoCard
              title="DMs stop being chaos. They become a queue."
              intro="Send a DM. The assistant replies, clarifies, and marks intent in the thread."
              placeholder="Send a DM about a listing..."
              buttonLabel="Send DM"
              context="Instagram assistant public demo."
              endpoint="/api/agent/demo"
            />
        </div>
      </section>
    </FunnelShell>
  );
};

export default InstagramAssistantPublicPage;
