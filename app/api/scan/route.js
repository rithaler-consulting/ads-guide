import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const normalized = url.startsWith('http') ? url : `https://${url}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let html = '';
    let title = '';
    let description = '';
    let bodyText = '';

    try {
      const res = await fetch(normalized, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdsGuideBot/1.0)' },
      });
      clearTimeout(timeout);
      html = await res.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : '';

      // Extract meta description
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      description = descMatch ? descMatch[1].trim() : '';

      // Extract body text (strip tags, collapse whitespace)
      bodyText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000);

    } catch (fetchErr) {
      clearTimeout(timeout);
      // Return empty — Claude will still generate based on USPs + URL domain
    }

    return NextResponse.json({ title, description, bodyText, url: normalized });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
