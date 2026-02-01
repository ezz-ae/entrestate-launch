export interface Block {
  blockId: string;
  type: string;
  order: number;
  data: any;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  lastRefinedAt?: string;
  canonicalListings?: any[];
  brochureUrl?: string;
  tenantId?: string;
  refinerStatus?: string;
  refinerDraftSnapshot?: any;
  refinerDraftHtml?: string;
  ownerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  developer?: string;
  status?: string;
  price?: {
    label: string;
    value?: number;
    from?: number;
    sqftAvg?: number;
  };
  location?: {
    city: string;
    area: string;
    mapQuery?: string;
  };
  images?: string[];
  performance?: {
    roi?: number;
    capitalAppreciation?: number;
    rentalYield?: number;
    marketTrend?: 'up' | 'down' | 'stable';
    priceHistory?: { year: number, avgPrice: number }[];
  };
  handover?: {
    quarter: number;
    year: number;
  };
  description?: {
    short: string;
    full: string;
  };
  brochureUrl?: string;
  publicUrl?: string;
  features?: string[];
  tags?: string[];
  availability?: string;
  bedrooms?: {
    label: string;
    value: number;
  };
  areaSqft?: {
    label: string;
    value: number;
  };
  unitsStockUpdatedAt?: string;
}

export interface BlockConfig {
  type: string;
  name: string;
  description: string;
  category: 'hero' | 'content' | 'cta' | 'data' | 'listings' | 'finance' | 'social' | 'info' | 'forms' | 'layout' | 'ai';
  icon: React.ComponentType<any>;
  badge?: string;
  defaultData?: any;
}

export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  siteType: 'developer-landing' | 'project-launch' | 'brokerage-firm' | 'investment-vehicle' | 'private-advisory' | 'roadshow-event' | 'building-landing' | 'custom' | 'roadshow' | 'developer-focus' | 'partner-launch' | 'full-company' | 'freelancer' | 'map-focused' | 'ads-launch' | 'ready-made' | 'agent-portfolio';
  pages: SitePage[];
  thumbnail?: string;
}