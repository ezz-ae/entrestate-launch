'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useAuth } from '@/AuthContext';
import { FIREBASE_AUTH_DISABLED } from '@/lib/firebase/client';

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded: () => void;
}

export function AddLeadDialog({ open, onOpenChange, onLeadAdded }: AddLeadDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      if (!user && !FIREBASE_AUTH_DISABLED) {
        throw new Error('You must be logged in to add a lead.');
      }
      const res = await authorizedFetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (res.ok) {
        onLeadAdded();
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add lead.');
      }
    } catch (error) {
      console.error('Failed to add lead', error);
      setError('Failed to add lead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Lead</DialogTitle>
          <DialogDescription>Enter the details of the new lead below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              disabled={submitting}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
            <Input
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              disabled={submitting}
            />
            <Textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              disabled={submitting}
            />
            {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full h-12 font-bold text-lg">
              {submitting ? 'Adding Lead...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
