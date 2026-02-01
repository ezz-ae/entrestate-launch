'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

export default function AssetsDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Library</h1>
        <p className="text-muted-foreground">Store brochures, images, and brand files.</p>
      </div>

      <Card className="bg-zinc-900 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-400">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <UploadCloud className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Uploads are disabled</p>
              <p className="text-xs text-zinc-500">
                Asset storage will open once S3 credentials are configured.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Required: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_REGION`.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
