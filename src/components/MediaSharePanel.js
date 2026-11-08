// Share an album photo or video with the same four choices as posts (Robert, Nov 8, 2026):
// Public feed, Friends' feed, one of my Groups, Copy link.
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dotnetApi } from '../api/axios';
import { SHARE_POST } from '../api/config';

export default function MediaSharePanel({ path, isVideo, thumbnail, link }) {
  const token = useSelector((s) => s.authReducer.login_access_token);
  const [groups, setGroups] = useState(null);
  const [busy, setBusy] = useState(false);
  const loadGroups = async () => {
    if (groups) return;
    try {
      const res = await dotnetApi.post('/Group/GetGroupsList', { authorization: token });
      const find = (o, d = 0) => {
        if (d > 3) return null;
        if (Array.isArray(o) && o.length && typeof o[0] === 'object') return o;
        if (o && typeof o === 'object' && !Array.isArray(o)) for (const v of Object.values(o)) { const f = find(v, d + 1); if (f) return f; }
        return null;
      };
      setGroups(find(res.data) || []);
    } catch (e) { setGroups([]); }
  };
  const share = async (postType, groupId) => {
    setBusy(true);
    try {
      await dotnetApi.post(SHARE_POST, {
        ...(groupId ? { groupId } : {}),
        authorization: token,
        imageUrl: isVideo ? null : path,
        imageThumbnail: null,
        videoUrl: isVideo ? path : null,
        videoThumbnail: isVideo ? thumbnail || null : null,
        postTitle: null,
        postContent: null,
        postType,
      });
      alert(groupId ? 'Shared in your group.' : postType === 'Public'
        ? "Shared to the Public feed. Everyone can see it in Everyone's Posts. It is also in My Posts on your profile."
        : "Shared to your Friends' feed. Your friends can see it in My Friends' Posts. It is also in My Posts on your profile.");
    } catch (e) { alert('Not shared. Please try again.'); }
    setBusy(false);
  };
  const btn = { padding: '9px 14px', borderRadius: 8, border: 'none', background: '#1a6b3a', color: '#fff', fontWeight: 700, cursor: 'pointer' };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 10 }} onMouseEnter={loadGroups}>
      <button style={btn} disabled={busy} onClick={() => share('Public')}>Share to the Public feed</button>
      <button style={btn} disabled={busy} onClick={() => share('Friend_Only')}>Share to my Friends' feed</button>
      <select defaultValue="" onFocus={loadGroups} onChange={(e) => { if (e.target.value) share('Public', e.target.value); e.target.value = ''; }}
        style={{ padding: 8, borderRadius: 8, fontWeight: 700 }}>
        <option value="">Share to one of my Groups...</option>
        {(groups || []).map((g) => <option key={g._id} value={g._id}>{g.groupName}</option>)}
      </select>
      <button style={{ ...btn, background: '#fff', color: '#1a6b3a', border: '1.5px solid #1a6b3a' }}
        onClick={() => { try { navigator.clipboard.writeText(link); alert('Link copied.'); } catch (e) { window.prompt('Copy this link:', link); } }}>Copy link</button>
    </div>
  );
}
