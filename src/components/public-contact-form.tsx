'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '@/app/actions/project';

export function PublicContactForm({ projectId, brandColor }: { projectId: string, brandColor?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email) {
      setError('Name and email are required.');
      return;
    }
    setStatus('submitting');
    try {
      await submitLead(projectId, new FormData((e.target as HTMLFormElement)));
      setStatus('success');
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setStatus('error');
      console.error(err);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Message Sent!</h3>
        <p className="text-zinc-400">We'll be in touch with you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Register Your Interest</h3>
      <div className="space-y-2">
        <input 
          name="name" 
          required 
          placeholder="Full Name" 
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
          disabled={status === 'submitting'}
        />
      </div>
      <div className="space-y-2">
        <input 
          name="email" 
          type="email" 
          required 
          placeholder="Email Address" 
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
          disabled={status === 'submitting'}
        />
      </div>
      <div className="space-y-2">
        <input 
          name="phone" 
          type="tel" 
          placeholder="Phone Number" 
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
          disabled={status === 'submitting'}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm font-medium mt-2" role="alert">{error}</div>
      )}
      <Button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full h-12 font-bold text-lg"
        style={{ backgroundColor: brandColor || '#2563eb' }}
      >
        {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Request Details'}
      </Button>
      <p className="text-xs text-zinc-500 text-center">
        By submitting, you agree to our privacy policy.
      </p>
    </form>
  );
}