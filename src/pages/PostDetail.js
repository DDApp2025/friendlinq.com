import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { nodeApi } from '../api/axios';
import { GET_POST_DETAIL } from '../api/config';
import { getComments, addComment } from '../actions/post_actions';
import PostCard from '../components/posts/PostCard';
import normalizeImg from '../utils/normalizeImg';
import { firstName } from '../utils/displayName';
import { AiOutlineArrowLeft, AiOutlineSend, AiOutlineDelete } from 'react-icons/ai';

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

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const profile = useSelector((s) => s.authReducer.getProfileData);
  const myUserId = profile?._id || '';
  const profilePic = profile?.imageURL || '';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append('postId', postId);
        const res = await nodeApi.post(GET_POST_DETAIL, fd);
        if (res.data?.statusCode === 200 && res.data?.data?.postDetails) {
          setPost(res.data.data.postDetails);
        } else {
          setError('Post not found');
        }
      } catch {
        setError('Failed to load post');
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    const res = await getComments(postId);
    if (res?.statusCode === 200) {
      setComments(res.data?.commentData || res.data?.comments || res.data || []);
    }
    setCommentsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const res = await addComment(postId, text.trim());
    if (res?.statusCode === 200) {
      setText('');
      fetchComments();
    } else {
      alert(res?.message || 'Failed to add comment');
    }
    setSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.page}>
        <div style={styles.header}>
          <button onClick={() => navigate('/home')} style={styles.backBtn}>
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 style={styles.title}>Post</h2>
        </div>

        {loading && <div style={styles.msg}>Loading post...</div>}
        {error && <div style={styles.msg}>{error}</div>}
        {post && (
          <PostCard
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
          />
        )}

        {/* Comments section */}
        {post && (
          <div style={styles.commentsSection}>
            <h3 style={styles.commentsTitle}>Comments ({comments.length})</h3>

            {commentsLoading && <div style={styles.msg}>Loading comments...</div>}

            {!commentsLoading && comments.length === 0 && (
              <div style={styles.msg}>No comments yet. Be the first!</div>
            )}

            {comments.map((c) => {
              const author = c.commentAuthor || c.author || {};
              const authorName = firstName(author.fullName);
              const authorPic = normalizeImg(author.imageURL) || '';
              const isOwn = (author._id || author.userId) === myUserId;

              return (
                <div key={c._id} style={styles.commentCard}>
                  <div style={styles.commentPicWrap}>
                    {authorPic ? (
                      <img src={authorPic} alt="" style={styles.commentPic} />
                    ) : (
                      <div style={styles.commentPicPlaceholder}>
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.commentBubble}>
                      <span style={styles.commentAuthor}>{authorName}</span>
                      <span style={styles.commentText}>{c.commentText || c.comment || c.text}</span>
                    </div>
                    <span style={styles.commentTime}>{timeAgo(c.createdAt || c.updatedAt)}</span>
                  </div>
                </div>
              );
            })}

            {/* Comment input */}
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
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />
              <button
                onClick={handleAddComment}
                disabled={!text.trim() || submitting}
                style={{ ...styles.sendBtn, opacity: text.trim() && !submitting ? 1 : 0.4 }}
              >
                <AiOutlineSend size={20} />
              </button>
            </div>
          </div>
        )}
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
  msg: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
    fontSize: 14,
  },
  commentsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 12,
    padding: '16px 14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  commentsTitle: {
    margin: '0 0 12px',
    fontSize: 16,
    fontWeight: 700,
    color: '#222',
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
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 0 0',
    borderTop: '1px solid #ddd',
    marginTop: 12,
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
