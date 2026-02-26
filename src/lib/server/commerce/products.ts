export type ProductSlug =
  | 'brokerage-launch-kit'
  | 'project-launch-kit'
  | 'agent-bio-link'
  | 'data-pack';

export type ProductCatalogItem = {
  slug: ProductSlug;
  title: string;
  description: string;
  currency: 'AED';
  price: number;
  fulfillmentSlaHours: number;
  fulfillmentType: 'instant' | '24h' | 'enterprise';
  includes: Record<string, unknown>;
  entitlements: Array<{ key: string; value: Record<string, unknown> }>;
};

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    slug: 'brokerage-launch-kit',
    title: 'Brokerage Launch Kit',
    description:
      'Brokerage website deployment with agent directory, lead routing, and one featured project landing page.',
    currency: 'AED',
    price: 11999,
    fulfillmentSlaHours: 24,
    fulfillmentType: '24h',
    includes: {
      featuredProjectLandingPages: 1,
      agentDirectory: true,
      leadRouting: true,
      domainConnect: false,
    },
    entitlements: [
      { key: 'workspace.brokerage', value: { allowed: true } },
      { key: 'workspace.build', value: { allowed: true } },
      { key: 'workspace.preview', value: { allowed: true } },
      { key: 'workspace.publish', value: { allowed: true } },
      { key: 'workspace.edits', value: { allowed: true, maxRequests: 5 } },
      { key: 'lead.capture', value: { allowed: true } },
      { key: 'lead.export', value: { allowed: true } },
      { key: 'publish.domainConnect', value: { allowed: false } },
    ],
  },
  {
    slug: 'project-launch-kit',
    title: 'Project Launch Kit',
    description:
      'Upload a brochure and get a high-converting project landing page with lead capture and publish support.',
    currency: 'AED',
    price: 2999,
    fulfillmentSlaHours: 24,
    fulfillmentType: '24h',
    includes: {
      brochureIngestion: true,
      leadCapture: true,
      bilingual: false,
    },
    entitlements: [
      { key: 'workspace.projectLaunch', value: { allowed: true } },
      { key: 'workspace.build', value: { allowed: true } },
      { key: 'workspace.preview', value: { allowed: true } },
      { key: 'workspace.publish', value: { allowed: true } },
      { key: 'workspace.edits', value: { allowed: true, maxRequests: 3 } },
      { key: 'lead.capture', value: { allowed: true } },
      { key: 'publish.domainConnect', value: { allowed: false } },
    ],
  },
  {
    slug: 'agent-bio-link',
    title: 'Agent Bio Link',
    description:
      'Lead-ready bio link page for agents with featured projects, WhatsApp CTA, and built-in lead capture.',
    currency: 'AED',
    price: 599,
    fulfillmentSlaHours: 1,
    fulfillmentType: 'instant',
    includes: {
      projectSlots: 8,
      leadCapture: true,
      domainConnect: false,
    },
    entitlements: [
      { key: 'workspace.agent', value: { allowed: true } },
      { key: 'workspace.build', value: { allowed: true } },
      { key: 'workspace.preview', value: { allowed: true } },
      { key: 'workspace.publish', value: { allowed: true } },
      { key: 'workspace.edits', value: { allowed: true, maxRequests: 2 } },
      { key: 'lead.capture', value: { allowed: true } },
      { key: 'publish.domainConnect', value: { allowed: false } },
    ],
  },
  {
    slug: 'data-pack',
    title: 'Data Pack',
    description:
      'Market data licensing package with connectors and AI-ready knowledge layer for enterprise teams.',
    currency: 'AED',
    price: 25000,
    fulfillmentSlaHours: 72,
    fulfillmentType: 'enterprise',
    includes: {
      connectorSeats: 1,
      apiAccess: true,
      aiKnowledgeLayer: true,
    },
    entitlements: [
      { key: 'workspace.dataPack', value: { allowed: true } },
      { key: 'workspace.support', value: { allowed: true } },
      { key: 'data.export', value: { allowed: true } },
      { key: 'data.api', value: { allowed: true } },
    ],
  },
];

export function getCatalogItem(slug: string) {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}

export function listCatalogItems() {
  return PRODUCT_CATALOG;
}
