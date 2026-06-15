import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { url, businessName, city, usps, siteTitle, siteDescription, siteBodyText } = await req.json();

    const domain = url.replace(/https?:\/\//, '').replace(/\/.*/, '');
    const currentYear = new Date().getFullYear();

    const prompt = `You are a Google Ads specialist helping a local service business set up their first Google Search Ad campaign. Your job is to generate a complete, customized campaign setup guide in JSON format.

BUSINESS DETAILS:
- Business Name: ${businessName}
- City/Location: ${city}
- Website: ${url}
- USPs provided by the owner: ${usps}

WEBSITE CONTENT SCRAPED:
Title: ${siteTitle || 'N/A'}
Meta Description: ${siteDescription || 'N/A'}
Body Text Sample: ${siteBodyText || 'N/A'}

Generate a complete Google Ads Search Campaign setup guide for this business. Return ONLY valid JSON with no markdown, no backticks, no preamble. Follow this exact schema:

{
  "businessName": "string",
  "city": "string",
  "industry": "string (inferred from website/USPs — e.g. Junk Removal, Plumbing, Landscaping)",
  "campaignName": "string (recommended name, e.g. Search | Junk Removal | Kamloops | ${currentYear})",
  "objective": {
    "recommended": "string (e.g. Leads)",
    "reason": "string (1-2 sentences why)"
  },
  "conversionGoals": {
    "recommended": ["array of 2-3 conversion actions to set up, e.g. Phone Call Clicks, Form Submissions"],
    "setupNote": "string (brief note on how to verify these are firing)"
  },
  "bidding": {
    "strategy": "string (e.g. Maximize Clicks to start)",
    "targetCPA": "string (e.g. Leave blank until you have 30+ conversions)",
    "newCustomersOnly": "string (e.g. Leave off — too restrictive for a new campaign)",
    "reason": "string"
  },
  "networks": {
    "searchNetwork": true,
    "displayNetwork": false,
    "reason": "string"
  },
  "locations": {
    "targets": ["array of location strings, e.g. Kamloops, BC", "Surrounding areas if relevant"],
    "locationOption": "string (e.g. People in or regularly in your targeted locations)",
    "radius": "string if applicable, e.g. 30km radius around Kamloops city centre"
  },
  "languages": ["English"],
  "audienceSegments": {
    "mode": "string (Observation)",
    "suggested": ["2-3 relevant audience segments, e.g. In-market: Home Improvement, In-market: Moving Services"]
  },
  "aiMax": {
    "recommended": false,
    "reason": "string"
  },
  "keywords": [
    {
      "matchType": "Exact",
      "keyword": "string"
    }
  ],
  "negativeKeywords": ["string array of 8-12 relevant negatives"],
  "finalUrl": "string (the most relevant page on their site — homepage or a specific service page if detectable)",
  "displayPaths": ["string path 1 (max 15 chars)", "string path 2 (max 15 chars)"],
  "headlines": [
    "string (max 30 chars each)"
  ],
  "descriptions": [
    "string (max 90 chars each)"
  ],
  "sitelinks": [
    {
      "text": "string (max 25 chars)",
      "description1": "string (max 35 chars)",
      "description2": "string (max 35 chars)",
      "url": "string (use homepage URL if no specific page detectable, appended with a logical path like /about or /contact)"
    }
  ],
  "callouts": ["string array of 6-8 short callout extensions, max 25 chars each"],
  "structuredSnippets": {
    "header": "string (e.g. Services)",
    "values": ["array of 4-6 values, max 25 chars each"]
  },
  "budgetRecommendation": {
    "minimumDaily": "string (e.g. $20/day CAD)",
    "recommended": "string (e.g. $30-40/day CAD to be competitive in ${city})",
    "reason": "string"
  }
}

KEYWORD RULES:
- Keep the keyword list SHORT — 8 to 14 keywords maximum. The user likely has a small budget (~$20/day) so too many keywords spreads budget thin.
- Use Exact match [brackets] for the highest-intent, most specific terms
- Use Phrase match "quotes" for slightly broader terms
- Use Broad match sparingly — only 1-2 if clearly valuable
- Represent the matchType field as: "Exact", "Phrase", or "Broad"

HEADLINE RULES:
- Write exactly 6 headlines (not more — fewer variations = better testing signal on small budgets)
- Max 30 characters each — count carefully
- Include: business name, city, key service, key USP, a CTA

DESCRIPTION RULES:
- Write exactly 3 descriptions (not 4 — same testing reason)
- Max 90 characters each
- Each should stand alone and be compelling on its own

SITELINK RULES:
- Write 4 sitelinks
- Use realistic URLs based on the domain ${domain} (e.g. ${url}/about, ${url}/contact, ${url}/services)

Be specific, practical, and tailored to this exact business. Do not use placeholder text.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const guide = JSON.parse(cleaned);

    return NextResponse.json({ guide });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
