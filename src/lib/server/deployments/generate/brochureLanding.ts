export function buildBrochureLandingDoc(intake: Record<string, unknown>) {
  return {
    kind: 'brochure_landing',
    generatedAt: new Date().toISOString(),
    project: {
      name: intake.projectName || 'Project Name',
      location: intake.location || 'Dubai, UAE',
      startingPrice: intake.startingPrice || null,
      handoverDate: intake.handoverDate || null,
      paymentPlan: intake.paymentPlan || null,
    },
    campaign: {
      goal: intake.goal || 'investor',
      language: intake.language || 'en',
    },
    highlights: Array.isArray(intake.highlights) ? intake.highlights : [],
    contact: {
      whatsapp: intake.whatsapp || null,
      email: intake.email || null,
    },
  };
}
