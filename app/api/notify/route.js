import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { guide, url, usps } = await req.json();

    await resend.emails.send({
      from: 'Rithaler Consulting <ryan@rithaler-consulting.com>',
      to: ['ryan@rithaler-consulting.com'],
      subject: `[Ads Guide] New report generated — ${guide.businessName} (${guide.city})`,
      html: `<div style="font-family:sans-serif;max-width:560px;">
        <h2 style="color:#0F2340;">New Ads Guide Generated</h2>
        <p>A prospect just built their guide. They haven't submitted their email yet.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Business</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${guide.businessName}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">City</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${guide.city}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Industry</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${guide.industry}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Website</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="${url}">${url}</a></td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">USPs</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${usps}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Campaign Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${guide.campaignName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;">Keywords</td><td style="padding:8px 0;">${(guide.keywords || []).map(k => `${k.matchType}: ${k.keyword}`).join(', ')}</td></tr>
        </table>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Non-blocking — don't fail the user flow if notify fails
    console.error('Notify error:', err);
    return NextResponse.json({ success: false });
  }
}
