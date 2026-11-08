import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { nodeApi, dotnetApi } from '../../api/axios';
import { MY_POST_LIKE, MY_POST_DISLIKE, DELETE_MY_POST, UPDATE_POST, REPORT_POST, SHARE_POST, CHANGE_COMMENT_VALUE } from '../../api/config';
import {
  AiOutlineLike, AiFillLike,
  AiOutlineDislike, AiFillDislike,
  AiOutlineComment,
} from 'react-icons/ai';
import { BsThreeDotsVertical, BsEmojiSmile } from 'react-icons/bs';
import { FaShare } from 'react-icons/fa';
import { addComment } from '../../actions/post_actions';
import normalizeImg from '../../utils/normalizeImg';
import VideoTextEditor, { overlayToString } from './VideoTextEditor';
import { firstName } from '../../utils/displayName';

// Feed videos play by themselves (muted, looping) while at least half of the video is on screen,
// and pause when scrolled away. Tap the video controls to turn the sound on.
// Robert's addition (Nov 6, 2026): text written on top of a video in the app ("Aa" editor).
// postOverlay is a JSON text: { v: 1, items: [ { t, x, y, s, c, b, bg } ] }. x and y are the centre of
// the text as a share of a 9:16 frame; s is the font size as a share of the frame width.
function parseOverlay(raw) {
  if (!raw) return null;
  try {
    const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const items = (o && Array.isArray(o.items) ? o.items : []).filter((it) => it && typeof it.t === 'string' && it.t.trim());
    // Captions (Nov 6, 2026): "cap": [ { s: start seconds, e: end seconds, t: text } ]
    const cap = (o && Array.isArray(o.cap) ? o.cap : []).filter((c) => c && typeof c.t === 'string' && c.t.trim());
    return items.length || cap.length ? { items, cap } : null;
  } catch (e) {
    return null;
  }
}

function VideoTextOverlay({ overlay }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', containerType: 'size' }}>
      {overlay.items.map((it, i) => {
        const size = Math.max(0.03, Number(it.s) || 0.06) * 100;
        const box = it.bg === 'dark'
          ? { background: 'rgba(0,0,0,0.65)', padding: `${size * 0.15}cqw ${size * 0.3}cqw`, borderRadius: `${size * 0.3}cqw` }
          : it.bg === 'light'
            ? { background: 'rgba(255,255,255,0.88)', padding: `${size * 0.15}cqw ${size * 0.3}cqw`, borderRadius: `${size * 0.3}cqw` }
            : { textShadow: '1px 1px 3px rgba(0,0,0,0.75)' };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(Number(it.x) || 0.5) * 100}%`,
              top: `${(Number(it.y) || 0.5) * 100}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '90%',
              width: 'max-content',
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: it.c || '#FFFFFF',
              fontWeight: it.b ? 'bold' : 'normal',
              fontSize: `${size}cqw`,
              lineHeight: 1.2,
              ...box,
            }}
          >
            {it.t}
          </div>
        );
      })}
    </div>
  );
}

