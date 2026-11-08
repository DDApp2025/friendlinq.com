import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/config';

// Dating home, same as the app (friendlinq-app legacy/components/datingHome.js).
// Robert, November 7, 2026: "The dating Home Screen needs to have some dating related ... features".
// Discover (one profile at a time, Like and Pass), Likes You (Like back makes a match), Matches (Say hi).
// A Like is a friend request between two dating profiles; a match is an accepted one.

const PINK = '#e84393';
const DARK = '#7a1e4f';
const SKIP_KEY = 'fl_dating_passed';

const ageOf = (p) => {
  if (p.age && !isNaN(parseInt(p.age, 10))) return parseInt(p.age, 10);
  if (p.dob) {
    const d = new Date(p.dob);
    if (!isNaN(d.getTime())) {
      const n = new Date();
      let a = n.getFullYear() - d.getFullYear();
      if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--;
      if (a > 0 && a < 120) return a;
    }
  }
  return null;
};
const imgOf = (p) => {
  const x = p && p.imageURL && (p.imageURL.original || p.imageURL.thumbnail);
  if (!x) return null;
  return x.startsWith('http') ? x : BASE_URL + '/' + x;
};
const place = (p) => [p.city, p.state].filter(Boolean).join(', ');
const chips = (p) => [p.interests, p.hobbies].filter(Boolean).join(',').split(/[,;|]/).map((t) => t.trim()).filter(Boolean).slice(0, 6);

function Avatar({ p, size }) {
  const img = imgOf(p);
  if (img) return <img src={img} alt={p.fullName || 'Member'} style={{ width: size, height: size, borderRadius: size / 2, objectFit: 'cover', background: '#f3d1e2' }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: PINK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size / 2.6 }}>
      {(p.fullName || '?').charAt(0).toUpperCase()}
    </div>
  );
}

