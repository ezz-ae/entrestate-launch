export interface User {
  profile: {
    name: string;
    email: string;
    role: 'developer' | 'agent' | 'admin';
  };
  brandKit: {
    colors: {
      primary: string;
      secondary: string;
    };
    fonts: string;
    logoUrl: string;
  };
  subscriptions: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  developer?: string;
  status?: string;
  price?: {
    from: number;
    label: string;
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
    marketTrend?: 'up' | 'stable' | 'down';
    priceHistory?: { year: number; avgPrice: number }[];
  };
  handover?: {
    quarter: number;
    year: number;
  };
  description?: {
    short?: string;
    full?: string;
  };
  brochureUrl?: string;
  publicUrl?: string;
  features?: string[];
  tags?: string[];
  bedrooms?: {
    min: number;
    max: number;
    label: string;
  };
  areaSqft?: {
    min: number;
    max: number;
    label: string;
  };
  availability?: 'Available' | 'Sold Out' | 'Coming Soon';
  unitsStockUpdatedAt?: string;
}

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
}

export interface ProjectFilter {
  city?: string;
  developer?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  availability?: 'Available' | 'Sold Out' | 'Coming Soon';
}

export interface SiteTemplate {
  id: string;
  name: string;
  siteType: 'roadshow' | 'developer-focus' | 'partner-launch' | 'full-company' | 'freelancer' | 'map-focused' | 'ads-launch' | 'ready-made' | 'agent-portfolio' | 'custom';
  pages: SitePage[];
  thumbnail?: string;
  description?: string;
}

export interface BlockConfig {
  type: string;
  name: string;
  description: string;
  icon: any;
  category: 'hero' | 'content' | 'listings' | 'forms' | 'data' | 'social' | 'ai' | 'finance' | 'info' | 'marketing' | 'search';
  defaultData: Record<string, any>;
}
