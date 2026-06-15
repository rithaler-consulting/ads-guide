import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateGuideEmail } from '../../lib/generateEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, guide } = await req.json();

    if (!email || !guide) {
      return NextResponse.json({ error: 'Missing email or guide data' }, { status: 400 });
    }

    const html = generateGuideEmail({ guide, email });
    const subject = `Your Google Ads Setup Guide — ${guide.businessName}`;

    // Send to prospect + BCC Ryan
    const { error } = await resend.emails.send({
      from: 'Rithaler Consulting <ryan@rithaler-consulting.com>',
      to: [email],
      bcc: ['ryan@rithaler-consulting.com'],
      subject,
      html,
    });

    if (error) throw new Error(error.message);

    // Notify Ryan separately
    await resend.emails.send({
      from: 'Ads Guide <ryan@rithaler-consulting.com>',
      to: ['ryan@rithaler-consulting.com'],
      subject: `[Ads Guide] New submission — ${guide.businessName} (${guide.city})`,
      html: `<p style="font-family:sans-serif;">
        <strong>New Google Ads Guide request</strong><br><br>
        <strong>Email:</strong> ${email}<br>
        <strong>Business:</strong> ${guide.businessName}<br>
        <strong>City:</strong> ${guide.city}<br>
        <strong>Industry:</strong> ${guide.industry}<br>
        <strong>Campaign Name:</strong> ${guide.campaignName}<br><br>
        Full guide sent to ${email}.
      </p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
