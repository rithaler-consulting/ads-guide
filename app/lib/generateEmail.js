export function generateGuideEmail({ guide, email }) {
  const NAVY = '#0F2340';
  const GOLD = '#C99833';
  const LIGHT_GOLD = '#fdf6e3';
  const GREY = '#f8f9fb';
  const BORDER = '#e2e6ea';
  const calendlyLink = 'https://calendly.com/ryan-rithaler-consulting/strategy-call';

  const now = new Date();
  const expiryDate = new Date(now.getTime() + 60 * 60 * 1000); // 60 min from now for urgency CTA
  const expiryStr = expiryDate.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Vancouver' }) + ' PT';

  const sectionHeader = (num, title) => `
    <tr><td style="padding: 32px 0 12px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="width:32px;height:32px;background:${NAVY};border-radius:50%;text-align:center;vertical-align:middle;">
          <span style="color:#fff;font-weight:700;font-size:14px;font-family:Montserrat,Arial,sans-serif;">${num}</span>
        </td>
        <td style="padding-left:12px;font-family:Montserrat,Arial,sans-serif;font-size:18px;font-weight:700;color:${NAVY};">
          ${title}
        </td>
      </tr></table>
    </td></tr>
  `;

  const infoRow = (label, value) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
        <span style="font-size:12px;font-weight:600;color:#718096;text-transform:uppercase;letter-spacing:0.5px;">${label}</span><br>
        <span style="font-size:14px;color:${NAVY};font-weight:500;">${value}</span>
      </td>
    </tr>
  `;

  const pill = (text, color = NAVY) => `<span style="display:inline-block;background:${color};color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;font-family:Montserrat,Arial,sans-serif;">${text}</span>`;

  const keywordMatchColor = (type) => type === 'Exact' ? '#2d7a4f' : type === 'Phrase' ? '#1a5276' : '#7d6608';

  const keywords = (guide.keywords || []).map(k => `
    <tr>
      <td style="padding:6px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
        <span style="display:inline-block;width:70px;font-size:11px;font-weight:700;color:${keywordMatchColor(k.matchType)};text-transform:uppercase;">${k.matchType}</span>
        <span style="font-size:14px;color:${NAVY};font-weight:500;">${k.matchType === 'Exact' ? `[${k.keyword}]` : k.matchType === 'Phrase' ? `"${k.keyword}"` : k.keyword}</span>
      </td>
    </tr>
  `).join('');

  const listItems = (arr) => (arr || []).map(item =>
    `<tr><td style="padding:5px 0;font-family:Montserrat,Arial,sans-serif;font-size:14px;color:${NAVY};">• ${item}</td></tr>`
  ).join('');

  const headlineRows = (guide.headlines || []).map((h, i) =>
    `<tr><td style="padding:5px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
      <span style="font-size:11px;color:#718096;font-weight:600;">H${i+1}</span>&nbsp;&nbsp;
      <span style="font-size:14px;color:${NAVY};font-weight:600;">${h}</span>
      <span style="float:right;font-size:11px;color:${h.length > 30 ? '#c0392b' : '#718096'};">${h.length}/30</span>
    </td></tr>`
  ).join('');

  const descRows = (guide.descriptions || []).map((d, i) =>
    `<tr><td style="padding:5px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
      <span style="font-size:11px;color:#718096;font-weight:600;">D${i+1}</span>&nbsp;&nbsp;
      <span style="font-size:14px;color:${NAVY};">${d}</span>
      <span style="float:right;font-size:11px;color:${d.length > 90 ? '#c0392b' : '#718096'};">${d.length}/90</span>
    </td></tr>`
  ).join('');

  const sitelinkRows = (guide.sitelinks || []).map(s =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
      <div style="font-size:14px;font-weight:700;color:${NAVY};">${s.text}</div>
      <div style="font-size:12px;color:#4a5568;">${s.description1}</div>
      <div style="font-size:12px;color:#4a5568;">${s.description2}</div>
      <div style="font-size:11px;color:${GOLD};margin-top:2px;">${s.url}</div>
    </td></tr>`
  ).join('');

  const ctaButton = (text, url) => `
    <table cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
      <tr><td style="background:${GOLD};border-radius:6px;padding:14px 28px;text-align:center;">
        <a href="${url}" style="color:#fff;font-family:Montserrat,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;">${text}</a>
      </td></tr>
    </table>
  `;

  const urgencyBox = (headline, body, btnText, btnUrl) => `
    <tr><td style="background:${LIGHT_GOLD};border:1px solid ${GOLD};border-radius:8px;padding:20px;margin:16px 0;">
      <p style="font-family:Montserrat,Arial,sans-serif;font-size:15px;font-weight:700;color:${NAVY};margin:0 0 8px;">⚡ ${headline}</p>
      <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:0 0 12px;">${body}</p>
      ${ctaButton(btnText, btnUrl)}
    </td></tr>
    <tr><td style="height:16px;"></td></tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your Google Ads Setup Guide</title></head>
<body style="margin:0;padding:0;background:#f0f4f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:24px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

  <!-- Header -->
  <tr><td style="background:${NAVY};border-radius:12px 12px 0 0;padding:36px 40px 32px;">
    <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:600;color:${GOLD};text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Rithaler Consulting</p>
    <h1 style="font-family:Montserrat,Arial,sans-serif;font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">Your Custom Google Ads Setup Guide</h1>
    <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);margin:0;">Built for <strong style="color:#fff;">${guide.businessName}</strong> · ${guide.city} · ${guide.industry}</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#fff;padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">

      <!-- Intro -->
      <tr><td style="padding-bottom:24px;border-bottom:1px solid ${BORDER};">
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.7;margin:0;">
          Below is a step-by-step Google Search Ads setup guide customized for your business. Follow the steps in order — each one builds on the last. Where you see a 💡 tip, pay close attention.
        </p>
      </td></tr>

      <!-- Step 1: Objective -->
      ${sectionHeader(1, 'Choose Your Objective')}
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('Recommended Objective', guide.objective?.recommended || 'Leads')}
          ${infoRow('Why', guide.objective?.reason || '')}
        </table>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:12px 0 0;line-height:1.6;">
          💡 On the campaign creation screen, you'll see objectives like Sales, Leads, Website Traffic, and more. Select <strong>${guide.objective?.recommended || 'Leads'}</strong> and click Continue.
        </p>
      </td></tr>

      <!-- Step 2: Conversion Goals — CTA -->
      ${sectionHeader(2, 'Conversion Goals')}
      <tr><td>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 12px;">
          This is the most important — and most skipped — step. Google uses your conversion data to optimize who sees your ads. If it's not set up correctly, you're flying blind and paying for it.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:600;color:${NAVY};padding-bottom:8px;">Recommended conversions to track:</td></tr>
          ${listItems(guide.conversionGoals?.recommended)}
          <tr><td style="height:8px;"></td></tr>
          ${infoRow('Setup Note', guide.conversionGoals?.setupNote || 'Verify each conversion action is firing before launching.')}
        </table>
      </td></tr>
      ${urgencyBox(
        'Is your conversion tracking set up correctly?',
        `Most businesses we audit have either no conversion tracking or tracking that's firing incorrectly — meaning Google has been optimizing toward the wrong signals the entire time. Book a complimentary conversion tracking review (offer expires at ${expiryStr}).`,
        'Book My Free Conversion Review →',
        calendlyLink
      )}

      <!-- Step 3: Campaign Type -->
      ${sectionHeader(3, 'Campaign Type')}
      <tr><td>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0;">
          Select <strong style="color:${NAVY};">Search</strong> and click Continue. This targets people actively searching for your service on Google — the highest-intent traffic available. Do not select Performance Max, Display, or Smart campaigns.
        </p>
      </td></tr>

      <!-- Step 4: Ways to Reach Goal -->
      ${sectionHeader(4, 'Select the Ways You\'d Like to Reach Your Goal')}
      <tr><td>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0;">
          Check <strong>Website visits</strong> and <strong>Phone calls</strong> if applicable to your business. Uncheck any other options — keep it simple and focused.
        </p>
      </td></tr>

      <!-- Step 5: Campaign Name -->
      ${sectionHeader(5, 'Campaign Name')}
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('Recommended Name', guide.campaignName || '')}
        </table>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:10px 0 0;line-height:1.6;">
          💡 Use a naming structure that tells you <em>what</em> the campaign is, <em>where</em> it targets, and <em>when</em> it was created. This matters once you have multiple campaigns running.
        </p>
      </td></tr>

      <!-- Step 6: Bidding -->
      ${sectionHeader(6, 'Bidding')}
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('Bidding Strategy', guide.bidding?.strategy || '')}
          ${infoRow('Target CPA', guide.bidding?.targetCPA || '')}
          ${infoRow('New Customers Only', guide.bidding?.newCustomersOnly || '')}
          ${infoRow('Why', guide.bidding?.reason || '')}
        </table>
      </td></tr>

      <!-- Step 7: Campaign Settings -->
      ${sectionHeader(7, 'Campaign Settings')}
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};">Networks</td></tr>
          <tr><td style="padding-bottom:12px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">
            ✅ Google Search Network &nbsp;&nbsp; ❌ Google Display Network (uncheck this)<br>
            <em>${guide.networks?.reason || ''}</em>
          </td></tr>
          <tr><td style="height:1px;background:${BORDER};padding:0;margin:0;"></td></tr>
          <tr><td style="height:12px;"></td></tr>

          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};">Locations</td></tr>
          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">
            ${(guide.locations?.targets || []).join(' · ')}
          </td></tr>
          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">
            ${guide.locations?.radius ? `Radius: ${guide.locations.radius}` : ''}
          </td></tr>
          <tr><td style="padding-bottom:12px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:600;color:${NAVY};">
            Location Option: ${guide.locations?.locationOption || 'People in or regularly in your targeted locations'}
          </td></tr>
          <tr><td style="height:1px;background:${BORDER};padding:0;"></td></tr>
          <tr><td style="height:12px;"></td></tr>

          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};">Languages</td></tr>
          <tr><td style="padding-bottom:12px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">${(guide.languages || ['English']).join(', ')}</td></tr>
          <tr><td style="height:1px;background:${BORDER};padding:0;"></td></tr>
          <tr><td style="height:12px;"></td></tr>

          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};">Audience Segments</td></tr>
          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">
            Mode: <strong>${guide.audienceSegments?.mode || 'Observation'}</strong> (not Targeting — do not restrict reach)
          </td></tr>
          ${listItems(guide.audienceSegments?.suggested)}
          <tr><td style="height:12px;"></td></tr>
          <tr><td style="height:1px;background:${BORDER};padding:0;"></td></tr>
          <tr><td style="height:12px;"></td></tr>

          <tr><td style="padding-bottom:4px;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};">More Settings</td></tr>
          <tr><td style="padding-bottom:12px;font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;">
            Leave as defaults. You can set ad scheduling after your first 2 weeks of data show you which hours convert best.
          </td></tr>
        </table>
      </td></tr>

      <!-- Step 8: AI Max -->
      ${sectionHeader(8, 'AI Max')}
      <tr><td>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0;">
          ${guide.aiMax?.recommended ? '✅ Turn on AI Max' : '❌ Leave AI Max <strong>off</strong> for now.'} ${guide.aiMax?.reason || "AI Max gives Google significant control over your targeting and ad delivery. Until you have conversion data and understand your campaign's baseline performance, keeping this off gives you more control and clearer data."}
        </p>
      </td></tr>

      <!-- Step 9: Keyword & Asset Generation -->
      ${sectionHeader(9, 'Keyword and Asset Generation')}
      <tr><td>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0;">
          💡 <strong>Skip this step.</strong> Google will offer to auto-generate keywords and assets from your website. The suggestions are often too broad and off-target. Skip past this screen — you'll add your own in the next step.
        </p>
      </td></tr>

      <!-- Step 10: Keywords and Ads -->
      ${sectionHeader(10, 'Keywords and Ads')}
      <tr><td>
        <!-- Keywords -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:0 0 8px;">Keywords</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 12px;">
          This list is intentionally short. With a budget around $20/day, spreading across too many keywords means none get enough impressions to generate data. Start focused, then expand once you see what converts.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};">
          ${keywords}
        </table>

        <!-- Final URL -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:20px 0 4px;">Final URL</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:${GOLD};margin:0 0 4px;">${guide.finalUrl || ''}</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#718096;margin:0 0 16px;">This is where the ad sends users. Make sure this page clearly matches the ad's promise.</p>

        <!-- Display Paths -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:0 0 4px;">Display Path</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:0 0 4px;">
          yoursite.com / <strong>${(guide.displayPaths || [])[0] || ''}</strong> / <strong>${(guide.displayPaths || [])[1] || ''}</strong>
        </p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#718096;margin:0 0 20px;">Display paths are shown in the ad URL — they don't need to be real pages, just descriptive.</p>

        <!-- Phone -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:0 0 4px;">Call Extension</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:0 0 20px;">Add your main business phone number. Google will show it alongside your ad on mobile — this is one of the highest-converting extension types for local service businesses.</p>

        <!-- Headlines -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:0 0 4px;">Headlines</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#718096;margin:0 0 8px;">6 headlines only — fewer combinations = cleaner testing signal on a small budget.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};">
          ${headlineRows}
        </table>

        <!-- Descriptions -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:20px 0 4px;">Descriptions</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#718096;margin:0 0 8px;">3 descriptions — same reasoning. Each should make sense on its own.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};">
          ${descRows}
        </table>

        <!-- Images / Business Name / Logo -->
        <div style="background:${LIGHT_GOLD};border:1px solid ${GOLD};border-radius:6px;padding:14px;margin:20px 0 0;">
          <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${NAVY};margin:0 0 4px;">Images, Business Name & Business Logo</p>
          <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 8px;">
            These are only available if your Google Ads account is verified. If you don't see them, you'll need to complete the advertiser verification process in your account settings first — this can take a few days. Want help getting verified and set up properly?
          </p>
          <a href="${calendlyLink}" style="font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;">Book a call and we'll handle it →</a>
        </div>

        <!-- Sitelinks -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:24px 0 4px;">Sitelinks</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#718096;margin:0 0 8px;">Include description lines and URLs for each sitelink.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};">
          ${sitelinkRows}
        </table>

        <!-- Callouts -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:20px 0 8px;">Callout Extensions</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${listItems(guide.callouts)}
        </table>

        <!-- Structured Snippets -->
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:${NAVY};margin:20px 0 4px;">Structured Snippets</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;margin:0 0 8px;">
          Header: <strong>${guide.structuredSnippets?.header || 'Services'}</strong>
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${listItems(guide.structuredSnippets?.values)}
        </table>
      </td></tr>

      <!-- Step 11: Budget -->
      ${sectionHeader(11, 'Budget')}
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('Minimum Daily Budget', guide.budgetRecommendation?.minimumDaily || '')}
          ${infoRow('Recommended Starting Budget', guide.budgetRecommendation?.recommended || '')}
          ${infoRow('Why', guide.budgetRecommendation?.reason || '')}
        </table>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:12px 0 0;">
          💡 After your first 1–2 weeks, check the <strong>Campaigns</strong> tab in Google Ads and look for the <strong>"Search Impression Share Lost (Budget)"</strong> column. If this is above 20–30%, your budget is limiting your visibility and you should consider increasing it.
        </p>
      </td></tr>

      <!-- Step 12: Review -->
      ${sectionHeader(12, 'Review')}
      <tr><td style="padding-bottom:24px;border-bottom:1px solid ${BORDER};">
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 10px;">
          Before hitting Publish, run through this checklist:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${listItems([
            'Conversion tracking is confirmed working',
            'Display Network is unchecked',
            'Location option set to "People in or regularly in your targeted locations"',
            'AI Max is off',
            'Keyword list is 8–14 keywords max',
            'All headlines under 30 characters',
            'All descriptions under 90 characters',
            'Final URL loads correctly on mobile',
            'Sitelinks, callouts, and structured snippets are added',
            'Budget is set and you understand how to check impression share',
          ])}
        </table>
      </td></tr>

      <!-- Bonus: Negative Keywords -->
      <tr><td style="padding:28px 0 0;">
        <div style="background:#f0f4f8;border-radius:8px;padding:20px 24px;">
          <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:700;color:${GOLD};text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Bonus</p>
          <p style="font-family:Montserrat,Arial,sans-serif;font-size:16px;font-weight:700;color:${NAVY};margin:0 0 8px;">Negative Keywords</p>
          <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 14px;">
            There's no negative keyword field during campaign creation — you add them after. Once your campaign is live, go to <strong>Keywords → Negative Keywords</strong> in the left menu, click the <strong>+</strong> button, select your campaign, and add the list below. This prevents your ads from showing on irrelevant searches and protects your budget from day one.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};">
            ${(guide.negativeKeywords || []).map(k => {
              const fmt = k.matchType === 'Exact' ? `[${k.keyword}]` : `"${k.keyword}"`;
              const color = k.matchType === 'Exact' ? '#2d7a4f' : '#1a5276';
              return `<tr><td style="padding:6px 0;border-bottom:1px solid ${BORDER};font-family:Montserrat,Arial,sans-serif;">
                <span style="display:inline-block;width:60px;font-size:11px;font-weight:700;color:${color};text-transform:uppercase;">${k.matchType}</span>
                <span style="font-size:14px;color:${NAVY};font-weight:500;">${fmt}</span>
              </td></tr>`;
            }).join('')}
          </table>
        </div>
      </td></tr>

      <!-- Final CTA -->
      <tr><td style="padding:32px 0 0;">
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:15px;font-weight:700;color:${NAVY};margin:0 0 8px;">Want this done for you?</p>
        <p style="font-family:Montserrat,Arial,sans-serif;font-size:13px;color:#4a5568;line-height:1.6;margin:0 0 16px;">
          Setting up a campaign correctly is one thing. Managing it — adjusting bids, testing ad variations, cutting wasted spend, and scaling what works — is where most business owners run out of time. We handle all of it.
        </p>
        ${ctaButton('Book a Free Strategy Call →', calendlyLink)}
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:${NAVY};border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
    <p style="font-family:Montserrat,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.5);margin:0;">
      Rithaler Consulting Services · Kamloops, BC · <a href="https://rithaler-consulting.com" style="color:${GOLD};text-decoration:none;">rithaler-consulting.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
