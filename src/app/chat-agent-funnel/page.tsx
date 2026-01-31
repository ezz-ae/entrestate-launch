'use client';

import React from 'react';
import ChatAgentFunnel from '@/components/marketing/funnels/chat-agent-funnel';
import { SiteHeader } from '@/components/layout/site-header';

export default function ChatAgentFunnelPage() {
  return (
    <>
      <SiteHeader />
      <ChatAgentFunnel />
    </>
  );
}
