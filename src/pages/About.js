import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

export default function About() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>About Friendlinq | Simple, Safe Social Media for Real Connection</title>
        <meta name="description" content="Friendlinq is a social network built for adults who value simplicity, safety, and real connection. No ads, no data selling, no algorithms. Learn our mission." />
        <link rel="canonical" href="https://friendlinq.com/about" />
        <meta property="og:title" content="About Friendlinq | Simple, Safe Social Media for Real Connection" />
        <meta property="og:description" content="Friendlinq is a social network built for adults who value simplicity, safety, and real connection. No ads, no data selling, no algorithms. Learn our mission." />
        <meta property="og:url" content="https://friendlinq.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Friendlinq | Simple, Safe Social Media for Real Connection" />
        <meta name="twitter:description" content="Friendlinq is a social network built for adults who value simplicity, safety, and real connection. No ads, no data selling, no algorithms." />
      </Helmet>

      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.h1}>About Friendlinq</h1>
          <p style={styles.intro}>
            Friendlinq is a free social network for adults who want a simpler, safer way to stay connected. Available on web, iOS, and Android, Friendlinq offers messaging, community groups, video and audio calls, live streaming, photo and video sharing, and a community marketplace — all with no ads, no data selling, and no algorithm manipulation. It is developed and operated by Spire Group Inc.
          </p>

          <section style={styles.section}>
            <h2 style={styles.h2}>Our mission</h2>
            <p style={styles.p}>
              Friendlinq exists because social media should bring people closer together — not drive them apart. We believe in a social network that respects your time, protects your privacy, and makes it genuinely easy to stay connected with the people who matter most.
            </p>
            <p style={styles.p}>
              Too many platforms have become overwhelming, cluttered with ads, manipulated by algorithms, and designed to keep you scrolling instead of connecting. Friendlinq is different. We built it from the ground up for adults who want a simpler, safer way to be social online.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>How Friendlinq works</h2>
            <p style={styles.p}>
              Friendlinq is a full-featured social network available on the web, iOS, and Android. Once you sign up (it takes less than a minute and it's completely free), you can:
            </p>
            <ul style={styles.list}>
              <li style={styles.li}>Share updates, photos, and videos with friends and family</li>
              <li style={styles.li}>Send private messages with text, photos, and media</li>
              <li style={styles.li}>Join interest-based community groups — gardening, travel, book clubs, cooking, and more</li>
              <li style={styles.li}>Make video and audio calls to friends or entire groups</li>
              <li style={styles.li}>Host or join live streams</li>
              <li style={styles.li}>Browse the community marketplace</li>
              <li style={styles.li}>Discover events and local activities</li>
            </ul>
            <p style={styles.p}>
              Everything is designed with clarity in mind: large text, intuitive navigation, and straightforward controls. There's even a step-by-step tutorial that walks you through every feature.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>What makes Friendlinq different</h2>
            <div style={styles.diffGrid} className="about-diff-grid">
              <div style={styles.diffCard}>
                <h3 style={styles.h3}>No advertisements</h3>
                <p style={styles.cardText}>You'll never see ads on Friendlinq. Your feed shows content from people you know and groups you've joined — nothing else.</p>
              </div>
              <div style={styles.diffCard}>
                <h3 style={styles.h3}>No data selling</h3>
                <p style={styles.cardText}>Your personal information is yours. We don't sell your data to advertisers, data brokers, or anyone else. Period.</p>
              </div>
              <div style={styles.diffCard}>
                <h3 style={styles.h3}>No algorithm manipulation</h3>
                <p style={styles.cardText}>We don't use algorithms to manipulate what you see or keep you scrolling. Your feed is chronological — simple and honest.</p>
              </div>
              <div style={styles.diffCard}>
                <h3 style={styles.h3}>Built for simplicity</h3>
                <p style={styles.cardText}>Friendlinq isn't a general platform retrofitted for ease of use. It was purpose-built from day one for people who value simplicity and comfort.</p>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Who we are</h2>
            <p style={styles.p}>
              Friendlinq is developed and operated by Spire Group Inc. We're a small, dedicated team passionate about creating technology that genuinely helps people stay connected. Our focus is on building a platform that puts people first — not engagement metrics, not ad revenue, not data harvesting.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Get in touch</h2>
            <p style={styles.p}>
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
            <p style={styles.p}>
              Email us at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a> or visit our <Link to="/contact" style={styles.link}>contact page</Link>.
            </p>
          </section>

          <section style={styles.ctaSection}>
            <h2 style={styles.ctaH2}>Ready to join?</h2>
            <p style={styles.ctaP}>Sign up for free and start connecting with the people who matter most.</p>
            <Link to="/register" style={styles.ctaBtn}>Sign up for free</Link>
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-diff-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '40px 24px' },
  content: {},
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 16, textAlign: 'center' },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 36, textAlign: 'center', maxWidth: 700, margin: '0 auto 36px' },
  h2: { fontSize: 22, fontWeight: 700, color: '#1c1e21', marginBottom: 12 },
  h3: { fontSize: 17, fontWeight: 600, color: '#1c1e21', marginBottom: 6 },
  p: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 16 },
  section: { marginBottom: 40 },
  list: { paddingLeft: 24, marginBottom: 16 },
  li: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 8 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },
  diffGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 },
  diffCard: { background: '#fff', borderRadius: 10, padding: '20px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  cardText: { fontSize: 14, color: '#606770', lineHeight: 1.6, margin: 0 },
  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  ctaBtn: { display: 'inline-block', background: '#fff', color: '#1a6b3a', padding: '14px 40px', borderRadius: 6, fontSize: 17, fontWeight: 700, textDecoration: 'none' },
};
