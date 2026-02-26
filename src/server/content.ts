import { shouldUseRemoteContent } from '@/server/remote-config';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  icon?: string;
  heroImage?: string;
  slug: string;
}

const ICON_MAP: Record<string, string> = {
  intelligence: 'BrainCircuit',
  productivity: 'Zap',
  marketing: 'Activity',
};

export async function fetchBlogPosts(limit = 6): Promise<BlogPost[]> {
  try {
    if (!shouldUseRemoteContent) {
      return [];
    }
    void limit;
    return [];
  } catch (error) {
    console.error('[fetchBlogPosts] Failed to load content_posts', error);
    return [];
  }
}
