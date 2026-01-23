import type { DecisionZipperInput, DecisionZipperOutput } from './types';

export function buildCampaignPlan(input: DecisionZipperInput): DecisionZipperOutput {
  const { blueprint, occalizer, budgetCaps, siteIntent } = input;
  const name = `${blueprint.inputs.targetLocation} | ${blueprint.inputs.goal}`.trim();
  const keywords = [
    `${blueprint.inputs.targetLocation} property`,
    `${blueprint.inputs.goal} ${blueprint.inputs.targetLocation}`,
    siteIntent,
  ].filter(Boolean);

  const plan = {
    name,
    keywords,
    biddingAggressiveness: occalizer.biddingAggressiveness,
    expectedCplRange: occalizer.expectedCplRange,
    notes: [
      `Budget caps: daily ${budgetCaps.daily}, total ${budgetCaps.total}.`,
      `Occalizer mode: ${occalizer.mode}.`,
      `Intent focus: ${siteIntent}.`,
    ],
  };

  const reasoning = [
    'Decision Zipper Layer aligned landing page intent with the selected Occalizer stance.',
    `Keyword strategy set to: ${occalizer.keywordStrategy}.`,
  ];

  return { plan, reasoning };
}
