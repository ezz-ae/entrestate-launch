import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MTCIntelligence/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: response.status });
    }

    let html = await response.text();

    const baseTag = `<base href="${url}">`;
    const historyPatch = `<script>(function(){function s(u){try{var p=new URL(u,window.location.href);if(p.origin===window.location.origin){return p.href}return p.pathname+p.search+p.hash}catch(e){return u}}function w(m){var o=history[m].bind(history);return function(state,title,url){if(typeof url==="string"){url=s(url)}try{return o(state,title,url)}catch(e){return null}}}history.pushState=w("pushState");history.replaceState=w("replaceState");})();</script>`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}${historyPatch}`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `${baseTag}${historyPatch}</head>`);
    } else {
      html = html.replace('</title>', `</title>${baseTag}${historyPatch}`);
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
