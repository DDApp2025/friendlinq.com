import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getComments, addComment, deleteComment, editComment } from '../actions/post_actions';
import normalizeImg from '../utils/normalizeImg';
import { AiOutlineArrowLeft, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai';
import { firstName } from '../utils/displayName';

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

export default function Comments() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const profile = useSelector((s) => s.authReducer.getProfileData);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Robert's additions (Nov 6, 2026): reply to a comment and edit your own comment, like the app.
  const [replyTo, setReplyTo] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const profilePic = profile?.imageURL || '';
  const myUserId = profile?._id || profile?.userId || '';

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const res = await getComments(postId);
    if (res?.statusCode === 200) {
      const list = res.data?.commentData || res.data?.comments || res.data || [];
      // Replies arrive inside their comment (childComment); show only top comments at the top level.
      setComments(Array.isArray(list) ? list.filter((c) => !c.parentId) : []);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAdd = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const res = await addComment(postId, text.trim(), replyTo?._id);
    if (res?.statusCode === 200) {
      setText('');
      setReplyTo(null);
      fetchComments();
    } else {
      alert(res?.message || 'Failed to add comment');
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    const res = await deleteComment(commentId, postId);
    if (res?.statusCode === 200) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else {
      alert(res?.message || 'Failed to delete comment');
    }
  };

  const handleSaveEdit = async (c) => {
    const t = editText.trim();
    if (t.length < 2) { alert('Please write at least 2 letters.'); return; }
    const res = await editComment(postId, c._id, t);
    if (res?.statusCode === 200) {
      setEditId(null);
      fetchComments();
    } else {
      alert(res?.message || 'Failed to edit comment');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 style={styles.title}>Comments</h2>
        </div>

        {/* Comments list */}
        <div style={styles.list}>
          {loading && <div style={styles.empty}>Loading comments...</div>}
          {!loading && comments.length === 0 && (
            <div style={styles.empty}>No comments yet. Be the first!</div>
          )}
          {comments.map((top) => [top, ...((top.childComment || []).map((r) => ({ ...r, _reply: true })))]).flat().map((c) => {
            const author = c.commentAuthor || c.author || {};
            const authorName = firstName(author.fullName);
            const authorPic = normalizeImg(author.imageURL) || '';
            const isOwn = (author._id || author.userId) === myUserId;

            return (
              <div key={c._id} style={{ ...styles.commentCard, ...(c._reply ? { marginLeft: 40 } : {}) }}>
                <div style={styles.commentPicWrap}>
                  {authorPic ? (
                    <img src={authorPic} alt="" style={styles.commentPic} />
                  ) : (
                    <div style={styles.commentPicPlaceholder}>
                      {(authorName || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={styles.commentBody}>
                  {editId === c._id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input value={editText} onChange={(e) => setEditText(e.target.value)} style={styles.input} autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(c); if (e.key === 'Escape') setEditId(null); }} />
                      <button style={styles.smallBtn} onClick={() => handleSaveEdit(c)}>Save</button>
                      <button style={styles.smallBtn} onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div style={styles.commentBubble}>
                      <span style={styles.commentAuthor}>{authorName}</span>
                      <span style={styles.commentText}>{c.commentText || c.comment || c.text}</span>
                    </div>
                  )}
                  <span style={styles.commentTime}>{timeAgo(c.createdAt || c.updatedAt)}</span>
                  {!c._reply && (
                    <button style={styles.linkBtn} onClick={() => setReplyTo(c)}>Reply</button>
                  )}
                  {isOwn && editId !== c._id && (
                    <button style={styles.linkBtn} onClick={() => { setEditId(c._id); setEditText(c.commentText || ''); }}>Edit</button>
                  )}
                </div>
                {isOwn && (
                  <button onClick={() => handleDelete(c._id)} style={styles.deleteBtn}>
                    <AiOutlineDelete size={16} color="#e04040" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {replyTo && (
          <div style={{ fontSize: 13, color: '#555', padding: '6px 0 0' }}>
            Replying to {firstName((replyTo.commentAuthor || {}).fullName)}{' '}
            <button style={styles.linkBtn} onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        )}
        {/* Input bar */}
        <div style={styles.inputBar}>
          <div style={styles.inputPicWrap}>
            {profilePic ? (
              <img src={profilePic} alt="" style={styles.inputPic} />
            ) : (
              <div style={styles.inputPicPlaceholder}>
                {firstName(profile?.fullName).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim() || submitting}
            style={{
              ...styles.sendBtn,
              opacity: text.trim() && !submitting ? 1 : 0.4,
            }}
          >
            <AiOutlineSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 12px',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 56px)',
  },
  page: {
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 88px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0 12px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#222',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 8,
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 14,
  },
  commentCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '8px 0',
  },
  commentPicWrap: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  commentPic: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  commentPicPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentBody: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#e4e6eb',
    borderRadius: 12,
    padding: '8px 12px',
    display: 'inline-block',
  },
  commentAuthor: {
    display: 'block',
    fontWeight: 600,
    fontSize: 13,
    color: '#222',
  },
  commentText: {
    display: 'block',
    fontSize: 14,
    color: '#333',
    marginTop: 2,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  commentTime: {
    fontSize: 11,
    color: '#888',
    marginLeft: 12,
    marginTop: 2,
    display: 'inline-block',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#1a6b3a',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0 6px',
  },
  smallBtn: {
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: 13,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    marginTop: 4,
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 0',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f0f2f5',
  },
  inputPicWrap: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  inputPic: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  inputPicPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    color: '#1a6b3a',
    display: 'flex',
    alignItems: 'center',
  },
};
