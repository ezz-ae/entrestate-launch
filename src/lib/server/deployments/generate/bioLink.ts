export function buildBioLinkSiteDoc(intake: Record<string, unknown>) {
  return {
    kind: 'bio_link',
    generatedAt: new Date().toISOString(),
    hero: {
      name: intake.name || 'Agent Name',
      headline: intake.headline || 'Real estate professional',
      whatsapp: intake.whatsapp || null,
      instagram: intake.instagram || null,
    },
    projects: Array.isArray(intake.projects) ? intake.projects : [],
    cta: intake.cta || 'WhatsApp me',
    leadCapture: intake.leadCapture !== false,
  };
}
