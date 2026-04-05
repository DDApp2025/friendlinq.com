import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

const categories = [
  {
    name: 'Getting started',
    items: [
      {
        q: 'What is Friendlinq?',
        a: 'Friendlinq is a social network designed for adults who want a simpler, safer way to stay connected. It features messaging, community groups, video calls, live streaming, photo sharing, a marketplace, and more — all through an interface built for clarity and comfort. It\'s completely free to join and use.',
      },
      {
        q: 'How do I sign up?',
        a: 'Visit the sign-up page and enter your name, email address, and a password. It takes less than a minute. Once registered, you can start connecting with friends, joining groups, and exploring the platform immediately.',
      },
      {
        q: 'Is Friendlinq free?',
        a: 'Yes, completely free. There are no subscription fees, no hidden charges, and no premium tiers required to access core features including messaging, groups, photo sharing, video calls, and more.',
      },
      {
        q: 'What devices can I use Friendlinq on?',
        a: 'Friendlinq is available on the web (any modern browser), iOS (iPhone and iPad via the App Store), and Android (via Google Play). Your account works across all devices — just log in and pick up where you left off.',
      },
    ],
  },
  {
    name: 'Features',
    items: [
      {
        q: 'What can I do on Friendlinq?',
        a: 'You can share updates, photos, and videos; send private messages; join or create interest-based community groups; make video and audio calls; host or join live streams; browse the marketplace; manage your profile; and discover events and activities — all in one place.',
      },
      {
        q: 'How do groups work?',
        a: 'You can join existing groups based on your interests (gardening, travel, book clubs, cooking, health and wellness, and more) or create your own group and invite others. Inside a group you can post updates, share photos, and interact with other members.',
      },
      {
        q: 'Can I share photos and videos?',
        a: 'Yes. You can share photos and videos in your feed, in private messages, and in groups. You also have a personal photo portfolio where you can organize and showcase your favorite images, and a private album visible only to friends you choose.',
      },
      {
        q: 'How do video calls work?',
        a: 'Video and audio calls are built right into Friendlinq — no extra app needed. You can call individual friends or start a group call. Calls work on phones, tablets, and computers. Just tap the call button on a friend\'s profile or in a group.',
      },
      {
        q: 'Can I host a live stream?',
        a: 'Yes. You can start a live stream with one tap and share it with friends or groups. Viewers can join and interact in real time. It\'s a great way to share moments as they happen — a family gathering, a cooking session, or a community event.',
      },
    ],
  },
  {
    name: 'Safety and privacy',
    items: [
      {
        q: 'Is Friendlinq safe?',
        a: 'Yes. Friendlinq is built with safety as a top priority. The platform includes enhanced privacy controls, community moderation, and protection from scams and spam. We take your safety seriously and continuously work to keep the platform secure.',
      },
      {
        q: 'How is my data protected?',
        a: 'Your personal data is never sold to advertisers, data brokers, or any third party. We collect only the information needed to provide the service, and we use industry-standard security practices to keep it safe. You can read more on our privacy policy page.',
      },
      {
        q: 'How do I report someone or block a user?',
        a: 'You can report inappropriate behavior or block a user directly from their profile page. Our moderation team reviews reports and takes action to keep the community safe. If you need additional help, contact us at info@friendlinq.com.',
      },
      {
        q: 'Is my data sold to advertisers?',
        a: 'No. Friendlinq does not sell your data — ever. There are no ads on the platform, and we do not share your personal information with advertisers or data brokers. Your privacy is fundamental to how we operate.',
      },
    ],
  },
  {
    name: 'Comparison and compatibility',
    items: [
      {
        q: 'How is Friendlinq different from Facebook?',
        a: 'Friendlinq is built from the ground up for people who want simplicity. That means cleaner navigation, larger text, no algorithm-driven content manipulation, no advertisements, and privacy controls designed to actually protect you. Facebook is a general platform built around engagement metrics — Friendlinq is built around you.',
      },
      {
        q: 'Do I need to be tech-savvy to use Friendlinq?',
        a: 'Not at all. Friendlinq uses large, clear buttons, simple navigation, and straightforward language. There\'s a guided tutorial that walks you through every feature step by step. If you can browse the internet and send an email, you can use Friendlinq.',
      },
      {
        q: 'Can my family members join?',
        a: 'Absolutely. Friendlinq is open to adults of all ages. Invite your family, friends, and anyone you want to stay connected with. The more people you care about who join, the better the experience becomes.',
      },
    ],
  },
];

const IconChevron = ({ open }) => (
  <span style={{ fontSize: 18, color: '#606770', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9662;</span>
);

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PublicPageLayout>
      <Helmet>
        <title>FAQ | Friendlinq — Frequently Asked Questions</title>
        <meta name="description" content="Find answers about Friendlinq: how to sign up, features, safety, privacy, how it compares to Facebook, and more. Everything you need to know in one place." />
        <link rel="canonical" href="https://friendlinq.com/faq" />
        <meta property="og:title" content="FAQ | Friendlinq — Frequently Asked Questions" />
        <meta property="og:description" content="Find answers about Friendlinq: how to sign up, features, safety, privacy, how it compares to Facebook, and more." />
        <meta property="og:url" content="https://friendlinq.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | Friendlinq — Frequently Asked Questions" />
        <meta name="twitter:description" content="Find answers about Friendlinq: how to sign up, features, safety, privacy, how it compares to Facebook, and more." />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Frequently asked questions</h1>
        <p style={styles.intro}>Everything you need to know about Friendlinq. Can't find your answer? <a href="/contact" style={styles.link}>Contact us</a> and we'll be happy to help.</p>

        {categories.map((cat, ci) => (
          <section key={ci} style={styles.category}>
            <h2 style={styles.catTitle}>{cat.name}</h2>
            {cat.items.map((item, ii) => {
              const key = `${ci}-${ii}`;
              const isOpen = !!openItems[key];
              return (
                <div key={key} style={styles.faqItem}>
                  <div
                    style={{ ...styles.faqQ, background: isOpen ? '#f0f2f5' : '#fafbfc' }}
                    onClick={() => toggle(key)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(key); } }}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <IconChevron open={isOpen} />
                  </div>
                  <div style={{ ...styles.faqA, display: isOpen ? 'block' : 'none' }}>{item.a}</div>
                </div>
              );
            })}
          </section>
        ))}

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>Still have questions?</h2>
          <p style={styles.ctaP}>We're here to help. Reach out anytime at <a href="mailto:info@friendlinq.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>info@friendlinq.com</a> or visit our <a href="/contact" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>contact page</a>.</p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

const styles = {
  container: { maxWidth: 720, margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: 32, fontWeight: 700, color: '#1c1e21', marginBottom: 12, textAlign: 'center' },
  intro: { fontSize: 16, color: '#4b4f56', lineHeight: 1.7, textAlign: 'center', marginBottom: 40 },
  link: { color: '#1a6b3a', textDecoration: 'none', fontWeight: 600 },
  category: { marginBottom: 36 },
  catTitle: { fontSize: 20, fontWeight: 700, color: '#1a6b3a', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #e8f5ee' },
  faqItem: { border: '1px solid #e4e6eb', borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  faqQ: { padding: '16px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1c1e21', background: '#fafbfc', border: 'none', width: '100%', textAlign: 'left' },
  faqA: { padding: '0 20px 16px', fontSize: 14, color: '#606770', lineHeight: 1.6 },
  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 0 },
};
