import { NextResponse } from 'next/server';

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function POST(request: Request) {
  const { domain } = await request.json();

  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: 'Server configuration missing for Vercel API.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error.message }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding domain:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
