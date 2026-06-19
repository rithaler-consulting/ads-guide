'use client';
import { useState, useEffect, useRef } from 'react';

const NAVY = '#0F2340';
const GOLD = '#C99833';
const GOLD_LIGHT = '#fdf6e3';
const GREY = '#f8f9fb';
const BORDER = '#e2e6ea';
const GREEN = '#2d7a4f';

// ── Utility styles ─────────────────────────────────────────────────────────────

const s = {
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(15,35,64,0.10)',
    padding: '36px 40px',
    maxWidth: 720,
    margin: '0 auto',
    fontFamily: "'Montserrat', sans-serif",
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${BORDER}`,
    borderRadius: 7,
    fontSize: 14,
    fontFamily: "'Montserrat', sans-serif",
    color: NAVY,
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${BORDER}`,
    borderRadius: 7,
    fontSize: 14,
    fontFamily: "'Montserrat', sans-serif",
    color: NAVY,
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: 90,
  },
  btn: {
    background: GOLD,
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
    width: '100%',
    marginTop: 8,
  },
  btnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  tag: (color = NAVY) => ({
    display: 'inline-block',
    background: color,
    color: '#fff',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    marginRight: 4,
    marginBottom: 4,
  }),
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: NAVY,
    margin: '28px 0 6px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  stepBadge: {
    width: 28,
    height: 28,
    background: NAVY,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  divider: {
    borderTop: `1px solid ${BORDER}`,
    margin: '20px 0',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
    borderBottom: `1px solid ${BORDER}`,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: NAVY,
    fontWeight: 500,
  },
  tip: {
    background: GOLD_LIGHT,
    border: `1px solid ${GOLD}`,
    borderRadius: 7,
    padding: '12px 14px',
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 1.7,
    margin: '10px 0',
  },
  blurredSection: {
    position: 'relative',
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.95) 50%)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '32px 24px',
  },
};

// ── Sub-components ──────────────────────────────────────────────────────────────

function StepHeader({ num, title }) {
  return (
    <div style={s.sectionTitle}>
      <div style={s.stepBadge}>{num}</div>
      <span>{title}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  );
}

function Tip({ children }) {
  return <div style={s.tip}>💡 {children}</div>;
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul style={{ paddingLeft: 18, margin: '6px 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: NAVY, marginBottom: 4, lineHeight: 1.5 }}>{item}</li>
      ))}
    </ul>
  );
}

function MatchTag({ type }) {
  const colors = { Exact: GREEN, Phrase: '#1a5276', Broad: '#7d6608' };
  return <span style={s.tag(colors[type] || NAVY)}>{type}</span>;
}

function KeywordRow({ kw }) {
  const fmt = kw.matchType === 'Exact' ? `[${kw.keyword}]` : kw.matchType === 'Phrase' ? `"${kw.keyword}"` : kw.keyword;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: `1px solid ${BORDER}` }}>
      <MatchTag type={kw.matchType} />
      <span style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>{fmt}</span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────

