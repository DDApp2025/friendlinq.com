import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/PublicPageLayout';

const iconStyle = { width: 28, height: 28, stroke: '#1a6b3a', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const features = [
  {
    title: 'Messaging',
    desc: 'Send private messages to friends and family with text, photos, and media attachments. Conversations are real-time, so you can chat naturally — just like texting, but right inside Friendlinq. Your messages are private and only visible to you and the person you\'re talking to.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
  },
  {
    title: 'Community groups',
    desc: 'Join groups based on your interests — gardening, travel, book clubs, cooking, health and wellness, and more. Or create your own group and invite others. Groups are a great way to meet people who share your passions, swap tips and stories, and build a sense of community.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
  },
  {
    title: 'Video and audio calls',
    desc: 'See your friends and family face-to-face with one-tap video calls. You can also make audio-only calls when you prefer. Calls work on your phone, tablet, or computer — and you can call individuals or entire groups. No extra app needed; it\'s all built right into Friendlinq.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
    ),
  },
  {
    title: 'Live streaming',
    desc: 'Host your own live stream and share moments as they happen — a family gathering, a hobby demonstration, a community event. Or join a friend\'s live stream and interact in real time. Live streaming on Friendlinq is simple to start with just one tap.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/></svg>
    ),
  },
  {
    title: 'Photo and video sharing',
    desc: 'Upload and share photos and videos with your friends, family, or community groups. Build a personal portfolio of your favorite memories, choose your top profile showcase images, and keep a private album that\'s only visible to people you trust.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    ),
  },
  {
    title: 'Social feed',
    desc: 'Share text updates, photos, and videos with your community. Your feed shows content from friends and groups you\'ve joined — in chronological order, with no algorithm manipulation. Toggle between your full community feed and a friends-only feed anytime.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
    ),
  },
  {
    title: 'Profiles',
    desc: 'Create a personal profile with your photo, banner image, bio, and interests. Choose your top showcase photos so friends old and new can learn about you. View other people\'s profiles and send friend requests to connect.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
  },
  {
    title: 'Marketplace',
    desc: 'Browse community listings in the Friendlinq marketplace. Whether you\'re looking for a local service, a handmade craft, or a community offering, the marketplace is a safe, simple way to discover what people around you have to share.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    ),
  },
  {
    title: 'Events and activities',
    desc: 'Discover local events, community activities, and virtual get-togethers happening near you. Stay informed about what\'s going on in your community and find new things to do with the people you care about.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
  },
  {
    title: 'Notifications',
    desc: 'Stay up to date with real-time notifications for friend requests, messages, comments, likes, group activity, and live streams. You\'re always in the loop without having to check every page manually.',
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    ),
  },
];

export default function Features() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Features | Friendlinq — Messaging, Groups, Video Calls, and More</title>
        <meta name="description" content="Explore Friendlinq features: messaging, community groups, video calls, live streaming, photo sharing, marketplace, profiles, and events. Simple, safe, and free." />
        <link rel="canonical" href="https://friendlinq.com/features" />
        <meta property="og:title" content="Features | Friendlinq — Messaging, Groups, Video Calls, and More" />
        <meta property="og:description" content="Explore Friendlinq features: messaging, community groups, video calls, live streaming, photo sharing, marketplace, profiles, and events. Simple, safe, and free." />
        <meta property="og:url" content="https://friendlinq.com/features" />
      </Helmet>

      <div style={styles.container}>
        <h1 style={styles.h1}>Everything you need to stay connected</h1>
        <p style={styles.intro}>Friendlinq gives you all the tools to keep your social life thriving — messaging, groups, video calls, photo sharing, and more — all designed for simplicity and comfort.</p>

        <div style={styles.featuresList}>
          {features.map((f, i) => (
            <section key={i} style={styles.featureCard} className="features-card">
              <div style={styles.iconWrap}>{f.icon}</div>
              <div style={styles.featureBody}>
                <h2 style={styles.h2}>{f.title}</h2>
                <p style={styles.desc}>{f.desc}</p>
              </div>
            </section>
          ))}
        </div>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaH2}>Ready to try it?</h2>
          <p style={styles.ctaP}>Join Friendlinq today. It's free, simple, and takes less than a minute.</p>
          <Link to="/register" style={styles.ctaBtn}>Sign up for free</Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .features-card {
            flex-direction: column !important;
            align-items: flex-start !important;
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
  featuresList: { display: 'flex', flexDirection: 'column', gap: 24 },
  featureCard: { display: 'flex', gap: 20, alignItems: 'flex-start', background: '#fff', borderRadius: 10, padding: '24px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e4e6eb' },
  iconWrap: { minWidth: 56, height: 56, background: '#e8f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureBody: { flex: 1, minWidth: 0 },
  h2: { fontSize: 18, fontWeight: 600, color: '#1c1e21', marginBottom: 6 },
  desc: { fontSize: 15, color: '#4b4f56', lineHeight: 1.65, margin: 0 },
  ctaSection: { background: '#1a6b3a', borderRadius: 12, padding: '36px 32px', textAlign: 'center', marginTop: 48 },
  ctaH2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 },
  ctaP: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  ctaBtn: { display: 'inline-block', background: '#fff', color: '#1a6b3a', padding: '14px 40px', borderRadius: 6, fontSize: 17, fontWeight: 700, textDecoration: 'none' },
};
