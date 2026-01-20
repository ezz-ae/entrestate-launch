'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides login/signup functionality
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EntrestateLogo } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await logIn(email, password);
      }
      router.push('/dashboard'); // Redirect to dashboard after successful login/register
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <Card className="w-full max-w-md bg-zinc-950 border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <EntrestateLogo showText={true} className="h-10 w-auto" />
          </div>
          <CardTitle className="text-3xl font-bold mt-4">
            {isRegister ? 'Create an Account' : 'Welcome Back!'}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isRegister ? 'Join Entrestate to manage your projects.' : 'Sign in to access your dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-zinc-900 border-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-zinc-900 border-white/5 text-white"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRegister ? 'Register' : 'Login')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="text-blue-500 hover:underline px-0">
              {isRegister ? 'Login' : 'Register'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
