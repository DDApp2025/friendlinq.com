import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { nodeApi, dotnetApi } from '../../api/axios';
import { MY_POST_LIKE, MY_POST_DISLIKE, DELETE_MY_POST, UPDATE_POST, REPORT_POST } from '../../api/config';
import {
  AiOutlineLike, AiFillLike,
  AiOutlineDislike, AiFillDislike,
  AiOutlineComment, AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import normalizeImg from '../../utils/normalizeImg';

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
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const myId = useSelector((s) => s.authReducer.getProfileData?._id);
  const token = useSelector((s) => s.authReducer.login_access_token);

  const author = post?.postAuthor || post?.Author || {};
  const authorName = author?.fullName || 'Unknown';
  const isOnline = author?.isOnline === 1;
  const isMyPost = myId && (author?._id === myId || post?.postAuthor?._id === myId);

  const profileThumb = normalizeImg(author?.imageURL) || null;
  const postImage = normalizeImg(post?.imageURL) || null;
  const postVideo = post?.videoURL ? normalizeImg(post.videoURL) : null;

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
    setEditText(post.postContent || post.postTitle || '');
    setEditing(true);
    setMenuOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('postId', post._id);
      fd.append('postTitle', editText.trim());
      fd.append('postContent', editText.trim());
      fd.append('isMediaFileUploaded', 'false');
      fd.append('isMediaTypeVideo', 'false');
      const res = await nodeApi.post(UPDATE_POST, fd);
      if (res.data?.statusCode === 200) {
        onUpdate({ ...post, postContent: editText.trim(), postTitle: editText.trim() });
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
            <button style={styles.editCancelBtn} onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
            <button style={styles.editSaveBtn} onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        post.postContent && post.postContent !== '..' && (
          <p style={styles.postText}>{post.postContent}</p>
        )
      )}

      {/* Post image */}
      {postImage && !postVideo && (
        <img
          src={postImage} alt="post" style={styles.postImage}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Post video */}
      {postVideo && (
        <video
          src={postVideo} controls style={styles.postImage}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Like/comment summary */}
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
        <button style={styles.actionBtn} onClick={() => navigate(`/comments/${post._id}`)}>
          <AiOutlineComment size={22} color="#888" />
          <span style={{ marginLeft: 6, color: '#888', fontWeight: 600, fontSize: 13 }}>
            {post.Comments?.length || post.totalComment || 0}
          </span>
        </button>
        <button style={styles.actionBtn}>
          <AiOutlineShareAlt size={22} color="#888" />
        </button>
      </div>

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
};
