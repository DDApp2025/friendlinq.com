import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

export default function Privacy() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Privacy Policy | Friendlinq — How We Protect Your Data</title>
        <meta name="description" content="Friendlinq privacy policy: what data we collect, how we use it, and what we never do. No ads, no data selling, no third-party tracking. Your privacy is our priority." />
        <link rel="canonical" href="https://friendlinq.com/privacy" />
        <meta property="og:title" content="Privacy Policy | Friendlinq — How We Protect Your Data" />
        <meta property="og:description" content="Friendlinq privacy policy: what data we collect, how we use it, and what we never do. No ads, no data selling, no third-party tracking." />
        <meta property="og:url" content="https://friendlinq.com/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Friendlinq — How We Protect Your Data" />
        <meta name="twitter:description" content="Friendlinq privacy policy: what data we collect, how we use it, and what we never do. No ads, no data selling, no third-party tracking." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Privacy Policy</h1>
        <p style={styles.effective}>Effective date: April 3, 2026</p>
        <p style={styles.intro}>
          Friendlinq is committed to protecting your privacy. This policy explains in plain language what information we collect, how we use it, and — just as importantly — what we will never do with it. We believe you should understand exactly how your data is handled without needing a law degree to read the policy.
        </p>

        <section style={styles.section}>
          <h2 style={styles.h2}>What information we collect</h2>
          <p style={styles.p}>When you use Friendlinq, we collect only the information needed to provide and improve the service:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>Account information:</strong> Your name, email address, and password when you create an account</li>
            <li style={styles.li}><strong>Profile information:</strong> Any details you choose to add to your profile, such as a bio, location, profile photo, or banner image</li>
            <li style={styles.li}><strong>Photos and media:</strong> Images and videos you upload to your portfolio, posts, or messages</li>
            <li style={styles.li}><strong>Messages:</strong> The content of messages you send and receive through Friendlinq's messaging feature</li>
            <li style={styles.li}><strong>Posts and comments:</strong> Content you share on your feed, in groups, or as comments on other posts</li>
            <li style={styles.li}><strong>Usage information:</strong> Basic data about how you use the app, such as when you log in, to help us maintain and improve the service</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>How we use your information</h2>
          <p style={styles.p}>We use your information for the following purposes — and only these purposes:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>To provide the service:</strong> Displaying your profile, delivering your messages, showing your posts to friends, and connecting you with community groups</li>
            <li style={styles.li}><strong>To enable communication:</strong> Powering messaging, video calls, audio calls, and live streaming between you and other users</li>
            <li style={styles.li}><strong>To protect safety:</strong> Detecting spam, scams, and abusive behavior to keep the community safe</li>
            <li style={styles.li}><strong>To improve Friendlinq:</strong> Understanding general usage patterns (not individual tracking) to make the platform better for everyone</li>
            <li style={styles.li}><strong>To process payments:</strong> If you subscribe to optional premium features, we use Stripe to handle payment processing securely (see Third-Party Services below)</li>
            <li style={styles.li}><strong>To communicate with you:</strong> Sending important account notifications, security alerts, or responding to your support requests</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>What we will NEVER do with your data</h2>
          <p style={styles.p}>This is the part that matters most. Here is what Friendlinq will never do:</p>
          <div style={styles.neverGrid}>
            <div style={styles.neverItem}>
              <div style={styles.neverIcon}>&#10007;</div>
              <div>
                <strong style={styles.neverTitle}>We will never sell your data</strong>
                <p style={styles.neverDesc}>Your personal information, photos, messages, and activity are never sold to advertisers, data brokers, or any third party. Period.</p>
              </div>
            </div>
            <div style={styles.neverItem}>
              <div style={styles.neverIcon}>&#10007;</div>
              <div>
                <strong style={styles.neverTitle}>We will never show you targeted ads</strong>
                <p style={styles.neverDesc}>Friendlinq does not display advertisements. We do not track your behavior to build advertising profiles.</p>
              </div>
            </div>
            <div style={styles.neverItem}>
              <div style={styles.neverIcon}>&#10007;</div>
              <div>
                <strong style={styles.neverTitle}>We will never share your data with third parties for their marketing</strong>
                <p style={styles.neverDesc}>Your information stays with Friendlinq. We do not give, sell, rent, or trade your data to outside companies for any marketing or promotional purpose.</p>
              </div>
            </div>
            <div style={styles.neverItem}>
              <div style={styles.neverIcon}>&#10007;</div>
              <div>
                <strong style={styles.neverTitle}>We will never use algorithms to manipulate your experience</strong>
                <p style={styles.neverDesc}>Your feed shows content from people you've chosen to connect with, in chronological order. No algorithmic manipulation, no engagement tricks.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Cookies</h2>
          <p style={styles.p}>
            Friendlinq uses essential cookies to keep you logged in and to remember your preferences (such as your display settings). These are necessary for the platform to function properly. We do not use tracking cookies, advertising cookies, or any third-party cookies designed to follow your activity across the internet.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Data retention</h2>
          <p style={styles.p}>
            We keep your data for as long as you have an active Friendlinq account. If you delete your account, we will remove your personal information, profile data, photos, and posts from our systems. Some data may be retained briefly in backup systems before being permanently deleted, and we may retain limited information if required by law.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Your rights</h2>
          <p style={styles.p}>You have control over your data. Here is what you can do at any time:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>Delete your account:</strong> You can delete your account from the Settings page. This removes your profile, posts, photos, and personal data from Friendlinq.</li>
            <li style={styles.li}><strong>Edit your information:</strong> You can update or remove any profile information, photos, or posts at any time through the app.</li>
            <li style={styles.li}><strong>Request your data:</strong> You can contact us at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a> to request a copy of the data we hold about you.</li>
            <li style={styles.li}><strong>Ask questions:</strong> If you have any questions about your data or this policy, email us and we will respond promptly.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Children's policy</h2>
          <p style={styles.p}>
            Friendlinq is designed for adults. We do not knowingly collect information from anyone under the age of 18. If we learn that a user is under 18, we will promptly delete their account and all associated data. If you believe a minor has created an account, please contact us at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Third-party services</h2>
          <p style={styles.p}>Friendlinq uses a small number of trusted third-party services to provide specific features. These services only receive the minimum data necessary to perform their function:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>Stripe</strong> — Handles payment processing for optional premium subscription features. Stripe receives your payment information (card details) directly and securely. Friendlinq does not store your credit card numbers.</li>
            <li style={styles.li}><strong>Agora</strong> — Powers video calls, audio calls, and live streaming. Agora processes the audio and video data during your calls but does not store recordings of your conversations.</li>
          </ul>
          <p style={styles.p}>These services have their own privacy policies. We have chosen them because they meet high standards for data protection and security.</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Changes to this policy</h2>
          <p style={styles.p}>
            If we make changes to this privacy policy, we will update this page and change the effective date at the top. For significant changes, we will notify you through the app or by email. We encourage you to review this page periodically.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Contact us</h2>
          <p style={styles.p}>
            If you have any questions about this privacy policy or how Friendlinq handles your data, please contact us:
          </p>
          <p style={styles.p}>
            Email: <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>
          </p>
          <p style={styles.p}>
            Friendlinq is operated by Spire Group Inc.
          </p>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>Have questions about your privacy?</h2>
          <p style={styles.ctaP}>
            We're happy to answer. Email us at <a href="mailto:info@friendlinq.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>info@friendlinq.com</a> or visit our <a href="/safety" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Safety page</a> to learn more about how we protect you.
          </p>
        </section>

        <p style={styles.copyright}>&copy; 2026 Spire Group Inc. All rights reserved.</p>
      </div>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 8, textAlign: 'center' },
  effective: { fontSize: 14, color: '#65676b', textAlign: 'center', marginBottom: 24 },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, textAlign: 'center', marginBottom: 40, maxWidth: 640, margin: '0 auto 40px' },
  section: { marginBottom: 40 },
  h2: { fontSize: 22, fontWeight: 700, color: '#1c1e21', marginBottom: 12 },
  p: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 16 },
  list: { paddingLeft: 24, marginBottom: 16 },
  li: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, marginBottom: 8 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },
  neverGrid: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 },
  neverItem: { display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', borderRadius: 10, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  neverIcon: { fontSize: 22, fontWeight: 700, color: '#d32f2f', minWidth: 32, textAlign: 'center', marginTop: 2 },
  neverTitle: { fontSize: 16, color: '#1c1e21', display: 'block', marginBottom: 4 },
  neverDesc: { fontSize: 14, color: '#606770', lineHeight: 1.6, margin: 0 },
  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 0 },
  copyright: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 32 },
};
