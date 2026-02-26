export interface ArticleSection {
  type: 'text' | 'flow' | 'data-map' | 'tip';
  heading?: string;
  content?: string;
  steps?: { title: string; desc: string }[];
  mapping?: { source: string; dest: string; desc: string }[];
}

export interface Article {
  slug: string;
  title: string;
  service: string;
  description: string;
  sections: ArticleSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'mastering-lead-pipeline',
    title: 'Mastering the Lead Pipeline',
    service: 'CRM & Pipeline',
    description: 'How to manage the lifecycle of a lead from capture to revenue, including AI handoffs.',
    sections: [
      {
        type: 'text',
        heading: 'The Philosophy',
        content: 'The pipeline is not just a storage for contacts; it is a living stream of intent. Your goal is to move leads from "New" to "Closed" with minimal friction, using AI to filter the noise.'
      },
      {
        type: 'flow',
        heading: 'Smart Workflow',
        steps: [
          { title: 'Ingestion', desc: 'Leads arrive from Google Ads or Property Finder. They land in the "New" column.' },
          { title: 'AI Qualification', desc: 'Within seconds, the AI Agent engages via WhatsApp. It asks 3 key questions: Budget, Timeline, Location.' },
          { title: 'Scoring & Routing', desc: 'Based on answers, the lead is scored (0-100). High scores (>70) are moved to "Qualified" and assigned to a senior agent.' },
          { title: 'Human Closing', desc: 'Agent schedules a viewing. The pipeline stage moves to "Negotiation".' }
        ]
      },
      {
        type: 'data-map',
        heading: 'Data Flow: What Goes Where?',
        mapping: [
          { source: 'Ad Click', dest: 'Pipeline Entry', desc: 'UTM parameters (Campaign, Keyword) are saved to the lead profile.' },
          { source: 'WhatsApp Chat', dest: 'CRM Notes', desc: 'Full transcript is summarized into bullet points and synced to the CRM.' },
          { source: 'Deal Closed', dest: 'ROI Dashboard', desc: 'Commission value is attributed back to the original Ad Spend for ROI calculation.' }
        ]
      },
      {
        type: 'tip',
        content: 'Don’t manually move leads if you don’t have to. Enable "Auto-Advance" in settings to let the AI move leads based on keyword triggers in the chat.'
      }
    ]
  },
  {
    slug: 'inventory-intelligence',
    title: 'Using the Market Feed',
    service: 'Inventory',
    description: 'Connecting your property database to generate automated marketing assets.',
    sections: [
      {
        type: 'text',
        heading: 'Why Connect Inventory?',
        content: 'Static listings die. Connected inventory allows our system to monitor price changes, availability, and ROI potential in real-time, updating your ads automatically.'
      },
      {
        type: 'flow',
        heading: 'Inventory Workflow',
        steps: [
          { title: 'Sync', desc: 'Connect your CRM feed (XML/API). System normalizes data (beds, baths, price).' },
          { title: 'Enrichment', desc: 'AI analyzes images and location to generate "Selling Points" (e.g., "5 min to Metro").' },
          { title: 'Campaign Gen', desc: 'System creates a landing page and ad copy for each high-priority unit.' }
        ]
      },
      {
        type: 'data-map',
        heading: 'Data Flow',
        mapping: [
          { source: 'CRM Feed', dest: 'Entrestate DB', desc: 'Raw unit data is cached and indexed for search.' },
          { source: 'Price Change', dest: 'Active Ads', desc: 'If price drops, ads are updated with "New Price" badge.' },
          { source: 'Unit Sold', dest: 'Campaign Manager', desc: 'Ads for sold units are paused immediately to save budget.' }
        ]
      }
    ]
  },
  {
    slug: 'intent-engine-ads',
    title: 'The Intent Engine',
    service: 'Google Ads',
    description: 'How we filter low-quality traffic before it ever reaches your sales team.',
    sections: [
      {
        type: 'text',
        heading: 'Stop Paying for Window Shoppers',
        content: 'Most agencies bid on broad keywords like "Dubai Real Estate". We bid on intent-specific long-tail keywords like "Buy 3 bed villa Dubai Hills ready to move".'
      },
      {
        type: 'flow',
        heading: 'Ad Execution Flow',
        steps: [
          { title: 'Signal Detection', desc: 'User searches for specific criteria (Location + Type + Budget).' },
          { title: 'Dynamic Matching', desc: 'Engine checks your Live Inventory. If no match, we don’t bid.' },
          { title: 'Landing Page', desc: 'User lands on a page showing EXACTLY what they searched for, not a generic home page.' }
        ]
      },
      {
        type: 'data-map',
        heading: 'Data Flow',
        mapping: [
          { source: 'Search Query', dest: 'Intent Filter', desc: 'Keywords are parsed for intent (Buy vs Rent, Ready vs Off-plan).' },
          { source: 'Lead Form', dest: 'Pipeline', desc: 'Submission includes the exact URL they converted on.' }
        ]
      }
    ]
  }
];