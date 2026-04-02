import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nodeApi } from '../../api/axios';
import { MY_POST_LIKE, MY_POST_DISLIKE } from '../../api/config';
import {
  AiOutlineLike, AiFillLike,
  AiOutlineDislike, AiFillDislike,
  AiOutlineComment, AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import normalizeImg from '../../utils/normalizeImg';

const BASE_IMAGE = 'https://natural.friendlinq.com';

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

export default function PostCard({ post, onUpdate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const author = post?.postAuthor || post?.Author || {};
  const authorName = author?.fullName || 'Unknown';
  const isOnline = author?.isOnline === 1;

  const profileThumb = normalizeImg(author?.imageURL) || null;

  const postImage = normalizeImg(post?.imageURL) || null;

  const postVideo = post?.videoURL
    ? normalizeImg(post.videoURL)
    : null;

  const handleLike = async () => {
    const newIsLike = !post.isLike;
    // Optimistic update
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
      if (res.data?.statusCode !== 200) {
        onUpdate(post); // revert
      }
    } catch {
      onUpdate(post); // revert
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
      if (res.data?.statusCode !== 200) {
        onUpdate(post);
      }
    } catch {
      onUpdate(post);
    }
  };

  if (post?.groupId) return null;

  return (
    <div style={styles.card}>
      {/* Header: profile photo, name, online dot, timestamp, 3-dot menu */}
      <div style={styles.header}>
        <div style={styles.profilePicWrap}>
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
            <span style={styles.authorName}>{authorName}</span>
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isOnline ? 'limegreen' : 'grey',
              marginLeft: 6,
              verticalAlign: 'middle',
            }} />
          </div>
          <span style={styles.timestamp}>{timeAgo(post.updatedAt)}</span>
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuBtn}
          >
            <BsThreeDotsVertical size={18} color="#888" />
          </button>
          {menuOpen && (
            <div style={styles.menuDropdown}>
              <div
                style={styles.menuItem}
                onClick={() => { setMenuOpen(false); }}
              >
                Report this Post
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post text */}
      {post.postContent && post.postContent !== '..' && (
        <p style={styles.postText}>{post.postContent}</p>
      )}

      {/* Post image */}
      {postImage && !postVideo && (
        <img
          src={postImage}
          alt="post"
          style={styles.postImage}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Post video */}
      {postVideo && (
        <video
          src={postVideo}
          controls
          style={styles.postImage}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Like/comment summary row */}
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

      {/* Action buttons: like, dislike, comment, share */}
      <div style={styles.actionRow}>
        <button onClick={handleLike} style={styles.actionBtn}>
          {post.isLike
            ? <AiFillLike size={22} color="#e84393" />
            : <AiOutlineLike size={22} color="#888" />
          }
          <span style={{ marginLeft: 6, color: post.isLike ? '#e84393' : '#888', fontWeight: 600, fontSize: 13 }}>
            {post.totalLike ?? 0}
          </span>
        </button>

        <button onClick={handleDislike} style={styles.actionBtn}>
          {post.isDislike
            ? <AiFillDislike size={22} color="#e84393" />
            : <AiOutlineDislike size={22} color="#888" />
          }
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
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 8px',
  },
  profilePicWrap: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  profilePic: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  profilePicPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: 600,
    fontSize: 14,
    color: '#222',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
  },
  menuDropdown: {
    position: 'absolute',
    right: 0,
    top: 30,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10,
    minWidth: 160,
  },
  menuItem: {
    padding: '10px 16px',
    fontSize: 13,
    cursor: 'pointer',
    color: '#333',
  },
  postText: {
    padding: '4px 14px 8px',
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
    color: '#222',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  postImage: {
    width: '100%',
    maxHeight: 500,
    objectFit: 'cover',
    display: 'block',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px 4px',
  },
  summaryLeft: {
    display: 'flex',
    gap: 10,
  },
  summaryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#555',
  },
  commentCount: {
    fontSize: 12,
    color: '#555',
  },
  actionRow: {
    display: 'flex',
    borderTop: '1px solid #eee',
    padding: '4px 8px',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 0',
  },
};
