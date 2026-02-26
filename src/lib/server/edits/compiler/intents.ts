export const SUPPORTED_INTENTS = {
  logo: {
    id: 'branding.logo_change',
    keywords: ['logo', 'brand', 'symbol'],
    requiredInputs: ['logo_url'],
  },
  hero: {
    id: 'copy.hero_update',
    keywords: ['hero', 'headline', 'title'],
    requiredInputs: ['headline'],
  },
  contact: {
    id: 'contact.update',
    keywords: ['phone', 'whatsapp', 'email', 'contact'],
    requiredInputs: ['contact'],
  },
  projects: {
    id: 'projects.update',
    keywords: ['project', 'listing', 'property'],
    requiredInputs: ['projects'],
  },
} as const;
