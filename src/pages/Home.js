import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { nodeApi, dotnetApi } from '../api/axios';
import { GET_ALL_USERS_POST, GET_PUBLIC_POST } from '../api/config';
import PostCard from '../components/posts/PostCard';
import { AiOutlineCamera, AiOutlineVideoCamera, AiOutlineClose } from 'react-icons/ai';
import { MdVideocam } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { createPost, notifyFriends } from '../actions/post_actions';

const LIMIT = 20;

export default function Home() {
  const profile = useSelector((s) => s.authReducer.getProfileData);
  const token = useSelector((s) => s.authReducer.login_access_token);
  const userType = useSelector((s) => s.authReducer.userType);

  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState('community'); // 'community' (PublicPost) or 'friends'
  const [postText, setPostText] = useState('');
  const [privacyForPost, setPrivacyForPost] = useState('Public'); // 'Public' or 'Friend_Only'
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  // Profile photo — auth_actions already converts imageURL to a full URL string
  const profilePic = profile?.imageURL || '';

  // ── Fetch posts ──────────────────────────────────────────
  const fetchPosts = useCallback(async (skipVal, append = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      let res;
      if (feedType === 'community') {
        // .NET server — JSON body with auth in body
        res = await dotnetApi.post(GET_PUBLIC_POST, {
          authorization: token,
          Skip: skipVal,
          Limit: LIMIT,
        });
      } else {
        // Node server — FormData with auth in header (axios interceptor adds it)
        const formData = new FormData();
        formData.append('skip', skipVal);
        formData.append('limit', LIMIT);
        res = await nodeApi.post(GET_ALL_USERS_POST, formData);
      }

      const data = res.data;
      if ((data?.statusCode ?? data?.StatusCode) === 200) {
        let newPosts = data?.data?.myPost || data?.data?.myPosts || data?.Data?.myPost || [];

        // .NET PublicPost returns postAuthor as a string ID and Author as the object — normalize
        newPosts = newPosts.map((p) => {
          if (p.Author && typeof p.Author === 'object' && typeof p.postAuthor !== 'object') {
            return { ...p, postAuthor: p.Author };
          }
          return p;
        });

        const totalCount = data?.data?.totalMyPost ?? data?.Data?.totalMyPost ?? 0;
        setTotal(totalCount);

        if (append) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setSkip(skipVal + LIMIT);
      }
    } catch (err) {
      console.error('Feed fetch error:', err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [feedType, token]);

  // Initial load & feed toggle
  useEffect(() => {
    setPosts([]);
    setSkip(0);
    setTotal(0);
    fetchPosts(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  // ── Infinite scroll via IntersectionObserver ──────────────
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && skip < total && !loadingRef.current) {
          fetchPosts(skip, true);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [skip, total, fetchPosts]);

  // ── Update a single post in-place (for like/dislike) ──────
  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // ── Media picker ─────────────────────────────────────────
  const handleMediaSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit post ─────────────────────────────────────────
  const handleCreatePost = async () => {
    if (!postText.trim() && !mediaFile) return;
    setPosting(true);
    try {
      // RN app uses exact strings: "Public" or "Friend_Only"
      const postType = privacyForPost; // already "Public" or "Friend_Only"

      const res = await createPost({
        postTitle: postText.trim(),
        postContent: postText.trim(),
        postType,
        mediaFile: mediaFile || null,
        isdating: userType === 'dating' ? '1' : '0',
      });

      if (res?.statusCode === 200) {
        setPostText('');
        clearMedia();
        // Refresh feed
        setPosts([]);
        setSkip(0);
        setTotal(0);
        fetchPosts(0, false);

        // Notify friends in background
        const newPostId = res.data?.postData?._id || res.data?._id;
        if (newPostId) {
          notifyFriends(token, newPostId, profile?.fullName || '');
        }
      } else {
        alert(res?.message || 'Failed to create post');
      }
    } catch (err) {
      alert('Error creating post');
    } finally {
      setPosting(false);
    }
  };

  // ── Toggle feed ──────────────────────────────────────────
  const toggleFeed = () => {
    setFeedType((f) => (f === 'community' ? 'friends' : 'community'));
  };

  return (
    <div style={styles.container}>
      <div style={styles.feed}>
        {/* ── Post Composer ─────────────────────────────────── */}
        <div style={styles.composerCard}>
          <div style={styles.composerRow}>
            <div style={styles.composerPicWrap}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={styles.composerPic} />
              ) : (
                <div style={styles.composerPicPlaceholder}>
                  {(profile?.fullName || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="What's on your mind."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              style={styles.composerInput}
            />
            <button
              style={{
                ...styles.postBtn,
                color: (postText || mediaFile) ? '#e84393' : '#aaa',
              }}
              disabled={(!postText && !mediaFile) || posting}
              onClick={handleCreatePost}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {/* Radio toggle: Friends / Community */}
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="postPrivacy"
                value="Friend_Only"
                checked={privacyForPost === 'Friend_Only'}
                onChange={() => setPrivacyForPost('Friend_Only')}
                style={styles.radioInput}
              />
              Friends
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="postPrivacy"
                value="Public"
                checked={privacyForPost === 'Public'}
                onChange={() => setPrivacyForPost('Public')}
                style={styles.radioInput}
              />
              Community
            </label>
          </div>

          {/* Media preview */}
          {mediaPreview && (
            <div style={styles.mediaPreviewWrap}>
              {mediaFile?.type?.startsWith('video') ? (
                <video src={mediaPreview} controls style={styles.mediaPreview} />
              ) : (
                <img src={mediaPreview} alt="Preview" style={styles.mediaPreview} />
              )}
              <button onClick={clearMedia} style={styles.clearMediaBtn}>
                <AiOutlineClose size={16} />
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleMediaSelect}
            style={{ display: 'none' }}
          />

          {/* Photo / Video / See Friends Posts action bar */}
          <div style={styles.actionBar}>
            <div style={styles.actionBarLeft}>
              <button style={styles.mediaBtn} onClick={() => { fileInputRef.current.accept = 'image/*'; fileInputRef.current.click(); }}>
                <AiOutlineCamera size={18} />
                <span style={{ marginLeft: 4 }}>Photo</span>
              </button>
              <button style={styles.mediaBtn} onClick={() => { fileInputRef.current.accept = 'video/*'; fileInputRef.current.click(); }}>
                <AiOutlineVideoCamera size={18} color="#1a6b3a" />
                <span style={{ marginLeft: 4 }}>Video</span>
              </button>
              {/* Go Live button — hidden for now, route still works at /live/:channelName?host=1 */}
            </div>
            <button onClick={toggleFeed} style={styles.feedToggleBtn}>
              {feedType === 'community' ? 'See Friends Posts' : 'Feed'}
            </button>
          </div>
        </div>

        {/* ── Feed ──────────────────────────────────────────── */}
        {posts.map((post, idx) => (
          <PostCard
            key={post._id || idx}
            post={post}
            onUpdate={handlePostUpdate}
          />
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {loading && (
          <div style={styles.loadingRow}>Loading...</div>
        )}

        {!loading && posts.length === 0 && (
          <div style={styles.emptyRow}>No posts to show</div>
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
  feed: {
    width: '100%',
    maxWidth: 600,
  },
  composerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    padding: '12px 14px',
  },
  composerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  composerPicWrap: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  composerPic: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  composerPicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  composerInput: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 14,
    outline: 'none',
  },
  postBtn: {
    background: 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  radioRow: {
    display: 'flex',
    gap: 16,
    marginLeft: 52,
    marginTop: 8,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    cursor: 'pointer',
    color: '#333',
  },
  radioInput: {
    accentColor: '#1a6b3a',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTop: '1px solid #eee',
    paddingTop: 8,
  },
  actionBarLeft: {
    display: 'flex',
    gap: 8,
  },
  mediaBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#555',
    padding: '4px 8px',
  },
  feedToggleBtn: {
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  loadingRow: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
    fontSize: 14,
  },
  emptyRow: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 15,
  },
  mediaPreviewWrap: {
    position: 'relative',
    margin: '8px 0',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #eee',
  },
  mediaPreview: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'cover',
    display: 'block',
  },
  clearMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};
