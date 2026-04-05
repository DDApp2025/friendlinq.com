import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

const quickFaq = [
  {
    q: 'How do I sign up for Friendlinq?',
    a: 'Visit the sign-up page, enter your name, email, and a password. It takes less than a minute and it\'s completely free.',
  },
  {
    q: 'Is Friendlinq free?',
    a: 'Yes, completely free. No subscription fees, no hidden charges, no premium tiers required for core features.',
  },
  {
    q: 'How do I add friends?',
    a: 'Go to the Add Friend page from the navigation bar, search for users by name, and send a friend request. They\'ll get a notification and can accept.',
  },
  {
    q: 'How do I make a video call?',
    a: 'Open the Call page from the navigation. You can call individual friends or start a group call. Calls work on phone, tablet, and computer.',
  },
  {
    q: 'How do I report a problem or block someone?',
    a: 'Visit the user\'s profile and use the block or report option. For other issues, email us at info@friendlinq.com and we\'ll respond promptly.',
  },
];

const APP_STORE_URL = 'https://apps.apple.com/us/app/friendlinq/id6476931666';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.app.friendlinq';

export default function PublicSupport() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Support | Friendlinq — Help and Contact</title>
        <meta name="description" content="Get help with Friendlinq. Quick answers to common questions, contact information, and links to download the Friendlinq app on iOS and Android." />
        <link rel="canonical" href="https://friendlinq.com/support" />
        <meta property="og:title" content="Support | Friendlinq — Help and Contact" />
        <meta property="og:description" content="Get help with Friendlinq. Quick answers to common questions, contact information, and app download links." />
        <meta property="og:url" content="https://friendlinq.com/support" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Support | Friendlinq — Help and Contact" />
        <meta name="twitter:description" content="Get help with Friendlinq. Quick answers to common questions, contact information, and app download links." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Friendlinq Support</h1>
        <p style={styles.intro}>We're here to help. Find quick answers below, or get in touch with our team.</p>

        {/* Quick FAQ */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Quick answers</h2>
          {quickFaq.map((item, i) => (
            <div key={i} style={styles.faqItem}>
              <h3 style={styles.faqQ}>{item.q}</h3>
              <p style={styles.faqA}>{item.a}</p>
            </div>
          ))}
          <p style={styles.p}>
            Looking for more? Visit our <Link to="/faq" style={styles.link}>full FAQ page</Link> with answers organized by topic.
          </p>
        </section>

        {/* Contact */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Contact us</h2>
          <p style={styles.p}>
            Have a question, suggestion, or need help with your account? We'd love to hear from you.
          </p>
          <div style={styles.contactCard}>
            <div style={styles.contactRow}>
              <strong>Email:</strong>
              <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>
            </div>
            <p style={styles.contactNote}>We typically respond within 24 hours.</p>
          </div>
          <p style={styles.p}>
            You can also visit our <Link to="/contact" style={styles.link}>contact page</Link> for more ways to reach us.
          </p>
        </section>

        {/* App Downloads */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Download the app</h2>
          <p style={styles.p}>
            Friendlinq is available on iOS and Android. Download the app for the best mobile experience.
          </p>
          <div style={styles.badgeRow}>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={styles.badgeLink}>
              <div style={styles.badgeWrap}>
                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download Friendlinq on the App Store" style={{ width: '100%', height: 'auto' }} />
              </div>
            </a>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" style={styles.badgeLink}>
              <div style={styles.badgeWrap}>
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get Friendlinq on Google Play" style={{ width: '130%', height: 'auto' }} />
              </div>
            </a>
          </div>
        </section>

        {/* Helpful Links */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Helpful links</h2>
          <div style={styles.linkGrid}>
            <Link to="/faq" style={styles.helpLink}>Full FAQ</Link>
            <Link to="/safety" style={styles.helpLink}>Safety and Privacy</Link>
            <Link to="/features" style={styles.helpLink}>Features</Link>
            <a href="/about" style={styles.helpLink}>About Friendlinq</a>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 720, margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 12, textAlign: 'center' },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, textAlign: 'center', marginBottom: 40 },
  section: { marginBottom: 40 },
  h2: { fontSize: 22, fontWeight: 700, color: '#1c1e21', marginBottom: 16 },
  p: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 16 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },

  faqItem: { marginBottom: 12, padding: '14px 16px', backgroundColor: '#fff', borderRadius: 8, borderLeft: '3px solid #1a6b3a', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  faqQ: { fontSize: 15, fontWeight: 600, color: '#1c1e21', margin: '0 0 4px' },
  faqA: { fontSize: 14, color: '#606770', margin: 0, lineHeight: 1.5 },

  contactCard: { background: '#fff', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb', marginBottom: 16 },
  contactRow: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 16, color: '#1c1e21', marginBottom: 8 },
  contactNote: { fontSize: 14, color: '#606770', margin: 0 },

  badgeRow: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' },
  badgeWrap: { width: 150, height: 50, overflow: 'hidden', borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badgeLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },

  linkGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  helpLink: { display: 'inline-block', background: '#e8f5ee', color: '#1a6b3a', padding: '10px 20px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' },
};
