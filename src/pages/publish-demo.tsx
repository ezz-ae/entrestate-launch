import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const PublishControls = dynamic(() => import('@/components/PublishControls'), { ssr: false });

export default function PublishDemoPage() {
  // For demo/testing, use a fake siteId
  const [siteId] = useState('demo-site-id');
  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Publish Controls Demo</h1>
      <PublishControls siteId={siteId} initialStatus="draft" />
    </div>
  );
}
