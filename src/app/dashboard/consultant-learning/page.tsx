'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function ConsultantLearningPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultant Learning</h1>
        <p className="text-muted-foreground">Train assistants with approved answers and resources.</p>
      </div>

      <Card className="bg-zinc-900 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-400">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Knowledge base sync is disabled</p>
              <p className="text-xs text-zinc-500">
                Connect a data source before enabling consultant learning.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Required: source connection + indexing pipeline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
