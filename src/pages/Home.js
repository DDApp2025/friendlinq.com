import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { nodeApi, dotnetApi } from '../api/axios';
import { GET_ALL_USERS_POST, GET_PUBLIC_POST } from '../api/config';
import PostCard from '../components/posts/PostCard';
import VideoTextEditor, { overlayToString } from '../components/posts/VideoTextEditor';
import { AiOutlineCamera, AiOutlineVideoCamera, AiOutlineClose } from 'react-icons/ai';
import { MdVideocam } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DatingHome from '../components/DatingHome';
import { createPost, notifyFriends } from '../actions/post_actions';
import { firstName } from '../utils/displayName';
import { isAudioFile } from '../components/posts/MusicPost';

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
  // Music posts (Nov 12, 2026): the cover picture chosen for a music file.
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const musicInputRef = useRef(null);
  const coverInputRef = useRef(null);
  // Robert's addition (Nov 6, 2026): the Aa editor (text, captions, voice) for a video being posted.
  const [postOverlay, setPostOverlay] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
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
        // Node server — use fetch() directly (matches mobile) to avoid CORS preflight
        const fd = new FormData();
        fd.append('skip', skipVal);
        fd.append('limit', LIMIT);
        const fetchRes = await fetch('https://natural.friendlinq.com' + GET_ALL_USERS_POST, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'authorization': token,
          },
          body: fd,
        });
        res = { data: await fetchRes.json() };
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

        // Filter by dating mode — same as RN friend_reducer.js:638
        const isDatingFilter = userType === 'dating' ? '1' : '0';
        newPosts = newPosts.filter((p) => (p.isdating || '0') === isDatingFilter);

        const totalCount = data?.data?.totalMyPost ?? data?.Data?.totalMyPost ?? 0;
        setTotal(totalCount);

        if (append) {
          // Skip posts already on screen (new posts added at the top by the 5-second check shift the pages)
          setPosts((prev) => {
            const seen = new Set(prev.map((p) => p._id));
            return [...prev, ...newPosts.filter((p) => !seen.has(p._id))];
          });
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
  }, [feedType, token, userType]);

  // Initial load & feed toggle & userType change
  useEffect(() => {
    setPosts([]);
    setSkip(0);
    setTotal(0);
    fetchPosts(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType, userType]);

  // ── Live updates: check for new posts every 5 seconds ──────
  // Same idea as the phone apps' Community feed reload. Reads the newest page only,
  // adds posts that are not on screen yet to the top, and refreshes counts on posts
  // already shown. Pauses while the browser tab is hidden.
  const pollingRef = useRef(false);
  const pollLatest = useCallback(async () => {
    if (pollingRef.current || loadingRef.current || !token) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    pollingRef.current = true;
    try {
      let data;
      if (feedType === 'community') {
        const res = await dotnetApi.post(GET_PUBLIC_POST, {
          authorization: token,
          Skip: 0,
          Limit: LIMIT,
        });
        data = res.data;
      } else {
        const fd = new FormData();
        fd.append('skip', 0);
        fd.append('limit', LIMIT);
        const fetchRes = await fetch('https://natural.friendlinq.com' + GET_ALL_USERS_POST, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'authorization': token },
          body: fd,
        });
        data = await fetchRes.json();
      }
      if ((data?.statusCode ?? data?.StatusCode) !== 200) return;
      let latest = data?.data?.myPost || data?.data?.myPosts || data?.Data?.myPost || [];
      latest = latest.map((p) => {
        if (p.Author && typeof p.Author === 'object' && typeof p.postAuthor !== 'object') {
          return { ...p, postAuthor: p.Author };
        }
        return p;
      });
      const isDatingFilter = userType === 'dating' ? '1' : '0';
      latest = latest.filter((p) => (p.isdating || '0') === isDatingFilter);
      if (latest.length === 0) return;

      const latestTotal = data?.data?.totalMyPost ?? data?.Data?.totalMyPost;
      setPosts((prev) => {
        const byId = new Map(latest.map((p) => [p._id, p]));
        const seen = new Set(prev.map((p) => p._id));
        const added = latest.filter((p) => !seen.has(p._id));
        let changed = added.length > 0;
        const updated = prev.map((p) => {
          const fresh = byId.get(p._id);
          if (fresh && JSON.stringify(fresh) !== JSON.stringify(p)) {
            changed = true;
            return fresh;
          }
          return p;
        });
        return changed ? [...added, ...updated] : prev;
      });
      if (typeof latestTotal === 'number') setTotal(latestTotal);
    } catch (err) {
      // Quiet: the next check in 5 seconds tries again
    } finally {
      pollingRef.current = false;
    }
  }, [feedType, token, userType]);

  useEffect(() => {
    const id = setInterval(pollLatest, 5000);
    const onVisible = () => { if (!document.hidden) pollLatest(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pollLatest]);

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

  // ── Remove a deleted post from feed ─────────────────────
  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // ── Media picker ─────────────────────────────────────────
  const handleMediaSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clearCover();
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setPostOverlay(null);
    if (file.type?.startsWith('video')) setShowEditor(true);
  };

  // ── Paste-to-upload ─────────────────────────────────────
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      // Robert's addition (Nov 6, 2026): a copied video can be pasted too, not only a photo.
      if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setMediaFile(file);
          setMediaPreview(URL.createObjectURL(file));
          setPostOverlay(null);
          if (file.type?.startsWith('video')) setShowEditor(true);
        }
        break;
      }
    }
  };

  const clearCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Music posts (Nov 12, 2026, same as the app): pick a song or other sound file, then a cover picture if wanted.
  const handleMusicSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(mp3|m4a|aac|wav|ogg)$/i.test(file.name || '') && !isAudioFile(file)) {
      alert('Music can be an MP3, M4A, AAC, WAV or OGG file.');
      return;
    }
    if (file.size > 45 * 1000000) {
      alert('Music files can be up to 45 MB.');
      return;
    }
    clearMedia();
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    clearCover();
    setMediaFile(null);
    setPostOverlay(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (musicInputRef.current) musicInputRef.current.value = '';
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
        coverFile: isAudioFile(mediaFile) ? coverFile : null,
        isdating: userType === 'dating' ? '1' : '0',
        postOverlay: mediaFile?.type?.startsWith('video') ? overlayToString(postOverlay) : '',
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

  // Dating Mode has its own home (Discover, Likes You, Matches), same as the app.
  if (userType === 'dating') {
    return (
      <div style={styles.container}>
        <div style={styles.feed}>
          <DatingHome token={token} myProfile={profile} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Friendlinq Home Feed</h1>
      <div style={styles.feed}>
        {/* Search people (user testing, November 7, 2026: "There is no way to search for a user"). Same as the app. */}
        <button
          onClick={() => navigate('/add-friend')}
          aria-label="Search people"
          style={{ display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box', margin: '0 0 10px', height: 40, borderRadius: 20, border: '1.5px solid #1a6b3a', background: '#fff', padding: '0 14px', cursor: 'pointer', fontSize: 15.5, color: '#666' }}
        >
          <span style={{ color: '#1a6b3a', marginRight: 8, fontSize: 17 }}>&#128269;</span> Search people on Friendlinq
        </button>

        {/* ── Post Composer ─────────────────────────────────── */}
        <div style={styles.composerCard}>
          <div style={styles.composerRow}>
            <div style={styles.composerPicWrap}>
              {profilePic ? (
                <img src={profilePic} alt="Your profile photo" style={styles.composerPic} />
              ) : (
                <div style={styles.composerPicPlaceholder}>
                  {firstName(profile?.fullName).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="What's on your mind."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onPaste={handlePaste}
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

          {/* Who can see this post (was the unexplained Friends / Community radio buttons; same change as the app) */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, margin: '8px 0 4px' }}>
            <span style={{ fontSize: 15, color: '#222', marginRight: 4 }}>Who can see this post:</span>
            {[{ v: 'Public', label: 'Everyone' }, { v: 'Friend_Only', label: 'Only my friends' }].map((o) => {
              const on = privacyForPost === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPrivacyForPost(o.v)}
                  style={{ padding: '5px 12px', borderRadius: 16, border: '1.5px solid #1a6b3a', background: on ? '#1a6b3a' : '#fff', color: on ? '#fff' : '#1a6b3a', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          {/* Media preview */}
          {mediaPreview && (
            <div style={styles.mediaPreviewWrap}>
              {isAudioFile(mediaFile) ? (
                <div style={{ background: '#2e7d32', color: '#fff', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {coverPreview ? (
                      <img src={coverPreview} alt="Music cover preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }} aria-hidden="true">♫</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mediaFile.name}</div>
                      <button
                        onClick={() => coverInputRef.current && coverInputRef.current.click()}
                        style={{ marginTop: 6, background: '#fff', color: '#2e7d32', border: 'none', borderRadius: 14, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {coverPreview ? 'Change cover picture' : 'Add a cover picture'}
                      </button>
                    </div>
                  </div>
                  <audio src={mediaPreview} controls style={{ width: '100%', marginTop: 10 }} />
                </div>
              ) : mediaFile?.type?.startsWith('video') ? (
                <>
                  <video src={mediaPreview} controls style={styles.mediaPreview} />
                  <button
                    onClick={() => setShowEditor(true)}
                    style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid #fff', borderRadius: 8, padding: '3px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                    title="Text, captions and voice on your video"
                  >
                    Aa{postOverlay ? ' ✓' : ''}
                  </button>
                </>
              ) : (
                <img src={mediaPreview} alt="Media attachment preview" style={styles.mediaPreview} />
              )}
              <button onClick={clearMedia} style={styles.clearMediaBtn}>
                <AiOutlineClose size={16} />
              </button>
            </div>
          )}

          <VideoTextEditor
            open={showEditor}
            videoSrc={mediaPreview}
            file={mediaFile}
            initial={postOverlay}
            onCancel={() => setShowEditor(false)}
            onDone={(o) => { setPostOverlay(o); setShowEditor(false); }}
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleMediaSelect}
            style={{ display: 'none' }}
          />

          <input
            type="file"
            ref={musicInputRef}
            accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg"
            onChange={handleMusicSelect}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            onChange={handleCoverSelect}
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
              <button style={styles.mediaBtn} onClick={() => musicInputRef.current && musicInputRef.current.click()}>
                <span aria-hidden="true" style={{ color: '#1a6b3a', fontSize: 17 }}>♫</span>
                <span style={{ marginLeft: 4 }}>Music</span>
              </button>
              {/* Go Live button — hidden for now, route still works at /live/:channelName?host=1 */}
            </div>
          </div>
          {/* Clear feed tabs (was "See Friends Posts" / "Feed"; same change as the app). My Posts opens your profile. */}
          <div role="tablist" style={{ display: 'flex', border: '1.5px solid #1a6b3a', borderRadius: 10, overflow: 'hidden', marginTop: 10 }}>
            {[
              { key: 'community', label: "Everyone's Posts" },
              { key: 'friends', label: "My Friends' Posts" },
              { key: 'mine', label: 'My Posts' },
            ].map((t, ti) => {
              const on = t.key === feedType;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    if (t.key === 'mine') { navigate('/profile'); return; }
                    if (t.key !== feedType) toggleFeed();
                  }}
                  style={{ flex: 1, padding: '9px 4px', border: 'none', borderLeft: ti ? '1px solid #1a6b3a' : 'none', background: on ? '#1a6b3a' : '#fff', color: on ? '#fff' : '#1a6b3a', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, color: '#666', margin: '5px 2px 0' }}>
            {feedType === 'community'
              ? 'Showing posts from all Friendlinq members. My Posts opens your profile, where your own posts are.'
              : 'Showing posts only from people you are friends with. My Posts opens your profile, where your own posts are.'}
          </div>
        </div>


        {/* ── Feed ──────────────────────────────────────────── */}
        {posts.map((post, idx) => (
          <PostCard
            key={post._id || idx}
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
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
  badgeBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    padding: '8px 0',
  },
  badgeImg: {
    height: 40,
    width: 'auto',
  },
  badgeImgPlay: {
    height: 58,
    width: 'auto',
    marginTop: -2,
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
