export interface Block {
  blockId: string;
  type: string;
  order: number;
  data: any;
}

export interface SitePage {
  id: string;
  title: string;
  brochureUrl: string;
  blocks: Block[];
  canonicalListings: string[];
  createdAt: string;
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  language?: string;
  published?: boolean;
  tenantId?: string;
  ownerUid?: string;
  refinerStatus?: 'review' | 'running' | 'queued' | 'done';
  lastRefinedAt?: string | Date;
  refinerDraftSnapshot?: any;
  refinerDraftHtml?: string;
}
