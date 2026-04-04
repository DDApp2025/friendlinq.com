import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

export default function Terms() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Terms of Service | Friendlinq — Rules for Using Our Platform</title>
        <meta name="description" content="Friendlinq terms of service: account rules, acceptable use, content ownership, and your rights. Written in plain language so you know exactly what to expect." />
        <link rel="canonical" href="https://friendlinq.com/terms" />
        <meta property="og:title" content="Terms of Service | Friendlinq — Rules for Using Our Platform" />
        <meta property="og:description" content="Friendlinq terms of service: account rules, acceptable use, content ownership, and your rights. Written in plain language." />
        <meta property="og:url" content="https://friendlinq.com/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service | Friendlinq — Rules for Using Our Platform" />
        <meta name="twitter:description" content="Friendlinq terms of service: account rules, acceptable use, content ownership, and your rights. Written in plain language." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Terms of Service</h1>
        <p style={styles.effective}>Effective date: April 3, 2026</p>
        <p style={styles.intro}>
          Welcome to Friendlinq. These terms explain the rules for using our platform. We've written them in plain language because we believe you shouldn't need a lawyer to understand your agreement with us. By creating an account or using Friendlinq, you agree to these terms.
        </p>

        <section style={styles.section}>
          <h2 style={styles.h2}>1. Acceptance of terms</h2>
          <p style={styles.p}>
            By accessing or using Friendlinq — whether through our website, iOS app, or Android app — you agree to be bound by these Terms of Service and our <Link to="/privacy" style={styles.link}>Privacy Policy</Link>. If you do not agree, please do not use Friendlinq.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>2. Account registration</h2>
          <p style={styles.p}>To use Friendlinq, you must create an account. When you do, you agree to the following:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>You must be an adult.</strong> Friendlinq is designed for adults. You must be at least 18 years old to create an account.</li>
            <li style={styles.li}><strong>Use your real identity.</strong> Your account should represent you as a real person. Fake identities, impersonation, and misleading profiles are not allowed.</li>
            <li style={styles.li}><strong>One account per person.</strong> Each person may only have one Friendlinq account. Creating multiple accounts is not permitted.</li>
            <li style={styles.li}><strong>Keep your credentials secure.</strong> You are responsible for maintaining the security of your account. Do not share your password with anyone. If you believe your account has been compromised, contact us immediately at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>.</li>
            <li style={styles.li}><strong>Accurate information.</strong> The information you provide during registration and in your profile must be accurate and up to date.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>3. Acceptable use</h2>
          <p style={styles.p}>Friendlinq is a community built on respect and real connection. You agree not to use the platform for any of the following:</p>
          <div style={styles.rulesGrid}>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Harassment or bullying</strong>
                <p style={styles.ruleDesc}>Threatening, intimidating, or deliberately hurting other users through words or actions is strictly prohibited.</p>
              </div>
            </div>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Spam</strong>
                <p style={styles.ruleDesc}>Sending unsolicited bulk messages, promotional content, or repetitive posts designed to disrupt other users' experience.</p>
              </div>
            </div>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Illegal content</strong>
                <p style={styles.ruleDesc}>Sharing content that is illegal, promotes illegal activities, or violates any applicable laws.</p>
              </div>
            </div>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Impersonation</strong>
                <p style={styles.ruleDesc}>Pretending to be someone else, creating fake profiles, or misrepresenting your identity in any way.</p>
              </div>
            </div>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Harmful or abusive content</strong>
                <p style={styles.ruleDesc}>Sharing content that is hateful, violent, sexually explicit, or designed to deceive, scam, or defraud other users.</p>
              </div>
            </div>
            <div style={styles.ruleItem}>
              <div style={styles.ruleIcon}>&#10007;</div>
              <div>
                <strong style={styles.ruleTitle}>Platform misuse</strong>
                <p style={styles.ruleDesc}>Attempting to hack, reverse-engineer, or interfere with the operation of Friendlinq, including automated scraping or data collection.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>4. Your content</h2>
          <p style={styles.p}>
            <strong>You own your content.</strong> Any photos, posts, messages, videos, or other content you create and share on Friendlinq belongs to you. We do not claim ownership of your content.
          </p>
          <p style={styles.p}>
            By posting content on Friendlinq, you grant us a limited license to display, distribute, and store that content as needed to operate the platform — for example, showing your posts to your friends, storing your photos in your portfolio, or delivering your messages. This license exists only to make the service work and ends when you delete the content or your account.
          </p>
          <p style={styles.p}>
            You are responsible for the content you share. Do not post content that you do not have the right to share, that infringes on someone else's rights, or that violates these terms.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>5. Platform rights</h2>
          <p style={styles.p}>
            Friendlinq and its design, features, code, branding, and overall platform are owned by Spire Group Inc. You may not copy, modify, distribute, or create derivative works from any part of the Friendlinq platform without written permission.
          </p>
          <p style={styles.p}>
            We reserve the right to modify, update, or discontinue any feature or aspect of the platform at any time to improve the service or address issues.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>6. Account suspension and termination</h2>
          <p style={styles.p}>We want everyone on Friendlinq to have a positive experience. To protect the community, we may take action on accounts that violate these terms:</p>
          <ul style={styles.list}>
            <li style={styles.li}><strong>Warning:</strong> For minor or first-time violations, we may issue a warning.</li>
            <li style={styles.li}><strong>Content removal:</strong> We may remove specific posts, photos, or other content that violates these terms.</li>
            <li style={styles.li}><strong>Temporary suspension:</strong> For repeated or serious violations, we may temporarily suspend your account.</li>
            <li style={styles.li}><strong>Permanent termination:</strong> For severe violations — such as harassment, scams, illegal activity, or repeated abuse — we may permanently terminate your account.</li>
          </ul>
          <p style={styles.p}>
            You can also delete your own account at any time from the Settings page. When your account is deleted, your personal data, profile, posts, and photos are removed from Friendlinq as described in our <Link to="/privacy" style={styles.link}>Privacy Policy</Link>.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>7. Limitation of liability</h2>
          <p style={styles.p}>
            Friendlinq is provided "as is." While we work hard to keep the platform running smoothly and safely, we cannot guarantee uninterrupted service or that the platform will be completely free of errors. We are not liable for any indirect, incidental, or consequential damages arising from your use of Friendlinq.
          </p>
          <p style={styles.p}>
            We are not responsible for content posted by other users. If another user posts something that causes you harm, please report it to us and we will take appropriate action.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>8. Dispute resolution</h2>
          <p style={styles.p}>
            If you have a dispute with Friendlinq, we encourage you to contact us first at <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a> so we can try to resolve it directly. Most issues can be resolved through a simple conversation. If a dispute cannot be resolved informally, it will be governed by the laws of the jurisdiction in which Spire Group Inc. operates.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>9. Changes to these terms</h2>
          <p style={styles.p}>
            We may update these terms from time to time. When we do, we will update the effective date at the top of this page. For significant changes, we will notify you through the app or by email. Your continued use of Friendlinq after changes take effect means you accept the updated terms.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>10. Contact us</h2>
          <p style={styles.p}>
            If you have any questions about these terms, please contact us:
          </p>
          <p style={styles.p}>
            Email: <a href="mailto:info@friendlinq.com" style={styles.link}>info@friendlinq.com</a>
          </p>
          <p style={styles.p}>
            Friendlinq is operated by Spire Group Inc.
          </p>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>Have questions?</h2>
          <p style={styles.ctaP}>
            Email us at <a href="mailto:info@friendlinq.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>info@friendlinq.com</a> or visit our <Link to="/faq" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>FAQ</Link> and <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Privacy Policy</Link> pages.
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
  rulesGrid: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 },
  ruleItem: { display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', borderRadius: 10, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  ruleIcon: { fontSize: 22, fontWeight: 700, color: '#d32f2f', minWidth: 32, textAlign: 'center', marginTop: 2 },
  ruleTitle: { fontSize: 16, color: '#1c1e21', display: 'block', marginBottom: 4 },
  ruleDesc: { fontSize: 14, color: '#606770', lineHeight: 1.6, margin: 0 },
  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 0 },
  copyright: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 32 },
};
