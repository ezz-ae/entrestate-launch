'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

export default function BrandDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand</h1>
        <p className="text-muted-foreground">Keep your logo and colors consistent.</p>
      </div>

      <Card className="bg-zinc-900 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-400">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <Palette className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Brand kit editor is in progress</p>
              <p className="text-xs text-zinc-500">
                We will enable logo uploads, fonts, and color presets once storage is connected.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Temporary workaround: upload assets via support and we can seed your brand kit manually.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