export default function AdsGuide() {
  const [step, setStep] = useState('form'); // form | scanning | preview | submitting | done | error
  const [form, setForm] = useState({ url: '', businessName: '', city: '', usps: '' });
  const [guide, setGuide] = useState(null);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanStatus, setScanStatus] = useState('');
  const containerRef = useRef(null);

  // Notify parent iframe of height changes
  useEffect(() => {
    const notify = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: 'resize', height: h }, '*');
    };
    notify();
    const ro = new ResizeObserver(notify);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [step, guide]);

  const handleSubmitForm = async (e) => {
  e.preventDefault();
  if (!form.url || !form.businessName || !form.city || !form.usps) return;
  setStep('scanning');
  setErrorMsg('');
  try {
    // Step 1: Scan URL
    setScanStatus('Scanning your website…');
    const scanRes = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: form.url }),
    });
    const scanData = await scanRes.json();
    // Step 2: Generate guide
    setScanStatus('Building your custom setup guide…');
    const genRes = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: form.url,
        businessName: form.businessName,
        city: form.city,
        usps: form.usps,
        siteTitle: scanData.title || '',
        siteDescription: scanData.description || '',
        siteBodyText: scanData.bodyText || '',
      }),
    });
    const genData = await genRes.json();
    if (genData.error) throw new Error(genData.error);
    setGuide(genData.guide);

    // Meta pixel Lead event — fires only on successful guide generation
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }

    // Fire notify immediately — non-blocking
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guide: genData.guide, url: form.url, usps: form.usps }),
    }).catch(() => {});
    setStep('preview');
  } catch (err) {
    setErrorMsg(err.message || 'Something went wrong. Please try again.');
    setStep('error');
  }
};

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !guide) return;
    setStep('submitting');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, guide }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStep('done');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send. Please try again.');
      setStep('error');
    }
  };

  // ── Render: Input Form ────────────────────────────────────────────────────────

  if (step === 'form') {
    return (
      <div ref={containerRef} style={{ padding: '24px 16px 40px' }}>
        <div style={s.card}>
          <form onSubmit={handleSubmitForm}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={s.label}>Website URL</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="e.g. yourbusiness.com"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <div>
                  <label style={s.label}>Business Name</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Apex Plumbing"
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label style={s.label}>City / Service Area</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Kamloops, BC"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={s.label}>Your Unique Selling Points (USPs)</label>
                <textarea
                  style={s.textarea}
                  placeholder="e.g. Same-day service, upfront pricing, licensed & insured, 200+ 5-star reviews, locally owned"
                  value={form.usps}
                  onChange={e => setForm(f => ({ ...f, usps: e.target.value }))}
                  required
                />

              </div>
              <button type="submit" style={s.btn}>
                Build My Google Ads Setup Guide →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Render: Scanning ──────────────────────────────────────────────────────────

  if (step === 'scanning') {
    return (
      <div ref={containerRef} style={{ padding: '40px 16px' }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeDot { 0%,80%,100%{opacity:0} 40%{opacity:1} }
        `}</style>
        <div style={{ ...s.card, textAlign: 'center' }}>
          {/* Spinning ring */}
          <div style={{
            width: 56, height: 56,
            border: `5px solid ${GREY}`,
            borderTop: `5px solid ${GOLD}`,
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
            margin: '0 auto 20px',
          }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>Building Your Guide</h2>
          <p style={{ fontSize: 14, color: '#718096', margin: 0 }}>{scanStatus}</p>
        </div>
      </div>
    );
  }

  // ── Render: Error ─────────────────────────────────────────────────────────────

  if (step === 'error') {
    return (
      <div ref={containerRef} style={{ padding: '40px 16px' }}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <h2 style={{ color: '#c0392b', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#4a5568', fontSize: 14, marginBottom: 20 }}>{errorMsg}</p>
          <button style={s.btn} onClick={() => setStep('form')}>← Try Again</button>
        </div>
      </div>
    );
  }

  // ── Render: Done ──────────────────────────────────────────────────────────────

  if (step === 'done') {
    return (
      <div ref={containerRef} style={{ padding: '40px 16px' }}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: '0 0 10px' }}>Your guide is on its way.</h2>
          <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7, marginBottom: 24 }}>
            Check your inbox for your complete Google Ads Setup Guide for <strong>{guide?.businessName}</strong>. It includes your custom keywords, headlines, descriptions, sitelinks, and everything else covered in the steps below.
          </p>
          <a
            href="https://calendly.com/ryan-rithaler-consulting/strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...s.btn, display: 'inline-block', textDecoration: 'none', textAlign: 'center', maxWidth: 340 }}
          >
            Book a Free Strategy Call →
          </a>
        </div>
      </div>
    );
  }

  // ── Render: Submitting ────────────────────────────────────────────────────────

  if (step === 'submitting') {
    return (
      <div ref={containerRef} style={{ padding: '40px 16px' }}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📤</div>
          <p style={{ color: '#4a5568', fontSize: 14 }}>Sending your guide…</p>
        </div>
      </div>
    );
  }

  // ── Render: Preview ───────────────────────────────────────────────────────────

  if (!guide) return null;

  return (
    <div ref={containerRef} style={{ padding: '24px 16px 40px', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={s.card}>

        {/* Header */}
        <div style={{ background: NAVY, borderRadius: 10, padding: '28px 28px 24px', marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>
            Your Custom Google Ads Setup Guide
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{guide.businessName}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{guide.city} · {guide.industry}</p>
        </div>

        {/* STEP 1: Objective */}
        <StepHeader num={1} title="Choose Your Objective" />
        <InfoRow label="Recommended" value={guide.objective?.recommended} />
        <InfoRow label="Why" value={guide.objective?.reason} />
        <Tip>On the campaign creation screen, select <strong>{guide.objective?.recommended}</strong> and click Continue.</Tip>

        <div style={s.divider} />

        {/* STEP 2: Conversion Goals */}
        <StepHeader num={2} title="Conversion Goals" />
        <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7, margin: '0 0 10px' }}>
          This is the most important — and most skipped — step. Google uses your conversion data to optimize who sees your ads. If it's not set up correctly, you're flying blind and paying for it.
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: '8px 0 4px' }}>Recommended conversions to track:</p>
        <BulletList items={guide.conversionGoals?.recommended} />
        {guide.conversionGoals?.setupNote && (
          <Tip>{guide.conversionGoals.setupNote}</Tip>
        )}

        {/* Conversion CTA */}
        <div style={{ background: GOLD_LIGHT, border: `1px solid ${GOLD}`, borderRadius: 8, padding: 20, margin: '14px 0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: '0 0 6px' }}>⚡ Is your conversion tracking set up correctly?</p>
          <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, margin: '0 0 14px' }}>
            Most businesses we audit have conversion tracking that's either missing or firing incorrectly — meaning Google has been optimizing toward the wrong signals. Book a complimentary conversion tracking review (limited availability).
          </p>
          <a
            href="https://calendly.com/ryan-rithaler-consulting/strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...s.btn, display: 'inline-block', textDecoration: 'none', textAlign: 'center', maxWidth: 340, marginTop: 0 }}
          >
            Book My Free Conversion Review →
          </a>
        </div>

        <div style={s.divider} />

        {/* STEP 3: Campaign Type */}
        <StepHeader num={3} title="Campaign Type" />
        <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7 }}>
          Select <strong style={{ color: NAVY }}>Search</strong> and click Continue. This targets people actively searching for your service — the highest-intent traffic available. Do not select Performance Max, Display, or Smart campaigns.
        </p>

        <div style={s.divider} />

        {/* STEP 4: Ways to Reach Goal */}
        <StepHeader num={4} title="Select How You'd Like to Reach Your Goal" />
        <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7 }}>
          Check <strong>Website visits</strong> and <strong>Phone calls</strong>. Uncheck everything else — keep it focused.
        </p>

        <div style={s.divider} />

        {/* STEP 5: Campaign Name */}
        <StepHeader num={5} title="Campaign Name" />
        <InfoRow label="Recommended Name" value={guide.campaignName} />
        <Tip>A structured naming convention matters once you have multiple campaigns. This format tells you what, where, and when at a glance.</Tip>

        <div style={s.divider} />

        {/* STEP 6: Bidding */}
        <StepHeader num={6} title="Bidding" />
        <InfoRow label="Bidding Strategy" value={guide.bidding?.strategy} />
        <InfoRow label="Target CPA" value={guide.bidding?.targetCPA} />
        <InfoRow label="New Customers Only" value={guide.bidding?.newCustomersOnly} />
        <InfoRow label="Why" value={guide.bidding?.reason} />

        <div style={s.divider} />

        {/* STEP 7: Campaign Settings */}
        <StepHeader num={7} title="Campaign Settings" />

        <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '12px 0 4px' }}>Networks</p>
        <p style={{ fontSize: 13, color: '#4a5568', margin: '0 0 4px' }}>
          ✅ Google Search Network &nbsp;·&nbsp; ❌ Uncheck Google Display Network
        </p>
        <p style={{ fontSize: 13, color: '#718096', margin: '0 0 12px', fontStyle: 'italic' }}>{guide.networks?.reason}</p>

        <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '12px 0 4px' }}>Locations</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {(guide.locations?.targets || []).map((loc, i) => <span key={i} style={s.tag(NAVY)}>{loc}</span>)}
        </div>
        {guide.locations?.radius && (
          <p style={{ fontSize: 13, color: '#4a5568', margin: '0 0 4px' }}>{guide.locations.radius}</p>
        )}
        <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: '4px 0 12px' }}>
          Location Option: <span style={{ fontWeight: 400 }}>{guide.locations?.locationOption}</span>
        </p>

        <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '12px 0 4px' }}>Languages</p>
        <p style={{ fontSize: 13, color: '#4a5568', margin: '0 0 12px' }}>{(guide.languages || []).join(', ')}</p>

        <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '12px 0 4px' }}>Audience Segments</p>
        <p style={{ fontSize: 13, color: '#4a5568', margin: '0 0 4px' }}>
          Mode: <strong>{guide.audienceSegments?.mode}</strong> — do not switch to "Targeting" as it restricts reach
        </p>
        <BulletList items={guide.audienceSegments?.suggested} />

        <div style={s.divider} />

        {/* — EMAIL GATE — tiny blurred teaser then immediate CTA — */}
        <div style={{ position: 'relative' }}>

          {/* Just enough blurred content to show there's more */}
          <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.7, maxHeight: 120, overflow: 'hidden' }}>
            <StepHeader num={8} title="AI Max" />
            <p style={{ fontSize: 13, color: '#4a5568' }}>❌ Leave AI Max off for now. {guide.aiMax?.reason?.slice(0, 80)}…</p>
            <StepHeader num={10} title="Keywords and Ads" />
            <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '8px 0 6px' }}>Keywords ({guide.keywords?.length} custom keywords generated for your business)</p>
          </div>

          {/* Fade overlay — starts immediately */}
          <div style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%)',
            position: 'absolute',
            inset: 0,
            zIndex: 5,
          }} />

          {/* Email gate — sits right below the fade */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: 8 }}>
            <div style={{
              background: '#fff',
              border: `2px solid ${GOLD}`,
              borderRadius: 12,
              padding: '28px 24px',
              boxShadow: '0 8px 32px rgba(15,35,64,0.12)',
              maxWidth: 480,
              margin: '0 auto',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📬</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: NAVY, margin: '0 0 8px' }}>
                Get Your Complete Setup Guide
              </h3>
              <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7, margin: '0 0 18px' }}>
                Enter your email and we'll send the full guide — including your custom keywords, ad copy, sitelinks, callouts, budget recommendation, and a final review checklist.
              </p>
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ ...s.input, textAlign: 'center' }}
                />
                <button type="submit" style={{ ...s.btn, marginTop: 0 }}>
                  Send My Full Guide →
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
