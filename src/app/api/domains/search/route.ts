export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Placeholder: Integrate with a real domain registrar API for search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  // Simulate search results
  const tldOptions = ['.com', '.ai', '.net', '.co'];
  const results = tldOptions.map(tld => ({
    domain: `${query}${tld}`,
    available: Math.random() > 0.3, // Randomly available
    price: (Math.random() * 20 + 10).toFixed(2),
    currency: 'USD',
  }));
  return NextResponse.json({ results });
}

// Placeholder: POST to buy/register a domain
export async function POST(request: NextRequest) {
  const { domain } = await request.json();
  if (!domain) return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
  // Simulate purchase success
  return NextResponse.json({ success: true, domain, status: 'registered', expires: '2027-01-22' });
}
