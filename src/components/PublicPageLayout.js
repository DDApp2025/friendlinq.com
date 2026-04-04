import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const APP_STORE_URL = 'https://apps.apple.com/us/app/friendlinq/id6476931666';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.app.friendlinq';

export default function PublicPageLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#f0f2f5', color: '#1c1e21', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Nav ── */}
      <nav style={styles.topnav} aria-label="Primary navigation">
        <Link to="/" style={styles.topnavLogo}>
          <img src={`${process.env.PUBLIC_URL}/logo-app.jpeg`} alt="Friendlinq logo — simple safe social network" style={styles.logoIcon} />
          <span style={styles.logoName}>Friendlinq</span>
        </Link>
        <div style={styles.topnavRight} className="pub-topnav-right">
          <Link to="/login" style={styles.navLink}>Log in</Link>
          <button style={styles.btnSignupNav} onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer} role="contentinfo">
        <div style={styles.footerInner} className="pub-footer-inner">
          <div style={styles.footerLogo}>
            <img src={`${process.env.PUBLIC_URL}/logo-app.jpeg`} alt="Friendlinq logo — simple safe social network" style={styles.footerLogoIcon} />
            <span style={styles.footerLogoName}>Friendlinq</span>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/about" style={styles.footerLink}>About</Link>
            <Link to="/features" style={styles.footerLink}>Features</Link>
            <Link to="/safety" style={styles.footerLink}>Safety</Link>
            <Link to="/faq" style={styles.footerLink}>FAQ</Link>
            <Link to="/support" style={styles.footerLink}>Support</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
            <Link to="/privacy" style={styles.footerLink}>Privacy policy</Link>
            <Link to="/terms" style={styles.footerLink}>Terms of service</Link>
          </div>
          <div style={styles.footerBottom}>
            <div style={styles.footerBadges}>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download Friendlinq on the App Store" style={{ height: 32 }} /></a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get Friendlinq on Google Play" style={{ height: 48 }} /></a>
            </div>
            <span style={styles.footerCopy}>&copy; 2026 Spire Group Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .pub-footer-inner {
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
  topnav: { background: '#1a6b3a', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  topnavLogo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: { width: 36, height: 36, borderRadius: 8, objectFit: 'cover' },
  logoName: { color: '#fff', fontSize: 22, fontWeight: 600, letterSpacing: -0.5 },
  topnavRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navLink: { color: 'rgba(255,255,255,0.85)', fontSize: 14, textDecoration: 'none', fontWeight: 500 },
  btnSignupNav: { background: '#4a9e6e', color: '#fff', padding: '7px 18px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none' },

  footer: { background: '#1c1e21', padding: '28px 32px' },
  footerInner: { maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 8 },
  footerLogoIcon: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover' },
  footerLogoName: { color: '#fff', fontSize: 15, fontWeight: 600 },
  footerLinks: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  footerLink: { color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' },
  footerBottom: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  footerBadges: { display: 'flex', alignItems: 'center', gap: 12 },
  footerCopy: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
};
