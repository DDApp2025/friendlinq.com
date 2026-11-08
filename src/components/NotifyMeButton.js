// "Notify me when they post" on another member's profile, same as the app (Robert, Nov 8, 2026).
// Server: GET and POST /api/v1/user/notifyMe (collection "postfollows").
import React, { useEffect, useState } from 'react';
import { MdNotifications, MdNotificationsNone } from 'react-icons/md';
import { BASE_URL } from '../api/config';

export default function NotifyMeButton({ userId, token, myId }) {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!userId || !token || userId === myId) return;
    fetch(BASE_URL + '/api/v1/user/notifyMe?userId=' + encodeURIComponent(userId), { headers: { authorization: token } })
      .then((r) => r.json())
      .then((res) => { if (res && res.statusCode === 200 && res.data) setOn(!!res.data.on); })
      .catch(() => {});
  }, [userId, token, myId]);
  if (!userId || userId === myId) return null;
  const toggle = async () => {
    setBusy(true);
    const want = !on;
    try {
      const fd = new FormData();
      fd.append('userId', userId);
      fd.append('on', want ? 'true' : 'false');
      const res = await fetch(BASE_URL + '/api/v1/user/notifyMe', { method: 'POST', headers: { authorization: token }, body: fd }).then((r) => r.json());
      if (res && res.statusCode === 200) {
        setOn(want);
        alert(want ? 'You will get a notification when this member posts.' : 'You will no longer get a notification when this member posts.');
      } else alert((res && res.message) || 'Please try again.');
    } catch (e) { alert('Please try again.'); }
    setBusy(false);
  };
  return (
    <button onClick={toggle} disabled={busy}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
        border: '1.5px solid #1a6b3a', background: on ? '#1a6b3a' : '#fff', color: on ? '#fff' : '#1a6b3a', opacity: busy ? 0.6 : 1 }}>
      {on ? <MdNotifications size={18} /> : <MdNotificationsNone size={18} />}
      {on ? 'Notifying me' : 'Notify me when they post'}
    </button>
  );
}
