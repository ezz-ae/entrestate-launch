import React from 'react';
import dynamic from 'next/dynamic';

const DomainManager = dynamic(() => import('@/components/DomainManager'), { ssr: false });
const DomainSearchAndBuy = dynamic(() => import('@/components/DomainSearchAndBuy'), { ssr: false });

export default function DomainToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Domain Management & Search</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <DomainManager />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <DomainSearchAndBuy />
        </div>
      </div>
    </div>
  );
}
