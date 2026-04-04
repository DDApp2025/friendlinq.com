import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

export default function Contact() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Contact Friendlinq | Get in Touch</title>
        <meta name="description" content="Contact the Friendlinq team. Email us at info@friendlinq.com for questions, feedback, support, or partnership inquiries. We'd love to hear from you." />
        <link rel="canonical" href="https://friendlinq.com/contact" />
        <meta property="og:title" content="Contact Friendlinq | Get in Touch" />
        <meta property="og:description" content="Contact the Friendlinq team. Email us at info@friendlinq.com for questions, feedback, support, or partnership inquiries." />
        <meta property="og:url" content="https://friendlinq.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Friendlinq | Get in Touch" />
        <meta name="twitter:description" content="Contact the Friendlinq team. Email us at info@friendlinq.com for questions, feedback, support, or partnership inquiries." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Contact Friendlinq</h1>
        <p style={styles.intro}>Have a question, feedback, or just want to say hello? We'd love to hear from you.</p>

        <div style={styles.cardGrid} className="contact-card-grid">
          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <svg viewBox="0 0 24 24" style={styles.svg}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h2 style={styles.cardTitle}>Email us</h2>
            <p style={styles.cardDesc}>For questions, feedback, account help, or partnership inquiries.</p>
            <a href="mailto:info@friendlinq.com" style={styles.cardLink}>info@friendlinq.com</a>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <svg viewBox="0 0 24 24" style={styles.svg}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 style={styles.cardTitle}>FAQ</h2>
            <p style={styles.cardDesc}>Find quick answers to the most common questions about Friendlinq.</p>
            <Link to="/faq" style={styles.cardLink}>Visit the FAQ</Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <svg viewBox="0 0 24 24" style={styles.svg}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 style={styles.cardTitle}>Support</h2>
            <p style={styles.cardDesc}>Need help using Friendlinq? Our support page has guides and answers.</p>
            <Link to="/support" style={styles.cardLink}>Visit Support</Link>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.h2}>What to expect</h2>
          <p style={styles.p}>
            When you email us, a real person reads your message. We typically respond within 24 hours. If you're reporting a safety concern, we prioritize those and aim to respond as quickly as possible.
          </p>
          <p style={styles.p}>
            For account-related requests (password resets, account recovery), please include the email address associated with your Friendlinq account so we can help you faster.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Mailing address</h2>
          <p style={styles.p}>
            Spire Group Inc.<br />
            Email: <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>
          </p>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>New to Friendlinq?</h2>
          <p style={styles.ctaP}>Join for free and start connecting with the people who matter most.</p>
          <Link to="/register" style={styles.ctaBtn}>Sign up for free</Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 12, textAlign: 'center' },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, textAlign: 'center', marginBottom: 40 },
  section: { marginBottom: 40 },
  h2: { fontSize: 22, fontWeight: 700, color: '#1c1e21', marginBottom: 12 },
  p: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 16 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },

  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 },
  card: { background: '#fff', borderRadius: 10, padding: '28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb', textAlign: 'center' },
  cardIcon: { width: 56, height: 56, background: '#e8f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  svg: { width: 26, height: 26, stroke: '#1a6b3a', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
  cardTitle: { fontSize: 18, fontWeight: 600, color: '#1c1e21', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#606770', lineHeight: 1.6, marginBottom: 12 },
  cardLink: { color: '#1a6b3a', fontWeight: 600, textDecoration: 'none', fontSize: 15 },

  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  ctaBtn: { display: 'inline-block', background: '#fff', color: '#1a6b3a', padding: '14px 40px', borderRadius: 6, fontSize: 17, fontWeight: 700, textDecoration: 'none' },
};
