import type { SitePage } from '@/lib/types';

const templateTimestamp = () => ({
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

const id = (prefix: string, suffix: string) => `${prefix}-${suffix}`;

const HERO_BLOCK = (title: string, subtitle: string, suffix = 'default') => ({
  blockId: id('hero', suffix),
  type: 'hero',
  order: 0,
  data: {
    headline: title,
    subtext: subtitle,
    ctaText: 'Request Access',
  },
});

export const BLUEPRINT_TEMPLATES: Record<string, SitePage> = {
  portfolio: {
    id: '',
    title: 'Agent Portfolio',
    blocks: [
      HERO_BLOCK('Your Dubai Real Estate Partner', 'Showcase experience, listings, and proof', 'portfolio'),
      {
        blockId: id('stats', 'portfolio'),
        type: 'stats',
        order: 1,
        data: { headline: 'Trusted by investors globally.' },
      },
      {
        blockId: id('listing', 'portfolio'),
        type: 'listing-grid',
        order: 2,
        data: { headline: 'Featured Listings', subtext: 'Curated opportunities.' },
      },
      {
        blockId: id('cta', 'portfolio'),
        type: 'cta-form',
        order: 3,
        data: { headline: 'Book a Consultation' },
      },
      {
        blockId: id('chat', 'portfolio'),
        type: 'chat-widget',
        order: 4,
        data: { 
          welcomeMessage: 'Hi! I am your portfolio assistant. How can I help?',
          agentName: 'Portfolio Expert',
          companyName: 'Entrestate',
          collectLeads: true
        },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Agent Portfolio', description: 'Personal agent site', keywords: [] },
    ...templateTimestamp(),
  },
  launch: {
    id: '',
    title: 'Launch Blueprint',
    blocks: [
      HERO_BLOCK('Project Launch', 'Countdown + offer summary', 'launch'),
      {
        blockId: id('timeline', 'launch'),
        type: 'launch',
        order: 1,
        data: { headline: 'Launch Timeline' },
      },
      {
        blockId: id('payment', 'launch'),
        type: 'payment-plan',
        order: 2,
        data: { headline: 'Payment Plan' },
      },
      {
        blockId: id('floor', 'launch'),
        type: 'floor-plan',
        order: 3,
        data: { headline: 'Floor Plans' },
      },
      {
        blockId: id('cta', 'launch'),
        type: 'cta-form',
        order: 4,
        data: { headline: 'Download Brochure' },
      },
      {
        blockId: id('chat', 'launch'),
        type: 'chat-widget',
        order: 5,
        data: { 
          welcomeMessage: 'Ask me anything about this new launch, payment plans, or availability.',
          agentName: 'Launch Specialist',
          companyName: 'Entrestate',
          collectLeads: true
        },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Project Launch', description: 'Launch funnel', keywords: [] },
    ...templateTimestamp(),
  },
  advisory: {
    id: '',
    title: 'Advisory Blueprint',
    blocks: [
      HERO_BLOCK('Private Advisory', 'Services, proof, booking CTA', 'advisory'),
      {
        blockId: id('services', 'advisory'),
        type: 'split-content',
        order: 1,
        data: { headline: 'Advisory Services' },
      },
      {
        blockId: id('proof', 'advisory'),
        type: 'testimonial',
        order: 2,
        data: { headline: 'Client Testimonials' },
      },
      {
        blockId: id('newsletter', 'advisory'),
        type: 'newsletter',
        order: 3,
        data: { headline: 'Join Investor Briefing' },
      },
      {
        blockId: id('chat', 'advisory'),
        type: 'chat-widget',
        order: 4,
        data: { 
          welcomeMessage: 'Hi! How can I assist with your investment strategy today?',
          agentName: 'Investment Advisor',
          companyName: 'Entrestate',
          collectLeads: true
        },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Advisory Site', description: 'Private advisory landing page', keywords: [] },
    ...templateTimestamp(),
  },
};

export function getBlueprintTemplate(id: string): SitePage | null {
  const template = BLUEPRINT_TEMPLATES[id];
  if (!template) return null;
  return {
    ...template,
    id: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    blocks: template.blocks.map((block, index) => ({
      ...block,
      blockId: `${block.type}-template-${index}`,
      order: index,
    })),
  };
}
