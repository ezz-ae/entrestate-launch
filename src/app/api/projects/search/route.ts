import { NextResponse } from 'next/server';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase() || '';
  const city = searchParams.get('city');
  
  let items = ENTRESTATE_INVENTORY;

  if (query) {
    items = items.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.developer?.toLowerCase().includes(query) ||
      p.location?.area.toLowerCase().includes(query)
    );
  }

  if (city && city !== 'all') {
    items = items.filter(p => p.location?.city.toLowerCase() === city.toLowerCase());
  }

  return NextResponse.json({
    items,
    totalApprox: items.length,
    nextCursor: null
  });
}