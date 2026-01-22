import React from 'react';
import ChatAgentLearningDashboard from '../../../../components/ai-tools/chat-agent-learning-dashboard';

export default function Page() {
  // agentId could be taken from route params in a follow-up iteration
  return (
    <main style={{ padding: 24 }}>
      <ChatAgentLearningDashboard />
    </main>
  );
}
