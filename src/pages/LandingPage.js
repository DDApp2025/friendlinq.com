import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const APP_STORE_URL = 'https://apps.apple.com/us/app/friendlinq/id6476931666';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.app.friendlinq';
const APP_STORE_BADGE = 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83';
const PLAY_STORE_BADGE = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

const faqData = [
  {
    q: 'What is Friendlinq?',
    a: 'Friendlinq is a social network designed for adults who want a simpler, safer way to stay connected. Unlike Facebook or Instagram, Friendlinq features a clean interface, enhanced privacy protections, and community features that help you stay in touch with friends and family and engage with people who share your interests. It is completely free to join and use.',
  },
  {
    q: 'How is Friendlinq different from Facebook?',
    a: 'Friendlinq is built from the ground up for people who want simplicity. That means cleaner navigation, larger text, no algorithm-driven content manipulation, no advertisements, and privacy controls designed to actually protect you. Facebook is a general social network built around engagement metrics \u2014 Friendlinq is built around you.',
  },
  {
    q: 'Is Friendlinq really free?',
    a: 'Yes, completely. There are no subscription fees, no hidden charges, and no premium tiers required to access core features including messaging, community groups, photo sharing, video calls, and event discovery.',
  },
  {
    q: 'Do I need to be tech-savvy to use Friendlinq?',
    a: 'Not at all. Friendlinq uses large, clear buttons, simple navigation, and straightforward language. There\'s a guided tutorial that walks you through every feature step by step. If you can browse the internet and send an email, you can use Friendlinq.',
  },
  {
    q: 'Is Friendlinq safe?',
    a: 'Yes. Friendlinq is built with your safety as a top priority. The platform includes enhanced privacy controls, community moderation, and protection from scams and spam. Your personal data is never sold to advertisers or third parties.',
  },
  {
    q: 'Can my family members join?',
    a: 'Absolutely. Friendlinq is open to adults of all ages. Invite your family, friends, and anyone you want to stay connected with. The more people you care about who join, the better the experience.',
  },
  {
    q: 'What can I do on Friendlinq?',
    a: 'You can connect with friends and family, join interest-based community groups (gardening, travel, book clubs, and more), share photos and updates, send private messages, make video and audio calls, host or join live streams, discover local events, and browse the marketplace \u2014 all through an interface designed for simplicity and comfort.',
  },
  {
    q: 'How do I sign up?',
    a: 'Just fill out the sign-up form at the top of this page with your name, email address, and a password. It takes less than a minute. Once registered, you can immediately start connecting with others and exploring community groups.',
  },
];

