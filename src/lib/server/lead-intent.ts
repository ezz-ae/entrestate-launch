export type LeadFocus = 'buy' | 'sell' | 'invest' | 'explore';

const BUY_KEYWORDS = ['buy', 'purchase', 'book', 'reserve', 'price', 'payment plan'];
const SELL_KEYWORDS = ['sell', 'list my', 'listing', 'broker', 'agent'];
const INVEST_KEYWORDS = ['invest', 'roi', 'yield', 'rental', 'capital appreciation'];
const EXPLORE_KEYWORDS = ['explore', 'browse', 'looking', 'options', 'information'];
const URGENCY_KEYWORDS = ['ready', 'asap', 'urgent', 'this week', 'today', 'tomorrow'];
const CONTACT_KEYWORDS = ['call me', 'whatsapp', 'email me', 'contact me', 'call back'];
const VIEWING_KEYWORDS = ['viewing', 'visit', 'tour', 'show me'];
const BUDGET_KEYWORDS = ['budget', 'aed', 'usd', 'price range'];

type IntentInput = {
  text: string;
  hasEmail: boolean;
  hasPhone: boolean;
  projectIds?: string[];
};

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((count, keyword) => (text.includes(keyword) ? count + 1 : count), 0);
}

export function inferFocus(text: string): LeadFocus {
  const normalized = normalizeText(text);
  const buyScore = countMatches(normalized, BUY_KEYWORDS);
  const sellScore = countMatches(normalized, SELL_KEYWORDS);
  const investScore = countMatches(normalized, INVEST_KEYWORDS);
  const exploreScore = countMatches(normalized, EXPLORE_KEYWORDS);

  const scored = [
    { focus: 'buy' as const, score: buyScore },
    { focus: 'sell' as const, score: sellScore },
    { focus: 'invest' as const, score: investScore },
    { focus: 'explore' as const, score: exploreScore },
  ];

  scored.sort((a, b) => b.score - a.score);
  if (scored[0].score === 0) return 'explore';
  return scored[0].focus;
}

export function scoreLeadIntent(input: IntentInput) {
  const normalized = normalizeText(input.text);
  const reasons: string[] = [];
  let score = 0.15;

  if (input.hasEmail) {
    score += 0.25;
    reasons.push('Email captured');
  }
  if (input.hasPhone) {
    score += 0.25;
    reasons.push('Phone captured');
  }

  const viewingMatches = countMatches(normalized, VIEWING_KEYWORDS);
  if (viewingMatches) {
    score += 0.15;
    reasons.push('Requested a viewing');
  }

  const budgetMatches = countMatches(normalized, BUDGET_KEYWORDS);
  if (budgetMatches) {
    score += 0.12;
    reasons.push('Mentioned budget or price range');
  }

  const urgencyMatches = countMatches(normalized, URGENCY_KEYWORDS);
  if (urgencyMatches) {
    score += 0.1;
    reasons.push('Urgent timeline detected');
  }

  const contactMatches = countMatches(normalized, CONTACT_KEYWORDS);
  if (contactMatches) {
    score += 0.1;
    reasons.push('Asked for direct contact');
  }

  if ((input.projectIds || []).length) {
    score += 0.05;
    reasons.push('Matched project interest');
  }

  if (!reasons.length) {
    reasons.push('General inquiry without clear intent signals');
  }

  const intentScore = Math.min(Number(score.toFixed(2)), 1);
  const nextAction = intentScore >= 0.35 || input.hasEmail || input.hasPhone ? 'pipeline' : 'ignore';
  const focus = inferFocus(normalized);

  return {
    intent_score: intentScore,
    focus,
    reasoning: reasons.join(' · '),
    next_action: nextAction as 'pipeline' | 'ignore',
  };
}
