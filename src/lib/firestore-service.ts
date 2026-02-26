import type { SitePage } from './types';
import { authorizedFetch } from '@/lib/auth-fetch';

// --- Types ---

export interface Job {
  id?: string;
  ownerUid: string;
  type: 'site_build' | 'ad_campaign' | 'seo_audit' | 'listing_sync';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  data: any;
  result?: any;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'developer' | 'agent' | 'admin';
  credits: number;
}

// --- Site Operations ---

export const saveSite = async (ownerUid: string, site: SitePage) => {
  const response = await authorizedFetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Failed to save site');
  }
  const data = await response.json();
  return data.siteId as string;
};

export const updateSiteMetadata = async (siteId: string, data: Partial<SitePage>) => {
  if (!siteId) {
    throw new Error('Site ID is required to update metadata.');
  }
  const updates: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updates[key] = value;
    }
  });
  if (Object.keys(updates).length === 0) {
    return;
  }
  const response = await authorizedFetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site: { id: siteId, ...updates } }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || 'Failed to update site metadata.');
  }
};

export const getUserSites = async (ownerUid: string) => {
  const response = await authorizedFetch('/api/sites', { method: 'GET' });
  if (!response.ok) return [];
  const payload = await response.json().catch(() => null);
  return (payload?.sites || []) as SitePage[];
};
