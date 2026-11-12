import React, { useState } from 'react';
import AskAriel from './AskAriel';
import { useLocation } from 'react-router-dom';

// Help button for every page (Robert, November 7, 2026: "put a help button on each screen").
// Same help as the app (friendlinq-app legacy/components/helpButton.js), for the page you are on.
// The Ariel help chat will open from this same button in the next build.

export const HELP = {
  home: {
    title: 'Home',
    items: [
      'To share something, type in the box at the top, or click Photo or Video. Then click Post.',
      '"Who can see this post" decides who sees what you are posting: Everyone, or Only my friends.',
      "The tabs choose what you are looking at. Everyone's Posts shows posts from all members. My Friends' Posts shows only people you are friends with.",
      'My Posts opens your profile, where all your own posts are listed.',
      'To find someone, click "Search people" at the top.',
      'Click your picture at the top right for your profile, Dating Mode, invitations, settings and log out.',
    ],
  },
  datingHome: {
    title: 'Dating',
    items: [
      'Dating Mode is a separate profile with its own friends, chats, groups and photos.',
      'Discover shows one person at a time. Click the heart to like them, or the X to pass. Click the card to see their full profile.',
      'Likes You shows people who liked you. Click Like back and it is a match.',
      'Matches are people who like each other. Click Say hi to start a chat.',
      'To go back to your Public Profile, open the menu under your picture and choose Switch to Social Mode.',
    ],
  },
  searchPeople: {
    title: 'Search People',
    items: [
      "Type a person's name.",
      'This searches everyone on Friendlinq, not just your friends.',
      'Click a person to open their profile. From there you can add them as a friend or send a message.',
    ],
  },
  friends: {
    title: 'My Friends',
    items: [
      'This is the list of people you are friends with.',
      'To find new people, use Search People.',
      'Friend Requests are people who asked to be your friend. Sent Requests are people you asked.',
    ],
  },
  album: {
    title: 'My Friendlinq Profile Album',
    items: [
      'Photos and videos here are shown on your profile. They are not posted to the feed.',
      'To share a photo or video with friends, go to Home and use Photo or Video.',
      'You can pick your top four photos to show at the top of your profile.',
    ],
  },
  notifications: {
    title: 'Notifications',
    items: ['Here you see friend requests, comments, likes and messages for you.', 'Click a notification to go to it.'],
  },
  chat: {
    title: 'Chat',
    items: [
      'These are your private conversations.',
      'Click a conversation to open it. Type at the bottom and send.',
      "To start a new chat, open a friend's profile and click Message.",
    ],
  },
  groups: {
    title: 'Groups',
    items: ['Groups are for people who share an interest.', 'Click a group to see its posts. Join a group to post in it.', 'You can also create your own group.'],
  },
  profile: {
    title: 'My Public Profile',
    items: ['This is your profile. Your own posts are listed further down this page under My Posts.', 'Click Edit Profile to change your details, photo and banner.'],
  },
  userProfile: {
    title: 'Profile',
    items: ["This is another member's profile.", 'Use the buttons to add them as a friend or send a message.'],
  },
  comments: { title: 'Comments', items: ['Type your comment at the bottom and send it.', 'Click Reply under a comment to answer it.'] },
  settings: { title: 'Settings', items: ['Change your password, email settings, Social Mode or Dating Mode, and other options here.', 'Log out is at the bottom.'] },
};

export function helpKeyForPath(path) {
  if (path.startsWith('/add-friend')) return 'searchPeople';
  if (path.startsWith('/friends')) return 'friends';
  if (path.startsWith('/photos') || path.startsWith('/portfolio')) return 'album';
  if (path.startsWith('/notifications')) return 'notifications';
  if (path.startsWith('/messages') || path.startsWith('/chat')) return 'chat';
  if (path.startsWith('/groups')) return 'groups';
  if (path.startsWith('/profile') || path.startsWith('/edit-profile')) return 'profile';
  if (path.startsWith('/user/')) return 'userProfile';
  if (path.startsWith('/comments')) return 'comments';
  if (path.startsWith('/settings')) return 'settings';
  return 'home';
}

export default function HelpButton({ screen, light = false }) {
  const location = useLocation();
  const isDating = (typeof localStorage !== 'undefined' && localStorage.getItem('usertype') === 'dating');
  const [open, setOpen] = useState(false);
  const [ariel, setAriel] = useState(false);
  const key = screen || helpKeyForPath(location.pathname);
  const h = HELP[key === 'home' && isDating ? 'datingHome' : key] || HELP.home;
  const c = light ? '#fff' : '#1a6b3a';
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={'Help for ' + h.title}
        title="Help"
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 6px', color: c }}
      >
        <span style={{ width: 24, height: 24, borderRadius: 12, border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>?</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, marginTop: 1 }}>Help</span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={'Help: ' + h.title} onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, maxWidth: 460, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 22, color: '#222', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 12px', color: '#1a6b3a', fontSize: 21 }}>Help: {h.title}</h3>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {h.items.map((t, i) => (
                <li key={i} style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 8 }}>{t}</li>
              ))}
            </ul>
            <p style={{ fontSize: 14.5, color: '#555', marginTop: 10 }}>
              Still stuck? Email us at <a href="mailto:info@friendlinq.com" style={{ color: '#1a6b3a', fontWeight: 700 }}>info@friendlinq.com</a>
            </p>
            <button onClick={() => { setOpen(false); setAriel(true); }} style={{ marginTop: 8, width: '100%', background: '#fff', color: '#1a6b3a', border: '2px solid #1a6b3a', borderRadius: 10, padding: '10px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Ask Ariel a question
            </button>
            <button onClick={() => setOpen(false)} style={{ marginTop: 8, width: '100%', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Got it
            </button>
          </div>
        </div>
      )}
      <AskAriel open={ariel} onClose={() => setAriel(false)} />
    </>
  );
}