// Robert's addition (Nov 6, 2026): the CC switch (one setting for the whole site, kept in this browser).
function readCC() {
  try { return window.localStorage.getItem('fl_cc_on') !== '0'; } catch (e) { return true; }
}
function captionAt(cap, t) {
  for (let i = 0; i < cap.length; i++) {
    if (t >= Number(cap[i].s) - 0.05 && t <= Number(cap[i].e) + 0.35) return cap[i].t;
  }
  return '';
}
function VideoWithOverlay({ src, overlay }) {
  const [time, setTime] = useState(0);
  const [ccOn, setCcOn] = useState(readCC);
  useEffect(() => {
    const f = () => setCcOn(readCC());
    window.addEventListener('fl-cc-change', f);
    return () => window.removeEventListener('fl-cc-change', f);
  }, []);
  const toggle = (e) => {
    e.stopPropagation();
    const next = !ccOn;
    try { window.localStorage.setItem('fl_cc_on', next ? '1' : '0'); } catch (err) {}
    setCcOn(next);
    window.dispatchEvent(new Event('fl-cc-change'));
  };
  const line = overlay.cap.length && ccOn ? captionAt(overlay.cap, time) : '';
  // Voice (text to speech): plays from the start whenever the video plays with the sound on.
  const voices = overlay.items.filter((it) => it.tts && it.tts.u && (!it.tts.t || it.tts.t === it.t)).map((it) => it.tts.u);
  const audioRef = useRef(null);
  const wasOn = useRef(false);
  const onState = ({ playing, muted }) => {
    const on = playing && !muted;
    if (on && !wasOn.current && voices.length) {
      let i = 0;
      const next = () => {
        if (i >= voices.length) return;
        const a = new Audio('https://natural.friendlinq.com/' + voices[i++]);
        audioRef.current = a;
        a.onended = next;
        a.play().catch(() => {});
      };
      next();
    }
    if (!on && audioRef.current) { audioRef.current.onended = null; audioRef.current.pause(); audioRef.current = null; }
    wasOn.current = on;
  };
  return (
    <div style={styles.overlayFrame}>
      <AutoPlayVideo src={src} style={styles.overlayVideo} onTime={overlay.cap.length ? setTime : undefined} onState={voices.length ? onState : undefined} />
      <VideoTextOverlay overlay={overlay} />
      {line ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '16%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ maxWidth: '80%', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 16, lineHeight: 1.35, fontWeight: 600, textAlign: 'center', padding: '3px 8px', borderRadius: 6 }}>{line}</span>
        </div>
      ) : null}
      {overlay.cap.length ? (
        <button
          onClick={toggle}
          title={ccOn ? 'Turn captions off' : 'Turn captions on'}
          style={{ position: 'absolute', top: 10, right: 10, border: '1.5px solid #fff', borderRadius: 5, padding: '1px 6px', fontWeight: 'bold', fontSize: 13, cursor: 'pointer', background: ccOn ? '#fff' : 'rgba(0,0,0,0.35)', color: ccOn ? '#000' : '#fff' }}
        >
          CC
        </button>
      ) : null}
    </div>
  );
}

function AutoPlayVideo({ src, style, onTime, onState }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const p = v.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      controls
      style={style}
      onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}
      onPlay={onState ? (e) => onState({ playing: true, muted: e.currentTarget.muted }) : undefined}
      onPause={onState ? (e) => onState({ playing: false, muted: e.currentTarget.muted }) : undefined}
      onVolumeChange={onState ? (e) => onState({ playing: !e.currentTarget.paused, muted: e.currentTarget.muted }) : undefined}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

const EMOJI_SET = new Set(['😀','😂','❤️','👍','👎','🎉','😍','😢','😮','🙏','🔥','💯','😡','🥰','👏','💪','😃','😄','😁','😆','😅','🤣','😊','😇','🙂','🙃','😉','😌','😘','😗','😙','😚','😋','😛','😜','😝','🤑','🤗','🤓','😎','🤡','🤠','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😤','😠','😶','😐','😑','😯','😦','😧','😲','😵','😳','😱','😨','😰','😥','🤤','😭','😓','😪','😴','🙄','🤔','🤥','😬','🤐','🤢','🤧','😷','🤒','🤕','😈','👿','👹','👺','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🥲','🤮','🥵','🥶','🥴','🤯','🥳','🧐','☺️','✌️','🤞','🖕','👌','🤙','👆','👇','👈','👉','☝️']);

