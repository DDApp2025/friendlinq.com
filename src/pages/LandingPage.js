import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginAttempt, SignUpAttempt, getProfileAttempt, makeUserFriendWithAdmin } from '../actions/auth_actions';

const APP_STORE_URL = 'https://apps.apple.com/us/app/friendlinq/id6476931666';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.app.friendlinq';
const APP_STORE_BADGE = 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83';
const PLAY_STORE_BADGE = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

const faqData = [
  {
    q: 'What is Friendlinq?',
    a: 'Friendlinq is a calm, private social network for the people you actually know \u2014 your family, your real friends, your community. No ads, no tracking, no algorithm. Just the people you\'d invite to your kitchen table.',
  },
  {
    q: 'How is Friendlinq different from Facebook?',
    a: 'Facebook became an ad platform driven by an algorithm that decides what you see. Friendlinq is the opposite \u2014 your feed is your friends and family, in chronological order, with no ads, no tracking, and no algorithm. It is what social media was supposed to be.',
  },
  {
    q: 'Is Friendlinq really free?',
    a: 'Yes, completely. No subscription fees, no hidden charges, no premium tier. The features that matter are free for everyone, forever.',
  },
  {
    q: 'Do I need to be tech-savvy to use Friendlinq?',
    a: 'No. Friendlinq is designed for simplicity \u2014 clear buttons, simple navigation, and straightforward language. If you can browse the internet and send an email, you can use Friendlinq.',
  },
  {
    q: 'Is Friendlinq safe?',
    a: 'Yes. Your data is never sold. There are no third-party trackers. Privacy controls let you decide who sees what, and the platform is moderated to protect against scams and spam.',
  },
  {
    q: 'Can my whole family join?',
    a: 'Yes \u2014 and most people use Friendlinq exactly that way. One person creates an account and invites their family. Within a week, mom, dad, siblings, kids, and grandparents are all in one calm place.',
  },
  {
    q: 'What can I do on Friendlinq?',
    a: 'Share photos and updates, send private messages, make video and audio calls, join family and interest groups, plan events, and stay in touch with the people you actually know. Everything you need, nothing you don\'t.',
  },
  {
    q: 'How do I sign up?',
    a: 'Fill out the sign-up form at the top of this page with your name, email, and a password. Takes less than a minute. Then invite your family and start sharing life again.',
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
  const dispatch = useDispatch();
  const [openFaq, setOpenFaq] = useState(0);

  // Nav login state
  const [navEmail, setNavEmail] = useState('');
  const [navPassword, setNavPassword] = useState('');
  const [navError, setNavError] = useState('');
  const [navLoading, setNavLoading] = useState(false);

  // Signup card state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? -1 : i);
  };

  const handleNavLogin = async () => {
    setNavError('');
    if (!navEmail.trim() || !navPassword.trim()) {
      setNavError('Enter email and password');
      return;
    }
    setNavLoading(true);
    const res = await dispatch(LoginAttempt(navEmail, navPassword));
    setNavLoading(false);
    if (res.success) {
      navigate('/home');
    } else {
      setNavError(res.message || 'Login failed');
    }
  };

  const handleSignup = async () => {
    setSignupError('');
    if (!firstName.trim() || !lastName.trim()) {
      setSignupError('Enter your first and last name');
      return;
    }
    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setSignupError('Enter a valid email address');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupLoading(true);
    const fullName = (firstName.trim() + ' ' + lastName.trim()).trim();
    const signupData = {
      fullName,
      email: signupEmail.trim(),
      password: confirmPassword,
      gender: '',
      deviceType: 'ANDROID',
      deviceToken: 'web',
      usertype: '0',
    };

    const res = await dispatch(SignUpAttempt(signupData));

    if (res.statusCode === 200 || res.success) {
      if (res.data?.customerData?._id) {
        await dispatch(makeUserFriendWithAdmin(res.data.customerData._id));
      }
      const loginRes = await dispatch(LoginAttempt(signupEmail.trim(), confirmPassword));
      if (loginRes.success) {
        await dispatch(getProfileAttempt());
        setSignupLoading(false);
        navigate('/home');
      } else {
        setSignupLoading(false);
        setSignupError('Account created! Please log in.');
      }
    } else {
      setSignupLoading(false);
      setSignupError(res.message || 'Registration failed');
    }
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#f0f2f5', color: '#1c1e21', minHeight: '100vh' }}>
      {/* ── Top Nav ── */}
      <nav style={styles.topnav} aria-label="Primary navigation">
        <div style={styles.topnavLogo}>
          <img src={`${process.env.PUBLIC_URL}/logo-app-small.jpeg`} alt="Friendlinq logo — simple safe social network" width="36" height="36" style={styles.logoIcon} />
          <span style={styles.logoName}>Friendlinq</span>
        </div>
        {/* Desktop login fields */}
        <div style={styles.topnavLogin} className="landing-topnav-login">
          <input type="text" placeholder="Email" style={styles.navInput} value={navEmail} onChange={(e) => { setNavEmail(e.target.value); setNavError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleNavLogin()} />
          <input type="password" placeholder="Password" style={styles.navInput} value={navPassword} onChange={(e) => { setNavPassword(e.target.value); setNavError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleNavLogin()} />
          <button style={styles.btnLogin} onClick={handleNavLogin} disabled={navLoading}>{navLoading ? '...' : 'Log in'}</button>
          <Link to="/forgot-password" style={styles.forgot}>Forgot password?</Link>
          {navError && <span style={{ color: '#ff6b6b', fontSize: 11, whiteSpace: 'nowrap', marginLeft: 4 }}>{navError}</span>}
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
          <h1 style={styles.h1}>The calm social network for the people you actually know.</h1>
          <p style={styles.subtitle}>Friendlinq is the quiet, private place to share life with the people who matter — your family, your real friends, your community. No ads. No tracking. No algorithm deciding what you see. Just the people you'd invite to your kitchen table. Get your family on Friendlinq today.</p>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconUsers /></div>
            <div>
              <div style={styles.featureTitle}>Connect with friends and family</div>
              <div style={styles.featureDesc}>Share updates, photos, and messages with the people who matter most.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconSmile /></div>
            <div>
              <div style={styles.featureTitle}>Just your people</div>
              <div style={styles.featureDesc}>Your feed shows your friends and family in chronological order. No algorithm. No strangers. No suggestions.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconVideo /></div>
            <div>
              <div style={styles.featureTitle}>Calm by design</div>
              <div style={styles.featureDesc}>No ads. No tracking. No outrage bait. No infinite scroll. We help you stay connected and get on with your day.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconShield /></div>
            <div>
              <div style={styles.featureTitle}>Built for real life</div>
              <div style={styles.featureDesc}>Photos, messages, video calls, family groups. Everything you actually want to do with the people you actually know.</div>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}><IconMonitor /></div>
            <div>
              <div style={styles.featureTitle}>Switch your family in 5 minutes</div>
              <div style={styles.featureDesc}>Most accounts get created by one person who invites their family. Mom, dad, siblings, kids, grandparents. Your whole family in one calm place.</div>
            </div>
          </div>
        </div>

        <div style={styles.heroRight} className="landing-hero-right">
          <div style={styles.signupCard}>
            <h2 style={styles.signupH2}>Join Friendlinq</h2>
            <p style={styles.signupSub}>Free, calm, and always will be.</p>
            <input type="text" placeholder="First name" style={styles.signupInput} value={firstName} onChange={(e) => { setFirstName(e.target.value); setSignupError(''); }} />
            <input type="text" placeholder="Last name" style={styles.signupInput} value={lastName} onChange={(e) => { setLastName(e.target.value); setSignupError(''); }} />
            <input type="text" placeholder="Email address" style={styles.signupInput} value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); setSignupError(''); }} />
            <input type="password" placeholder="Create a password" style={styles.signupInput} value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value); setSignupError(''); }} />
            <input type="password" placeholder="Confirm password" style={styles.signupInput} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setSignupError(''); }} />
            {signupError && <p style={{ color: 'red', fontSize: 13, textAlign: 'center', margin: '8px 0 0' }}>{signupError}</p>}
            <hr style={styles.divider} />
            <button style={styles.btnSignup} onClick={handleSignup} disabled={signupLoading}>{signupLoading ? 'Creating account...' : 'Sign up'}</button>
            <p style={{ fontSize: 14, textAlign: 'center', marginBottom: 12, color: '#606770' }}>
              Already have an account? <Link to="/login" style={{ color: '#1a6b3a', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
            </p>
            <p style={styles.legal}>
              By signing up you agree to our <a href="/terms" style={{ color: '#1a6b3a', textDecoration: 'none' }}>Terms</a> and <a href="/privacy" style={{ color: '#1a6b3a', textDecoration: 'none' }}>Privacy Policy</a>.
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
            <div style={styles.statValue}>Real connection</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Cost to join</div>
            <div style={styles.statValue}>Always free</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Your data</div>
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
        <p style={styles.sectionSub}>The features you actually use, without the things you don't.</p>
        <div style={styles.featuresGrid} className="landing-features-grid">
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconChatLg /></div>
            <h3 style={styles.fcardTitle}>Messaging</h3>
            <p style={styles.fcardDesc}>Private conversations with friends and family. Text, photos, and voice.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconImageLg /></div>
            <h3 style={styles.fcardTitle}>Photo sharing</h3>
            <p style={styles.fcardDesc}>Upload photos and create albums. Share memories with the people who matter.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconUsersLg /></div>
            <h3 style={styles.fcardTitle}>Groups</h3>
            <p style={styles.fcardDesc}>Join private groups around your interests or your family. No strangers, no noise.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconVideoLg /></div>
            <h3 style={styles.fcardTitle}>Video calls</h3>
            <p style={styles.fcardDesc}>One-on-one or group calls. See faces, not just text. Works everywhere.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconClockLg /></div>
            <h3 style={styles.fcardTitle}>Events</h3>
            <p style={styles.fcardDesc}>Plan family events, gatherings, and local activities with the people you know.</p>
          </div>
          <div style={styles.fcard}>
            <div style={styles.fcardIcon}><IconProfileLg /></div>
            <h3 style={styles.fcardTitle}>Your profile</h3>
            <p style={styles.fcardDesc}>Share who you are with friends and family. Not with the world.</p>
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
        <h2 style={styles.ctaH2}>Bring your family together.</h2>
        <p style={styles.ctaP}>Friendlinq is free, takes a minute to set up, and works on iPhone, Android, and the web. Sign up, invite your people, and remember what social media was supposed to feel like.</p>
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
            <a href="/safety" style={styles.footerLink}>Safety</a>
            <a href="/faq" style={styles.footerLink}>FAQ</a>
            <a href="/support" style={styles.footerLink}>Support</a>
            <a href="/contact" style={styles.footerLink}>Contact</a>
            <a href="/privacy" style={styles.footerLink}>Privacy policy</a>
            <a href="/terms" style={styles.footerLink}>Terms of service</a>
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
