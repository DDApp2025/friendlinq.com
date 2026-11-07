// Robert's addition (Nov 6, 2026): Send Invitation, the same as the app's top menu item.
// Sends an email inviting someone to join Friendlinq, from the member's own email address.
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { dotnetApi } from '../api/axios';
import { SEND_INVITATION_MAIL } from '../api/config';

export default function Invite() {
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.login_access_token);
  const profile = useSelector((s) => s.authReducer.getProfileData) || {};
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Join me on Friendlinq, the ad-free social network. https://friendlinq.com');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { alert('Please enter a valid email address.'); return; }
    if (!message.trim()) { alert('Please enter a message.'); return; }
    setSending(true);
    try {
      const res = await dotnetApi.post(SEND_INVITATION_MAIL, {
        message: message.trim(),
        email: email.trim().toLowerCase(),
        sender: (profile.email || '').toLowerCase(),
      }, { headers: { authorization: token } });
      const d = res.data || {};
      if ((d.StatusCode ?? d.statusCode) === 200) {
        alert('Invitation sent.');
        setEmail('');
      } else {
        alert(d.Data?.emailException || d.Message || 'Invitation Error');
      }
    } catch {
      alert('Invitation Error');
    }
    setSending(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ width: '100%', maxWidth: 600, background: '#fff', borderRadius: 10, padding: 20, alignSelf: 'flex-start' }}>
        <h1 style={{ fontSize: 20, margin: '0 0 6px', color: '#1a6b3a' }}>Send Invitation</h1>
        <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>Invite a friend or family member to join you on Friendlinq.</p>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Their email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
          style={{ width: '100%', boxSizing: 'border-box', padding: 10, margin: '6px 0 14px', border: '1px solid #ccc', borderRadius: 8, fontSize: 15 }} />
        <label style={{ fontWeight: 600, fontSize: 14 }}>Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          style={{ width: '100%', boxSizing: 'border-box', padding: 10, margin: '6px 0 14px', border: '1px solid #ccc', borderRadius: 8, fontSize: 15 }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={send} disabled={sending} style={{ padding: '8px 22px', borderRadius: 20, border: 'none', background: '#1a6b3a', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
