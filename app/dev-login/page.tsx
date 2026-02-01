'use client';

import React, { useState } from 'react';

export default function DevLoginPage() {
  const [user, setUser] = useState('dev.user');
  const [email, setEmail] = useState('dev.user@example.com');
  const [roles, setRoles] = useState('agency_admin');
  const PUBLIC_SECRET = process.env.NEXT_PUBLIC_DEV_LOGIN_SECRET || '';
  const [secret, setSecret] = useState(PUBLIC_SECRET);

  function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {
        user,
        email,
        roles,
      };
      if (secret) payload.secret = secret;
      const resp = await fetch('/api/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        // server sets HttpOnly cookies and redirects us
        window.location.href = '/dashboard';
      } else {
        const j = await resp.json();
        alert('Dev login failed: ' + (j?.error || resp.status));
      }
    } catch (err) {
      alert('Dev login error');
    }
  }

  async function onClear() {
    await fetch('/api/dev-logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={onSubmit} className="p-6 rounded-lg bg-zinc-900 w-[420px]">
        <h2 className="text-xl font-semibold mb-4">Dev Login</h2>
        <label className="block mb-2">
          <div className="text-sm text-zinc-400">UID</div>
          <input className="w-full p-2 bg-zinc-800 rounded mt-1" value={user} onChange={(e) => setUser(e.target.value)} />
        </label>
        <label className="block mb-2">
          <div className="text-sm text-zinc-400">Email</div>
          <input className="w-full p-2 bg-zinc-800 rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block mb-4">
          <div className="text-sm text-zinc-400">Roles (comma separated)</div>
          <input className="w-full p-2 bg-zinc-800 rounded mt-1" value={roles} onChange={(e) => setRoles(e.target.value)} />
        </label>
        <label className="block mb-4">
          <div className="text-sm text-zinc-400">Secret (optional)</div>
          <input
            className="w-full p-2 bg-zinc-800 rounded mt-1"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="If DEV login secret is required"
            type="password"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Sign in</button>
          <button type="button" onClick={onClear} className="px-4 py-2 bg-zinc-700 rounded">Clear</button>
        </div>
      </form>
    </div>
  );
}