const svgStyle = { width: 22, height: 22, stroke: '#1a6b3a', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const svgStyleLg = { width: 26, height: 26, stroke: '#1a6b3a', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// SVG icon components — small (hero bullets)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" style={svgStyle}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconSmile = () => (
  <svg viewBox="0 0 24 24" style={svgStyle}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" style={svgStyle}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" style={svgStyle}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconMonitor = () => (
  <svg viewBox="0 0 24 24" style={svgStyle}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
);

// SVG icon components — large (feature cards)
const IconChatLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconImageLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const IconUsersLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconVideoLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const IconClockLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconProfileLg = () => (
  <svg viewBox="0 0 24 24" style={svgStyleLg}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const IconChevron = ({ open }) => (
  <span style={{ fontSize: 18, color: '#606770', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9662;</span>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? -1 : i);
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#f0f2f5', color: '#1c1e21', minHeight: '100vh' }}>
      <Helmet>
        <title>Friendlinq | Free Ad-Free Social Network — Facebook Alternative</title>
        <meta name="description" content="Friendlinq is a free, ad-free social network — a Facebook alternative with no data selling. Connect with friends, join groups, video call, share photos. Private and safe." />
        <link rel="canonical" href="https://friendlinq.com/" />
        <meta property="og:title" content="Friendlinq | Free Ad-Free Social Network — Facebook Alternative" />
        <meta property="og:description" content="Friendlinq is the ad-free, private social network alternative. No ads, no tracking, no algorithms. Connect with friends and family, join community groups, make video calls, share photos — all free. Available on web, iOS, and Android." />
        <meta property="og:url" content="https://friendlinq.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Friendlinq | Free Ad-Free Social Network — Facebook Alternative" />
        <meta name="twitter:description" content="Free social network. No ads. No data selling. No algorithms. Just real connection. Join Friendlinq." />
      </Helmet>

      {/* ── Top Nav ── */}
      <nav style={styles.topnav} aria-label="Primary navigation">
        <div style={styles.topnavLogo}>
          <img src={`${process.env.PUBLIC_URL}/logo-app-small.jpeg`} alt="Friendlinq logo — simple safe social network" width="36" height="36" style={styles.logoIcon} />
          <span style={styles.logoName}>Friendlinq</span>
        </div>
        {/* Desktop login fields */}
        <div style={styles.topnavLogin} className="landing-topnav-login">
          <input type="text" placeholder="Email" style={styles.navInput} />
          <input type="password" placeholder="Password" style={styles.navInput} />
          <button style={styles.btnLogin} onClick={() => navigate('/login')}>Log in</button>
          <Link to="/forgot-password" style={styles.forgot}>Forgot password?</Link>
        </div>
        {/* Mobile login button */}
        <div style={styles.topnavMobileLogin} className="landing-topnav-mobile">
          <button style={styles.btnLogin} onClick={() => navigate('/login')}>Log in</button>
        </div>
      </nav>

      <main role="main">
      {/* ── Hero Section ── */}
      <section style={styles.hero} className="landing-hero" aria-label="Hero">
        <div style={styles.heroLeft} className="landing-hero-left">
          <h1 style={styles.h1}>Stay connected with the people who matter most.</h1>
          <p style={styles.subtitle}>Friendlinq is the social network designed for adults who value simplicity, safety, and real connection. Easy to use, private by design, and completely free.</p>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconUsers /></div>
            <div>
              <div style={styles.featureTitle}>Connect with friends and family</div>
              <div style={styles.featureDesc}>Share updates, photos, and messages with the people you care about — family, old friends, neighbors.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconSmile /></div>
            <div>
              <div style={styles.featureTitle}>Join community groups</div>
              <div style={styles.featureDesc}>Gardening, travel, book clubs, cooking, health and wellness — find people who share your passions.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconVideo /></div>
            <div>
              <div style={styles.featureTitle}>Video calls and live streams</div>
              <div style={styles.featureDesc}>See loved ones face-to-face with one-tap video calling. Host or join live streams with friends and groups.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconShield /></div>
            <div>
              <div style={styles.featureTitle}>Safe and private by design</div>
              <div style={styles.featureDesc}>No ads. No data selling. No algorithm tricks. Built from the ground up to protect your privacy online.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconMonitor /></div>
            <div>
              <div style={styles.featureTitle}>Designed for comfort, not complexity</div>
              <div style={styles.featureDesc}>Large text, clear buttons, simple navigation. If you can browse the web and send email, you can use Friendlinq.</div>
            </div>
          </div>
        </div>

        <div style={styles.heroRight} className="landing-hero-right">
          <div style={styles.signupCard}>
            <h2 style={styles.signupH2}>Join Friendlinq</h2>
            <p style={styles.signupSub}>It's free and always will be.</p>
            <input type="text" placeholder="First name" style={styles.signupInput} readOnly onFocus={() => navigate('/register')} />
            <input type="text" placeholder="Last name" style={styles.signupInput} readOnly onFocus={() => navigate('/register')} />
            <input type="email" placeholder="Email address" style={styles.signupInput} readOnly onFocus={() => navigate('/register')} />
            <input type="password" placeholder="Create a password" style={styles.signupInput} readOnly onFocus={() => navigate('/register')} />
            <hr style={styles.divider} />
            <button style={styles.btnSignup} onClick={() => navigate('/register')}>Sign up</button>
            <p style={{ fontSize: 14, textAlign: 'center', marginBottom: 12, color: '#606770' }}>
              Already have an account? <Link to="/login" style={{ color: '#1a6b3a', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
            </p>
            <p style={styles.legal}>
              By signing up you agree to our <Link to="/terms" style={{ color: '#1a6b3a', textDecoration: 'none' }}>Terms</Link> and <Link to="/privacy" style={{ color: '#1a6b3a', textDecoration: 'none' }}>Privacy Policy</Link>.
            </p>
          </div>
          {/* App Store Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18 }}>
            <div style={styles.badgeWrap}>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={styles.badgeLink}>
                <img src={APP_STORE_BADGE} alt="Download Friendlinq on the App Store" width="150" height="50" style={{ width: '100%', height: 'auto' }} />
              </a>
            </div>
            <div style={styles.badgeWrap}>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" style={styles.badgeLink}>
                <img src={PLAY_STORE_BADGE} alt="Get Friendlinq on Google Play" width="195" height="75" style={{ width: '130%', height: 'auto' }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={styles.statsBar} aria-label="Platform highlights">
        <div style={styles.statsInner} className="landing-stats-inner">
          <div style={styles.stat}>
            <div style={styles.statLabel}>Built for</div>
            <div style={styles.statValue}>Real people</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Cost to join</div>
            <div style={styles.statValue}>Always free</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Your personal data</div>
            <div style={styles.statValue}>Never sold</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Available on</div>
            <div style={styles.statValue}>Web, iOS, Android</div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={styles.featuresDetail} aria-label="Features">
        <h2 style={styles.sectionH2}>Everything you need to stay connected</h2>
        <p style={styles.sectionSub}>Friendlinq gives you the tools to keep your social life thriving — without the confusion.</p>
        <div style={styles.featuresGrid} className="landing-features-grid">
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconChatLg /></div>
            <h3 style={styles.fcardTitle}>Messaging</h3>
            <p style={styles.fcardDesc}>Private conversations with friends and family. Send text, photos, and voice messages.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconImageLg /></div>
            <h3 style={styles.fcardTitle}>Photo sharing</h3>
            <p style={styles.fcardDesc}>Upload and share photos with friends. Create albums for trips, family, hobbies.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconUsersLg /></div>
            <h3 style={styles.fcardTitle}>Groups</h3>
            <p style={styles.fcardDesc}>Join or create groups around your interests. Meet people who love what you love.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconVideoLg /></div>
            <h3 style={styles.fcardTitle}>Video calls</h3>
            <p style={styles.fcardDesc}>One-on-one or group video calls. See faces, not just text. Works on phone, tablet, or computer.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconClockLg /></div>
            <h3 style={styles.fcardTitle}>Events</h3>
            <p style={styles.fcardDesc}>Discover local activities, community events, and virtual get-togethers near you.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconProfileLg /></div>
            <h3 style={styles.fcardTitle}>Your profile</h3>
            <p style={styles.fcardDesc}>Share your story. Add a photo, bio, and interests so friends old and new can find you.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      {/* All FAQ answers are always in the DOM for SEO crawlers (Step 2.9). CSS display toggles visibility. */}
      <section style={styles.faqSection} aria-label="Frequently asked questions">
        <div style={styles.faqInner}>
          <h2 style={styles.sectionH2}>Frequently asked questions</h2>
          {faqData.map((item, i) => (
            <div key={i} style={styles.faqItem}>
              <div
                style={{ ...styles.faqQ, background: openFaq === i ? '#f0f2f5' : '#fafbfc' }}
                onClick={() => toggleFaq(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaq(i); } }}
                aria-expanded={openFaq === i}
              >
                <span>{item.q}</span>
                <IconChevron open={openFaq === i} />
              </div>
              <div style={{ ...styles.faqA, display: openFaq === i ? 'block' : 'none' }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Bar ── */}
      <section style={styles.ctaBar} aria-label="Call to action">
        <h2 style={styles.ctaH2}>Ready to stay connected?</h2>
        <p style={styles.ctaP}>Join Friendlinq today. It takes less than a minute and it's completely free.</p>
        <button style={styles.btnCta} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Sign up now</button>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer style={styles.footer} role="contentinfo">
        <div style={styles.footerInner} className="landing-footer-inner">
          <div style={styles.footerLogo}>
            <img src={`${process.env.PUBLIC_URL}/logo-app-small.jpeg`} alt="Friendlinq logo — simple safe social network" width="28" height="28" loading="lazy" style={styles.footerLogoIcon} />
            <span style={styles.footerLogoName}>Friendlinq</span>
          </div>
          <div style={styles.footerLinks}>
            <a href="/about" style={styles.footerLink}>About</a>
            <a href="/features" style={styles.footerLink}>Features</a>
            <Link to="/safety" style={styles.footerLink}>Safety</Link>
            <a href="/faq" style={styles.footerLink}>FAQ</a>
            <Link to="/support" style={styles.footerLink}>Support</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
            <Link to="/privacy" style={styles.footerLink}>Privacy policy</Link>
            <Link to="/terms" style={styles.footerLink}>Terms of service</Link>
          </div>
          <span style={styles.footerCopy}>&copy; 2026 Spire Group Inc. All rights reserved.</span>
        </div>
      </footer>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .landing-hero {
            flex-direction: column !important;
            padding: 32px 20px !important;
            gap: 32px !important;
          }
          .landing-hero-left {
            padding-top: 0 !important;
          }
          .landing-hero-right {
            flex: none !important;
            width: 100% !important;
          }
          .landing-topnav-login {
            display: none !important;
          }
          .landing-topnav-mobile {
            display: flex !important;
          }
          .landing-features-grid {
            grid-template-columns: 1fr !important;
          }
          .landing-stats-inner {
            flex-direction: column !important;
            align-items: center !important;
          }
          .landing-footer-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  // Top Nav
  topnav: { background: '#1a6b3a', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  topnavLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 36, height: 36, borderRadius: 8, objectFit: 'cover' },
  logoName: { color: '#fff', fontSize: 22, fontWeight: 600, letterSpacing: -0.5 },
  topnavLogin: { display: 'flex', gap: 8, alignItems: 'center' },
  topnavMobileLogin: { display: 'none', alignItems: 'center' },
  navInput: { padding: '7px 12px', borderRadius: 5, border: 'none', fontSize: 13, width: 150, background: 'rgba(255,255,255,0.92)', color: '#333' },
  btnLogin: { background: '#4a9e6e', color: '#fff', padding: '7px 18px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' },
  forgot: { color: 'rgba(255,255,255,0.7)', fontSize: 11, whiteSpace: 'nowrap', textDecoration: 'none' },

  // Hero
  hero: { maxWidth: 980, margin: '0 auto', padding: '56px 32px 48px', display: 'flex', gap: 48, alignItems: 'flex-start' },
  heroLeft: { flex: 1, minWidth: 0, paddingTop: 8 },
  heroRight: { flex: '0 0 360px' },
  h1: { fontSize: 28, fontWeight: 700, lineHeight: 1.25, color: '#1c1e21', marginBottom: 12 },
  subtitle: { fontSize: 18, color: '#4b4f56', lineHeight: 1.55, marginBottom: 36 },

  // Hero features
  feature: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 },
  featureIcon: { minWidth: 48, height: 48, background: '#e8f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, fontWeight: 600, color: '#1c1e21', marginBottom: 3 },
  featureDesc: { fontSize: 14, color: '#606770', lineHeight: 1.5 },

  // Signup card
  signupCard: { background: '#fff', borderRadius: 10, padding: '28px 24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  signupH2: { fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 4, color: '#1c1e21' },
  signupSub: { fontSize: 14, color: '#606770', textAlign: 'center', marginBottom: 20 },
  signupInput: { width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid #dddfe2', fontSize: 15, marginBottom: 10, background: '#f5f6f7', color: '#1c1e21', boxSizing: 'border-box' },
  divider: { border: 'none', borderTop: '1px solid #dddfe2', margin: '16px 0' },
  btnSignup: { width: '100%', background: '#1a6b3a', color: '#fff', padding: 13, borderRadius: 6, fontSize: 17, fontWeight: 700, textAlign: 'center', cursor: 'pointer', border: 'none', marginBottom: 12 },
  legal: { fontSize: 11, color: '#90949c', textAlign: 'center', lineHeight: 1.5 },

  // App store badges
  badgeWrap: { width: 150, height: 50, overflow: 'hidden', borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badgeLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },

  // Stats bar
  statsBar: { background: '#fff', borderTop: '1px solid #e4e6eb', borderBottom: '1px solid #e4e6eb', padding: '28px 32px' },
  statsInner: { maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 },
  stat: { textAlign: 'center' },
  statLabel: { fontSize: 13, color: '#606770', marginBottom: 3 },
  statValue: { fontSize: 20, fontWeight: 700, color: '#1a6b3a' },

  // Features grid
  featuresDetail: { maxWidth: 980, margin: '0 auto', padding: '48px 32px' },
  sectionH2: { fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#1c1e21' },
  sectionSub: { fontSize: 15, color: '#606770', textAlign: 'center', marginBottom: 36 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  fcard: { background: '#fff', borderRadius: 10, padding: '24px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb', textAlign: 'center' },
  fcardIcon: { width: 56, height: 56, background: '#e8f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  fcardTitle: { fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#1c1e21' },
  fcardDesc: { fontSize: 13, color: '#606770', lineHeight: 1.5 },

  // FAQ
  faqSection: { background: '#fff', borderTop: '1px solid #e4e6eb', padding: '48px 32px' },
  faqInner: { maxWidth: 720, margin: '0 auto' },
  faqItem: { border: '1px solid #e4e6eb', borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  faqQ: { padding: '16px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1c1e21', background: '#fafbfc', border: 'none', width: '100%', textAlign: 'left' },
  faqA: { padding: '0 20px 16px', fontSize: 14, color: '#606770', lineHeight: 1.6 },

  // CTA
  ctaBar: { background: '#1a6b3a', padding: '40px 32px', textAlign: 'center' },
  ctaH2: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  btnCta: { display: 'inline-block', background: '#fff', color: '#1a6b3a', padding: '14px 40px', borderRadius: 6, fontSize: 17, fontWeight: 700, cursor: 'pointer', border: 'none' },

  // Footer
  footer: { background: '#1c1e21', padding: '28px 32px' },
  footerInner: { maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 8 },
  footerLogoIcon: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover' },
  footerLogoName: { color: '#fff', fontSize: 15, fontWeight: 600 },
  footerLinks: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  footerLink: { color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' },
  footerCopy: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
};
