import type { RefinerResult } from './types';
import type { SitePage, Block } from '@/lib/types';

const CTA_BLOCKS = new Set(['cta-form', 'cta-grid', 'hero-lead-form', 'lead-interest-form', 'booking-viewing']);
const CONTACT_BLOCKS = new Set(['contact-details', 'chat-widget']);
const FORM_BLOCKS = new Set(['cta-form', 'hero-lead-form', 'lead-interest-form', 'booking-viewing']);

function getFormFields(block: Block): string[] {
  const fields = block.data?.fields || block.data?.formFields || [];
  if (Array.isArray(fields)) {
    return fields.map((field) => String(field?.name || field?.id || field)).filter(Boolean);
  }
  return [];
}

function hasCtaBlock(blocks: Block[]) {
  return blocks.some((block) => CTA_BLOCKS.has(block.type));
}

function hasContactMethod(blocks: Block[]) {
  return blocks.some((block) => CONTACT_BLOCKS.has(block.type));
}

function hasValidForm(blocks: Block[]) {
  const form = blocks.find((block) => FORM_BLOCKS.has(block.type));
  if (!form) return { exists: false, hasRequired: false };
  const fields = getFormFields(form).map((field) => field.toLowerCase());
  const hasName = fields.some((field) => field.includes('name'));
  const hasPhone = fields.some((field) => field.includes('phone'));
  return { exists: true, hasRequired: hasName && hasPhone };
}

function checkContrast(blocks: Block[]) {
  const blockWithColors = blocks.find((block) => block.data?.textColor && block.data?.backgroundColor);
  if (!blockWithColors) {
    return { passed: true, message: 'No explicit color tokens found; using default theme.' };
  }
  const text = String(blockWithColors.data.textColor).toLowerCase();
  const bg = String(blockWithColors.data.backgroundColor).toLowerCase();
  const passed = text !== bg;
  return {
    passed,
    message: passed ? 'Text and background colors are distinct.' : 'Text and background colors match.',
  };
}

function checkImageQuality(blocks: Block[]) {
  const blockWithImage = blocks.find((block) => block.data?.image && typeof block.data.image === 'object');
  if (!blockWithImage) {
    return { passed: true, message: 'No explicit image metadata found.' };
  }
  const image = blockWithImage.data.image as { width?: number; height?: number };
  const width = image.width || 0;
  const height = image.height || 0;
  const passed = width >= 800 && height >= 600;
  return {
    passed,
    message: passed ? 'Image dimensions meet minimum quality.' : 'Image dimensions appear low.',
  };
}

export function runRefiner(page: SitePage): RefinerResult {
  const blocks = page.blocks || [];
  const checks: RefinerResult['checks'] = {};
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  const recommendedFixes: string[] = [];

  const contrast = checkContrast(blocks);
  checks.contrast = contrast;
  if (!contrast.passed) {
    warnings.push('Contrast may be too low for readability.');
    recommendedFixes.push('Adjust text/background colors for stronger contrast.');
  }

  const imageQuality = checkImageQuality(blocks);
  checks.imageQuality = imageQuality;
  if (!imageQuality.passed) {
    warnings.push('Hero imagery may be low resolution.');
    recommendedFixes.push('Upload a higher resolution hero image (>= 800x600).');
  }

  const hasCta = hasCtaBlock(blocks);
  checks.ctaPresence = {
    passed: hasCta,
    message: hasCta ? 'CTA block found.' : 'CTA block missing.',
  };
  if (!hasCta) {
    blockingErrors.push('CTA block missing.');
    recommendedFixes.push('Add a CTA block with a clear action.');
  }

  const hasContact = hasContactMethod(blocks);
  checks.contactMethod = {
    passed: hasContact,
    message: hasContact ? 'Contact method present.' : 'No contact method found.',
  };
  if (!hasContact) {
    blockingErrors.push('No contact method found.');
    recommendedFixes.push('Add contact details or chat widget to capture leads.');
  }

  const formStatus = hasValidForm(blocks);
  checks.formFields = {
    passed: formStatus.exists && formStatus.hasRequired,
    message: formStatus.exists
      ? formStatus.hasRequired
        ? 'Lead form has required fields.'
        : 'Lead form missing name or phone.'
      : 'Lead form not found.',
  };
  if (!formStatus.exists) {
    blockingErrors.push('Lead form missing.');
    recommendedFixes.push('Add a lead capture form with name and phone fields.');
  } else if (!formStatus.hasRequired) {
    blockingErrors.push('Lead form missing required fields (name + phone).');
    recommendedFixes.push('Ensure lead form contains name and phone fields; email optional.');
  }

  let score = 100;
  score -= blockingErrors.length * 15;
  score -= warnings.length * 5;
  if (score < 0) score = 0;

  return {
    score,
    blockingErrors,
    warnings,
    recommendedFixes,
    checks,
    evaluatedAt: new Date().toISOString(),
  };
}
