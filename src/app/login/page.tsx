'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your Entrestate account</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/start" className="font-medium text-blue-600 hover:text-blue-500">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
