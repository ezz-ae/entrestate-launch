'use client';

import BuilderFunnel from '@/components/marketing/funnels/builder-funnel';
import { LabShell } from '../lab-shell';

export default function BuilderLabPage() {
  return (
    <LabShell title="Builder Funnel">
      <div className="rounded-2xl border border-white/10 bg-white">
        <BuilderFunnel />
      </div>
    </LabShell>
  );
}