function getTopEmojis(comments, max = 3) {
  if (!comments?.length) return [];
  const freq = {};
  for (const c of comments) {
    const t = c.commentText || c.comment || c.text || '';
    if (EMOJI_SET.has(t)) {
      freq[t] = (freq[t] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([emoji, count]) => ({ emoji, count }));
}

function linkify(text) {
  if (!text) return text;
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#1a6b3a', wordBreak: 'break-all' }}>{part}</a>
      : part
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return d.toLocaleDateString();
}

export default function PostCard({ post, onUpdate, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  // Robert's additions (Nov 6, 2026), same as the app: share a post to your own feed, and turn
  // comments on or off on your own post.
  const [shareOpen, setShareOpen] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareType, setShareType] = useState('Public');
  const [shareGroups, setShareGroups] = useState(null);
  const [shareGroupId, setShareGroupId] = useState('');
  const [commentsOn, setCommentsOn] = useState(String(post?.commentOnOff ?? true) !== 'false');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const emojiRef = useRef(null);

  const myId = useSelector((s) => s.authReducer.getProfileData?._id);
  const token = useSelector((s) => s.authReducer.login_access_token);

  const author = post?.postAuthor || post?.Author || {};
  const authorName = firstName(author?.fullName);
  const isOnline = author?.isOnline === 1;
  const isMyPost = myId && (author?._id === myId || post?.postAuthor?._id === myId);

  const topEmojis = getTopEmojis(post.Comments);

  const profileThumb = normalizeImg(author?.imageURL) || null;
  const postImage = normalizeImg(post?.imageURL) || null;
  const postVideo = post?.videoURL ? normalizeImg(post.videoURL) : null;
  // The community feed comes from the .NET server, which returns new fields inside "ExtraElements".
  const postOverlay = parseOverlay(post?.postOverlay || post?.ExtraElements?.postOverlay);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiOpen(false);
      }
    };
    if (emojiOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emojiOpen]);

  const handleEmojiReact = async (emoji) => {
    setEmojiOpen(false);
    // Optimistically update the Comments array so emoji count shows immediately
    const optimisticComment = { commentText: emoji, _id: Date.now().toString() };
    const updatedComments = [...(post.Comments || []), optimisticComment];
    if (onUpdate) {
      onUpdate({ ...post, Comments: updatedComments, totalComment: (post.totalComment || 0) + 1 });
    }
    try {
      await addComment(post._id, emoji);
    } catch {
      // revert on failure
      if (onUpdate) onUpdate(post);
    }
  };

  const handleLike = async () => {
    const newIsLike = !post.isLike;
    const updated = { ...post, isLike: newIsLike };
    updated.totalLike = newIsLike ? (post.totalLike || 0) + 1 : Math.max((post.totalLike || 0) - 1, 0);
    if (newIsLike && post.isDislike) {
      updated.isDislike = false;
      updated.totalDislike = Math.max((post.totalDislike || 0) - 1, 0);
    }
    onUpdate(updated);
    try {
      const formData = new FormData();
      formData.append('postId', post._id);
      formData.append('isLike', newIsLike);
      const res = await nodeApi.post(MY_POST_LIKE, formData);
      if (res.data?.statusCode !== 200) onUpdate(post);
    } catch {
      onUpdate(post);
    }
  };

  const handleDislike = async () => {
    const newIsDislike = !post.isDislike;
    const updated = { ...post, isDislike: newIsDislike };
    updated.totalDislike = newIsDislike ? (post.totalDislike || 0) + 1 : Math.max((post.totalDislike || 0) - 1, 0);
    if (newIsDislike && post.isLike) {
      updated.isLike = false;
      updated.totalLike = Math.max((post.totalLike || 0) - 1, 0);
    }
    onUpdate(updated);
    try {
      const formData = new FormData();
      formData.append('postId', post._id);
      formData.append('isDislike', newIsDislike);
      const res = await nodeApi.post(MY_POST_DISLIKE, formData);
      if (res.data?.statusCode !== 200) onUpdate(post);
    } catch {
      onUpdate(post);
    }
  };

  // ── Delete post ──────────────────────────────────────────
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('postId', post._id);
      const res = await nodeApi.post(DELETE_MY_POST, fd);
      if (res.data?.statusCode === 200) {
        if (onDelete) onDelete(post._id);
      } else {
        alert(res.data?.message || 'Failed to delete post');
      }
    } catch {
      alert('Failed to delete post');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit post ────────────────────────────────────────────
  const startEdit = () => {
    const words = post.postContent || post.postTitle || '';
    setEditText(words === '..' ? '' : words);
    setEditing(true);
    setMenuOpen(false);
  };

  const handleSaveEdit = async (overlayText) => {
    const words = editText.trim();
    if (!words && !post.videoURL && !post.imageURL?.original) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('postId', post._id);
      fd.append('postTitle', words || '..');
      fd.append('postContent', words || '..');
      fd.append('isMediaFileUploaded', 'false');
      fd.append('isMediaTypeVideo', 'false');
      // Fix (Nov 6, 2026): keep the post's audience (the app had the same fix on Oct 31); without it the
      // server saves it blank and the post disappears from the feeds.
      fd.append('postType', post.postType || 'Public');
      if (typeof overlayText === 'string') fd.append('postOverlay', overlayText);
      const res = await nodeApi.post(UPDATE_POST, fd);
      if (res.data?.statusCode === 200) {
        onUpdate({
          ...post,
          postContent: words || '..',
          postTitle: words || '..',
          ...(typeof overlayText === 'string' ? { postOverlay: overlayText, ExtraElements: { ...(post.ExtraElements || {}), postOverlay: overlayText } } : {}),
        });
        setEditing(false);
      } else {
        alert(res.data?.message || 'Failed to edit post');
      }
    } catch {
      alert('Failed to edit post');
    } finally {
      setSaving(false);
    }
  };

  // ── Share post ───────────────────────────────────────────
  // Groups I belong to, for "Share in a group" (same as the app's "Share Post on your Groups").
  const loadShareGroups = async () => {
    if (shareGroups) return;
    try {
      const res = await dotnetApi.post('/Group/GetGroupsList', { authorization: token });
      const find = (o, d = 0) => {
        if (d > 3) return null;
        if (Array.isArray(o) && o.length && typeof o[0] === 'object') return o;
        if (o && typeof o === 'object' && !Array.isArray(o)) for (const v of Object.values(o)) { const f = find(v, d + 1); if (f) return f; }
        return null;
      };
      setShareGroups(find(res.data) || []);
    } catch {
      setShareGroups([]);
    }
  };

  // Four plain choices, same as the app (Robert, Nov 8, 2026): Public feed, Friends' feed, one of my Groups, Copy link.
  const handleShareToFeed = async (typeArg, groupArg) => {
    const useType = typeArg || shareType;
    const useGroup = groupArg !== undefined ? groupArg : shareGroupId;
    try {
      const res = await dotnetApi.post(SHARE_POST, {
        ...(useGroup ? { groupId: useGroup } : {}),
        authorization: token,
        imageUrl: post.imageURL?.original || null,
        imageThumbnail: null,
        videoUrl: post.videoURL || null,
        videoThumbnail: post.videoThumbnailUrl?.original || null,
        postTitle: shareText.trim() || (post.postTitle && post.postTitle !== '..' ? post.postTitle : null),
        postContent: shareText.trim() || (post.postContent && post.postContent !== '..' ? post.postContent : null),
        postType: useType,
        postOwnerId: post.postAuthor?._id || null,
        postOwnerName: post.postAuthor?.fullName || null,
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      if (code === 200 || code === undefined) {
        setShareOpen(false);
        setShareText('');
        alert(useGroup ? 'Shared in your group.' : useType === 'Public'
          ? "Shared to the Public feed. Everyone can see it in Everyone's Posts. It is also in My Posts on your profile."
          : "Shared to your Friends' feed. Your friends can see it in My Friends' Posts. It is also in My Posts on your profile.");
        setShareGroupId('');
      } else {
        alert(res.data?.Message || res.data?.message || 'Failed to share');
      }
    } catch {
      alert('Failed to share');
    }
  };

  const toggleComments = async () => {
    setMenuOpen(false);
    const next = !commentsOn;
    try {
      const fd = new FormData();
      fd.append('commentOnOff', next ? 'true' : 'false');
      fd.append('postId', post._id);
      await nodeApi.post(CHANGE_COMMENT_VALUE, fd);
      setCommentsOn(next);
    } catch {
      alert('Could not change comments');
    }
  };

  const handleShare = async () => {
    const url = `https://friendlinq.com/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Post link copied to clipboard');
    } catch {
      alert('Could not copy link: ' + url);
    }
  };

  // ── Report post ──────────────────────────────────────────
  const handleReport = async () => {
    setMenuOpen(false);
    if (!window.confirm('Report this post as inappropriate?')) return;
    try {
      const res = await dotnetApi.post(REPORT_POST, {
        authorization: token,
        postId: post._id,
        userId: author._id,
        sensitive: true,
      });
      if ((res.data?.StatusCode ?? res.data?.statusCode) === 200) {
        alert('Post reported. Thank you.');
      } else {
        alert('Failed to report post');
      }
    } catch {
      alert('Failed to report post');
    }
  };

  if (post?.groupId) return null;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.profilePicWrap, cursor: isMyPost ? 'default' : 'pointer' }} onClick={() => !isMyPost && author?._id && navigate(`/user/${author._id}`)}>
          {profileThumb ? (
            <img src={profileThumb} alt="" style={styles.profilePic} />
          ) : (
            <div style={styles.profilePicPlaceholder}>
              <span style={{ color: '#999', fontSize: 18 }}>?</span>
            </div>
          )}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.nameRow}>
            <span style={{ ...styles.authorName, cursor: isMyPost ? 'default' : 'pointer' }} onClick={() => !isMyPost && author?._id && navigate(`/user/${author._id}`)}>{authorName}</span>
            <span style={{
              display: 'inline-block',
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: isOnline ? 'limegreen' : 'grey',
              marginLeft: 6, verticalAlign: 'middle',
            }} />
          </div>
          <span style={styles.timestamp}>{timeAgo(post.updatedAt)}</span>
        </div>
        <div ref={menuRef} style={{ marginLeft: 'auto', position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
            <BsThreeDotsVertical size={18} color="#888" />
          </button>
          {menuOpen && (
            <div style={styles.menuDropdown}>
              {isMyPost ? (
                <>
                  <div style={styles.menuItem} onClick={startEdit}>
                    Edit Post
                  </div>
                  <div style={styles.menuItem} onClick={toggleComments}>
                    {commentsOn ? 'Turn comments off' : 'Turn comments on'}
                  </div>
                  <div
                    style={{ ...styles.menuItem, color: '#d32f2f' }}
                    onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }}
                  >
                    Delete Post
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.menuItem} onClick={() => { setMenuOpen(false); author?._id && navigate(`/user/${author._id}`); }}>
                    View Profile
                  </div>
                  <div style={styles.menuItem} onClick={handleReport}>
                    Report this Post
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post text or edit mode */}
      {editing ? (
        <div style={{ padding: '8px 14px' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={styles.editTextarea}
            rows={3}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            {post.videoURL && (
              <button style={{ ...styles.editCancelBtn, marginRight: 'auto' }} onClick={() => setShowTextEditor(true)} disabled={saving}>
                Aa Text, captions and voice on video
              </button>
            )}
            <button style={styles.editCancelBtn} onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
            <button style={styles.editSaveBtn} onClick={() => handleSaveEdit()} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        post.postContent && post.postContent !== '..' && (
          <p style={styles.postText}>{linkify(post.postContent)}</p>
        )
      )}

      {showTextEditor && (
        <VideoTextEditor
          open={showTextEditor}
          videoSrc={postVideo}
          postId={post._id}
          initial={postOverlay}
          onCancel={() => setShowTextEditor(false)}
          onDone={(o) => { setShowTextEditor(false); handleSaveEdit(overlayToString(o)); }}
        />
      )}

      {/* Post image */}
      {postImage && !postVideo && (
        <img
          src={postImage} alt="post" style={styles.postImage}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Post video */}
      {postVideo && !postOverlay && (
        <AutoPlayVideo src={postVideo} style={styles.postImage} />
      )}
      {postVideo && postOverlay && (
        <VideoWithOverlay src={postVideo} overlay={postOverlay} />
      )}

      {/* Like/emoji/comment summary */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryLeft}>
          {(post.totalLike > 0) && (
            <span style={styles.summaryBadge}>
              <AiFillLike size={14} color="#1877f2" /> {post.totalLike}
            </span>
          )}
          {(post.totalDislike > 0) && (
            <span style={styles.summaryBadge}>
              <AiFillDislike size={14} color="#e04040" /> {post.totalDislike}
            </span>
          )}
          {topEmojis.map((e) => (
            <span key={e.emoji} style={styles.summaryBadge}>
              <span style={{ fontSize: 16 }}>{e.emoji}</span> {e.count}
            </span>
          ))}
        </div>
        <span style={styles.commentCount}>
          {post.Comments?.length || post.totalComment || 0} Comments
        </span>
      </div>

      {/* Action buttons */}
      <div style={styles.actionRow}>
        <button onClick={handleLike} style={styles.actionBtn}>
          {post.isLike
            ? <AiFillLike size={22} color="#e84393" />
            : <AiOutlineLike size={22} color="#888" />}
          <span style={{ marginLeft: 6, color: post.isLike ? '#e84393' : '#888', fontWeight: 600, fontSize: 13 }}>
            {post.totalLike ?? 0}
          </span>
        </button>
        <button onClick={handleDislike} style={styles.actionBtn}>
          {post.isDislike
            ? <AiFillDislike size={22} color="#e84393" />
            : <AiOutlineDislike size={22} color="#888" />}
          <span style={{ marginLeft: 6, color: post.isDislike ? '#e84393' : '#888', fontWeight: 600, fontSize: 13 }}>
            {post.totalDislike ?? 0}
          </span>
        </button>
        <div ref={emojiRef} style={{ flex: 1, position: 'relative', display: 'flex' }}>
          <button style={styles.actionBtn} onClick={() => setEmojiOpen(!emojiOpen)}>
            <BsEmojiSmile size={20} color="#888" />
          </button>
          {emojiOpen && (
            <div style={styles.emojiPicker}>
              {['😀','😂','❤️','👍','👎','🎉','😍','😢','😮','🙏','🔥','💯','😡','🥰','👏','💪'].map((emoji) => (
                <button key={emoji} style={styles.emojiBtn} onClick={() => handleEmojiReact(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          style={{ ...styles.actionBtn, ...(commentsOn ? {} : { opacity: 0.4, cursor: 'default' }) }}
          title={commentsOn ? 'Comments' : 'Comments are turned off for this post'}
          onClick={() => commentsOn && navigate(`/comments/${post._id}`)}
        >
          <AiOutlineComment size={22} color="#888" />
          <span style={{ marginLeft: 6, color: '#888', fontWeight: 600, fontSize: 13 }}>
            {post.Comments?.length || post.totalComment || 0}
          </span>
        </button>
        <button style={styles.actionBtn} onClick={() => { setShareOpen((v) => !v); loadShareGroups(); }} title="Share">
          <FaShare size={18} color="#888" />
        </button>
      </div>
      {shareOpen && (
        <div style={{ padding: '8px 14px 12px', borderTop: '1px solid #eee' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Share this post</div>
          <textarea value={shareText} onChange={(e) => setShareText(e.target.value)} placeholder="Say something about this (optional)" rows={2} style={styles.editTextarea} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
            <button style={styles.editSaveBtn} onClick={() => handleShareToFeed('Public', '')}>Share to the Public feed</button>
            <button style={styles.editSaveBtn} onClick={() => handleShareToFeed('Friend_Only', '')}>Share to my Friends' feed</button>
            <select value={shareGroupId} onChange={(e) => { const g = e.target.value; setShareGroupId(g); if (g) handleShareToFeed('Public', g); }} style={{ fontSize: 14, padding: 6, borderRadius: 6 }}>
              <option value="">Share to one of my Groups...</option>
              {(shareGroups || []).map((g) => <option key={g._id} value={g._id}>{g.groupName}</option>)}
            </select>
            <button style={styles.editCancelBtn} onClick={() => { setShareOpen(false); handleShare(); }}>Copy link to this post</button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 12px', color: '#333' }}>Delete Post?</h3>
            <p style={{ color: '#666', marginBottom: 20 }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={styles.editCancelBtn} onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button
                style={{ ...styles.editSaveBtn, backgroundColor: '#d32f2f' }}
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 8px',
  },
  profilePicWrap: {
    width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
  },
  profilePic: {
    width: 42, height: 42, borderRadius: '50%', objectFit: 'cover',
  },
  profilePicPlaceholder: {
    width: 42, height: 42, borderRadius: '50%', backgroundColor: '#eee',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 10, display: 'flex', flexDirection: 'column',
  },
  nameRow: {
    display: 'flex', alignItems: 'center',
  },
  authorName: {
    fontWeight: 600, fontSize: 14, color: '#222',
  },
  timestamp: {
    fontSize: 11, color: '#888', marginTop: 1,
  },
  menuBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 6,
  },
  menuDropdown: {
    position: 'absolute', right: 0, top: 30, backgroundColor: '#fff',
    border: '1px solid #ddd', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10, minWidth: 160,
  },
  menuItem: {
    padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#333',
  },
  postText: {
    padding: '4px 14px 8px', margin: 0, fontSize: 14, lineHeight: 1.5,
    color: '#222', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
  },
  postImage: {
    width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block',
  },
  overlayFrame: {
    position: 'relative', width: '100%', maxWidth: 340, aspectRatio: '9 / 16', margin: '0 auto', background: '#000', overflow: 'hidden',
  },
  overlayVideo: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px 4px',
  },
  summaryLeft: {
    display: 'flex', gap: 10,
  },
  summaryBadge: {
    display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#555',
  },
  commentCount: {
    fontSize: 12, color: '#555',
  },
  actionRow: {
    display: 'flex', borderTop: '1px solid #eee', padding: '4px 8px',
  },
  actionBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
  },
  editTextarea: {
    width: '100%', boxSizing: 'border-box', border: '1px solid #ddd',
    borderRadius: 6, padding: '8px 10px', fontSize: 14, resize: 'vertical',
    outline: 'none', fontFamily: 'inherit',
  },
  editCancelBtn: {
    padding: '8px 20px', borderRadius: 6, border: '1px solid #ccc',
    background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  },
  editSaveBtn: {
    padding: '8px 20px', borderRadius: 6, border: 'none',
    backgroundColor: '#1a6b3a', color: '#fff', cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
  },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24, maxWidth: 360, width: '90%',
  },
  emojiPicker: {
    position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
    backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 10,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: 10,
    display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4,
    zIndex: 20, width: 280,
  },
  emojiBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 22,
    padding: 4, borderRadius: 6, lineHeight: 1,
  },
};
