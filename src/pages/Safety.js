import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

export default function Safety() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Safety and Privacy | Friendlinq — Your Security Comes First</title>
        <meta name="description" content="Learn how Friendlinq protects your safety and privacy. No ads, no data selling, community moderation, scam protection, and privacy controls explained in plain language." />
        <link rel="canonical" href="https://friendlinq.com/safety" />
        <meta property="og:title" content="Safety and Privacy | Friendlinq — Your Security Comes First" />
        <meta property="og:description" content="Learn how Friendlinq protects your safety and privacy. No ads, no data selling, community moderation, and scam protection." />
        <meta property="og:url" content="https://friendlinq.com/safety" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Safety and Privacy | Friendlinq — Your Security Comes First" />
        <meta name="twitter:description" content="Learn how Friendlinq protects your safety and privacy. No ads, no data selling, community moderation, and scam protection." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Your safety and privacy on Friendlinq</h1>
        <p style={styles.intro}>
          Your safety is our top priority. Friendlinq is built from the ground up to protect your privacy, keep you safe from scams and spam, and give you full control over your experience.
        </p>

        <section style={styles.section}>
          <h2 style={styles.h2}>How we protect you from scams and spam</h2>
          <p style={styles.p}>
            Friendlinq actively monitors for suspicious activity, fake accounts, and spam. Our systems are designed to detect and block common scam patterns before they reach you. If something does slip through, you can report it instantly and our team will take action.
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>Automated detection of spam accounts and suspicious behavior</li>
            <li style={styles.li}>One-tap reporting of any user or content that seems wrong</li>
            <li style={styles.li}>Quick response from our moderation team on reported issues</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Your privacy controls</h2>
          <p style={styles.p}>
            You decide who sees your content. Friendlinq gives you clear, easy-to-understand privacy controls so you always know who can see what. No confusing settings buried in sub-menus — everything is straightforward.
          </p>
          <div style={styles.cardGrid} className="safety-card-grid">
            <div style={styles.card}>
              <h3 style={styles.h3}>Post privacy</h3>
              <p style={styles.cardText}>Choose whether each post is visible to the community or only to your friends. You make the choice every time you post.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.h3}>Private portfolio</h3>
              <p style={styles.cardText}>Keep a private photo album that's only visible to friends you choose. Your private photos stay private.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.h3}>Friend requests</h3>
              <p style={styles.cardText}>You approve every connection. Nobody can see your friends-only content without your explicit permission.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.h3}>Block and report</h3>
              <p style={styles.cardText}>Block any user instantly from their profile. Report inappropriate behavior and our team reviews it promptly.</p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Community moderation</h2>
          <p style={styles.p}>
            Friendlinq is a community, and we take community standards seriously. We review reported content and behavior, and we take action against users who violate our guidelines. Our goal is to keep Friendlinq a welcoming, respectful space for everyone.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>How we handle your data</h2>
          <div style={styles.dataGrid} className="safety-data-grid">
            <div style={styles.dataItem}>
              <div style={styles.dataIcon}>&#10003;</div>
              <div>
                <strong style={styles.dataTitle}>What we collect</strong>
                <p style={styles.dataDesc}>Only the information needed to provide the service: your name, email, profile details you choose to share, and your content (posts, messages, photos).</p>
              </div>
            </div>
            <div style={styles.dataItem}>
              <div style={styles.dataIcon}>&#10003;</div>
              <div>
                <strong style={styles.dataTitle}>How we use it</strong>
                <p style={styles.dataDesc}>To power your Friendlinq experience — showing your posts to your friends, delivering your messages, connecting you with groups. That's it.</p>
              </div>
            </div>
            <div style={styles.dataItem}>
              <div style={{ ...styles.dataIcon, color: '#d32f2f' }}>&#10007;</div>
              <div>
                <strong style={styles.dataTitle}>What we do NOT do</strong>
                <p style={styles.dataDesc}>We do not sell your data to advertisers, data brokers, or any third party. We do not show you ads. We do not use algorithms to manipulate your feed or behavior.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>How to report problems or block users</h2>
          <p style={styles.p}>
            If you encounter someone or something that makes you uncomfortable, you can take action immediately:
          </p>
          <ol style={styles.list}>
            <li style={styles.li}><strong>Block a user:</strong> Go to their profile and tap the block option. They won't be able to contact you or see your content.</li>
            <li style={styles.li}><strong>Report content:</strong> Tap the report button on any post, message, or profile that violates community guidelines.</li>
            <li style={styles.li}><strong>Contact support:</strong> Email us at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a> if you need help with any safety concern.</li>
          </ol>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Tips for staying safe online</h2>
          <ul style={styles.list}>
            <li style={styles.li}>Use a strong, unique password for your Friendlinq account</li>
            <li style={styles.li}>Never share your password with anyone, including people who claim to be from Friendlinq</li>
            <li style={styles.li}>Be cautious about sharing personal information like your address or financial details</li>
            <li style={styles.li}>If someone you don't know sends you a suspicious message or link, don't click it — report it</li>
            <li style={styles.li}>Keep your email address up to date so you can recover your account if needed</li>
            <li style={styles.li}>If something feels wrong, trust your instinct and report it</li>
          </ul>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>Questions about safety or privacy?</h2>
          <p style={styles.ctaP}>We're here to help. Email us at <a href="mailto:info@friendlinq.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>info@friendlinq.com</a> or visit our <a href="/faq" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>FAQ page</a>.</p>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .safety-card-grid {
            grid-template-columns: 1fr !important;
          }
          .safety-data-grid {
            gap: 16px !important;
          }
        }
      `}</style>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 12, textAlign: 'center' },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, textAlign: 'center', marginBottom: 40, maxWidth: 640, margin: '0 auto 40px' },
  section: { marginBottom: 40 },
  h2: { fontSize: 22, fontWeight: 700, color: '#1c1e21', marginBottom: 12 },
  h3: { fontSize: 17, fontWeight: 600, color: '#1c1e21', marginBottom: 6 },
  p: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 16 },
  list: { paddingLeft: 24, marginBottom: 16 },
  li: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 8 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },

  cardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 },
  card: { background: '#fff', borderRadius: 10, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  cardText: { fontSize: 14, color: '#606770', lineHeight: 1.6, margin: 0 },

  dataGrid: { display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 },
  dataItem: { display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', borderRadius: 10, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  dataIcon: { fontSize: 22, fontWeight: 700, color: '#1a6b3a', minWidth: 32, textAlign: 'center', marginTop: 2 },
  dataTitle: { fontSize: 16, color: '#1c1e21', display: 'block', marginBottom: 4 },
  dataDesc: { fontSize: 14, color: '#606770', lineHeight: 1.6, margin: 0 },

  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 0 },
};