export default function DatingHome({ token, myProfile }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('discover');
  const [busy, setBusy] = useState(true);
  const [data, setData] = useState({ discover: [], likesYou: [], matches: [] });
  const [passed, setPassed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SKIP_KEY) || '[]'); } catch (e) { return []; }
  });
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch(BASE_URL + '/api/v1/user/datingHome', { headers: { authorization: token } });
      const res = await r.json();
      if (res && res.statusCode === 200 && res.data) setData(res.data);
    } catch (e) { /* keep what is shown */ }
    setBusy(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const post = async (path, fields) => {
    const fd = new FormData();
    Object.keys(fields).forEach((k) => fd.append(k, fields[k]));
    const r = await fetch(BASE_URL + path, { method: 'POST', headers: { authorization: token }, body: fd });
    return r.json();
  };

  // Block (saved on the server, "userblocks") and Report (email to support), same as the app.
  const [blocked, setBlocked] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + '/api/v1/user/blocks', { headers: { authorization: token } })
      .then((r) => r.json())
      .then((res) => { if (res && res.statusCode === 200 && res.data && res.data.blocked) setBlocked(res.data.blocked); })
      .catch(() => {});
  }, [token]);
  const reportOrBlock = async (p) => {
    const name = p.fullName || 'this member';
    if (window.confirm('Block ' + name + '? You will no longer see each other in Dating. (Cancel to report instead.)')) {
      setBlocked((b) => [...b, p._id]);
      try { await post('/api/v1/user/block', { userId: p._id, block: true }); } catch (e) { /* hidden here anyway */ }
    } else if (window.confirm('Report ' + name + ' to Friendlinq support by email?')) {
      window.location.href = 'mailto:info@friendlinq.com?subject=' + encodeURIComponent('Report a Dating profile') +
        '&body=' + encodeURIComponent('Member: ' + (p.fullName || '') + '\nMember ID: ' + p._id + '\nWhat happened:\n');
    }
  };

  const queue = (data.discover || []).filter((p) => passed.indexOf(p._id) < 0 && blocked.indexOf(p._id) < 0);
  const current = queue[0];

  const pass = (p) => {
    const next = [...passed, p._id].slice(-500);
    setPassed(next);
    try { localStorage.setItem(SKIP_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  };
  const like = async (p) => {
    setActing(true);
    try {
      const res = await post('/api/user/sendFriendRequest', { userToId: p._id });
      if (res && res.statusCode === 200) setData((d) => ({ ...d, discover: d.discover.filter((x) => x._id !== p._id) }));
      else alert((res && res.message) || 'Could not send your like. Please try again.');
    } catch (e) { alert('Could not send your like. Please try again.'); }
    setActing(false);
  };
  const likeBack = async (p) => {
    setActing(true);
    try {
      const res = await post('/api/user/acceptFriendRequest', { userToId: p._id, status: 'Accepted' });
      if (res && res.statusCode === 200) {
        setData((d) => ({ ...d, likesYou: d.likesYou.filter((x) => x._id !== p._id), matches: [p, ...d.matches] }));
        alert("It's a match! You and " + (p.fullName || 'this member') + ' like each other. Say hi!');
      } else alert((res && res.message) || 'Please try again.');
    } catch (e) { alert('Please try again.'); }
    setActing(false);
  };

  const incomplete = !(myProfile && imgOf(myProfile) && myProfile.looking_for && myProfile.looking_for !== 'null');

  const tabBtn = (k, label, count) => (
    <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
      style={{ flex: 1, padding: '9px 4px', border: 'none', background: tab === k ? PINK : '#fff', color: tab === k ? '#fff' : PINK, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
      {label}{count ? ` (${count})` : ''}
    </button>
  );

  const row = (p, btn) => (
    <div key={p._id} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #f0c6da' }}>
      <div style={{ cursor: 'pointer' }} onClick={() => navigate('/user/' + p._id)}><Avatar p={p} size={56} /></div>
      <div style={{ flex: 1, marginLeft: 12, cursor: 'pointer' }} onClick={() => navigate('/user/' + p._id)}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>{p.fullName}{ageOf(p) ? ', ' + ageOf(p) : ''}</div>
        {place(p) && <div style={{ fontSize: 13.5, color: '#777' }}>{place(p)}</div>}
        {p.looking_for && <div style={{ fontSize: 13.5, color: DARK }}>Looking for: {p.looking_for}</div>}
      </div>
      {btn}
    </div>
  );

  return (
    <div style={{ background: '#fff7fb', borderRadius: 12, padding: '12px 0 20px', marginBottom: 12 }}>
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>Find someone special</div>
        <div style={{ fontSize: 14, color: '#7a5a6a' }}>Single adults in Dating Mode. Like someone; if they like you back, it's a match.</div>
      </div>
      {incomplete && (
        <div onClick={() => navigate('/edit-profile')} style={{ margin: '10px 12px 0', padding: 10, borderRadius: 10, background: '#fde3ef', border: `1px solid ${PINK}`, color: DARK, fontWeight: 700, cursor: 'pointer' }}>
          Add a photo and what you are looking for to get more likes. Click here.
        </div>
      )}
      <div role="tablist" style={{ display: 'flex', margin: 12, borderRadius: 10, border: `1.5px solid ${PINK}`, overflow: 'hidden' }}>
        {tabBtn('discover', 'Discover')}
        {tabBtn('likes', 'Likes You', (data.likesYou || []).length)}
        {tabBtn('matches', 'Matches', (data.matches || []).length)}
      </div>

      {busy ? (
        <div style={{ textAlign: 'center', color: PINK, marginTop: 30 }}>Loading...</div>
      ) : tab === 'discover' ? (
        current ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div onClick={() => navigate('/user/' + current._id)} style={{ width: 'calc(100% - 24px)', maxWidth: 480, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 3px 12px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
              {imgOf(current) ? (
                <img src={imgOf(current)} alt={current.fullName || 'Member'} style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 320, background: '#f8c9de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, color: '#fff', fontWeight: 800 }}>
                  {(current.fullName || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#222' }}>{current.fullName}{ageOf(current) ? ', ' + ageOf(current) : ''}</div>
                {place(current) && <div style={{ fontSize: 15, color: '#777' }}>{place(current)}</div>}
                {current.looking_for && <div style={{ fontSize: 15.5, color: DARK, marginTop: 6, fontWeight: 600 }}>Looking for: {current.looking_for}</div>}
                {current.about && <div style={{ fontSize: 15, color: '#333', marginTop: 6 }}>{current.about}</div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {chips(current).map((c) => <span key={c} style={{ background: '#fde3ef', color: DARK, borderRadius: 14, padding: '4px 10px', fontSize: 13 }}>{c}</span>)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 44, marginTop: 16 }}>
              <button disabled={acting} onClick={() => pass(current)} aria-label="Pass" title="Pass"
                style={{ width: 70, height: 70, borderRadius: 35, background: '#fff', border: '2px solid #bbb', fontSize: 34, color: '#888', cursor: 'pointer' }}>&#10005;</button>
              <button disabled={acting} onClick={() => like(current)} aria-label="Like" title="Like"
                style={{ width: 70, height: 70, borderRadius: 35, background: PINK, border: 'none', fontSize: 34, color: '#fff', cursor: 'pointer' }}>&#9829;</button>
            </div>
            <button onClick={() => reportOrBlock(current)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#999', textDecoration: 'underline', cursor: 'pointer' }}>Report or block</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 24px', color: DARK }}>
            <div style={{ fontSize: 48, color: PINK }}>&#9825;</div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>You have seen everyone for now.</div>
            <div style={{ color: '#7a5a6a', marginTop: 6 }}>New people join every day. Check back soon, and invite your single friends.</div>
            <button onClick={load} style={{ marginTop: 14, background: PINK, color: '#fff', border: 'none', borderRadius: 20, padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}>Refresh</button>
          </div>
        )
      ) : tab === 'likes' ? (
        (data.likesYou || []).length ? data.likesYou.filter((p) => blocked.indexOf(p._id) < 0).map((p) => row(p,
          <button disabled={acting} onClick={() => likeBack(p)} style={{ background: PINK, color: '#fff', border: 'none', borderRadius: 18, padding: '8px 14px', fontWeight: 800, cursor: 'pointer' }}>Like back</button>))
          : <div style={{ textAlign: 'center', color: '#7a5a6a', padding: '30px 24px' }}>No new likes yet. A complete profile with a good photo gets the most likes.</div>
      ) : (
        (data.matches || []).length ? data.matches.filter((p) => blocked.indexOf(p._id) < 0).map((p) => row(p,
          <button onClick={() => navigate('/chat/' + p._id)} style={{ background: DARK, color: '#fff', border: 'none', borderRadius: 18, padding: '8px 14px', fontWeight: 800, cursor: 'pointer' }}>Say hi</button>))
          : <div style={{ textAlign: 'center', color: '#7a5a6a', padding: '30px 24px' }}>No matches yet. Like people in Discover; when someone likes you back, they show up here.</div>
      )}
    </div>
  );
}
