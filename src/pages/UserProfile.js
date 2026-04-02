import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile, sendFriendRequest, unfriendUser, getUserOnlineStatus } from '../actions/profile_actions';
import { MdArrowBack, MdPersonAdd, MdPersonRemove, MdLocationOn, MdEmail } from 'react-icons/md';
import normalizeImg from '../utils/normalizeImg';

export default function UserProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.login_access_token);
  const myId = useSelector((s) => s.authReducer.getProfileData?._id);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'pending', 'friend'
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) return;
    // If viewing own profile, redirect
    if (userId === myId) {
      navigate('/profile', { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      const res = await dispatch(getUserProfile(userId));
      if (res.success) {
        setUser(res.data);
        // Determine friend status from response
        if (res.data.isFriend || res.data.friendStatus === 'friend') {
          setFriendStatus('friend');
        } else if (res.data.friendStatus === 'pending' || res.data.requestSent) {
          setFriendStatus('pending');
        } else {
          setFriendStatus('none');
        }
      }
      setLoading(false);

      // Check online status
      const onlineRes = await dispatch(getUserOnlineStatus(userId, token));
      if (onlineRes.success) {
        setIsOnline(onlineRes.isOnline);
      }
    };
    load();
  }, [userId, myId, dispatch, navigate, token]);

  const handleAddFriend = async () => {
    setActionLoading(true);
    setMessage('');
    const res = await dispatch(sendFriendRequest(userId));
    if (res.success) {
      setFriendStatus('pending');
      setMessage(res.message || 'Friend request sent!');
    } else {
      setMessage(res.message || 'Failed to send request');
    }
    setActionLoading(false);
  };

  const handleUnfriend = async () => {
    setActionLoading(true);
    setMessage('');
    const res = await dispatch(unfriendUser(userId, token));
    if (res.success) {
      setFriendStatus('none');
      setMessage('Unfriended');
    } else {
      setMessage(res.message || 'Failed to unfriend');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>User not found</div>
      </div>
    );
  }

  const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const imageURL = normalizeImg(user.imageURL);
  const bannerURL = normalizeImg(user.bannerURL);
  const bio = user.bio || user.aboutMe || '';
  const rawLoc = user.address || '';
  const location = (typeof rawLoc === 'string' && rawLoc && !/^[\d.,\s-]+$/.test(rawLoc)) ? rawLoc : '';
  const email = user.email || '';
  const topFriends = user.topFourFriend || [];
  const topImages = user.topFourImage || [];
  const initials = `${(user.firstName || fullName || '').charAt(0)}`.toUpperCase() || '?';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Back button */}
        <div style={styles.headerBar}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack size={22} />
          </button>
          <span style={styles.headerTitle}>{fullName}</span>
        </div>

        {/* Banner */}
        <div style={styles.bannerWrap}>
          {bannerURL ? (
            <img src={bannerURL} alt="Banner" style={styles.bannerImg} onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div style={styles.bannerPlaceholder} />
          )}
        </div>

        {/* Avatar + online dot */}
        <div style={styles.avatarWrap}>
          <div style={styles.avatarContainer}>
            {imageURL ? (
              <img src={imageURL} alt="Profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>{initials}</div>
            )}
            <span style={{
              ...styles.onlineDot,
              backgroundColor: isOnline ? '#4caf50' : '#bbb',
            }} />
          </div>
        </div>

        {/* Info */}
        <div style={styles.infoSection}>
          <h2 style={styles.name}>
            {fullName}
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isOnline ? '#4caf50' : '#bbb',
              marginLeft: 8,
              verticalAlign: 'middle',
            }} />
          </h2>
          <span style={styles.onlineLabel}>{isOnline ? 'Online' : 'Offline'}</span>

          {email && (
            <div style={styles.infoRow}>
              <MdEmail size={16} color="#888" />
              <span style={styles.infoText}>{email}</span>
            </div>
          )}

          {location && (
            <div style={styles.infoRow}>
              <MdLocationOn size={16} color="#888" />
              <span style={styles.infoText}>{location}</span>
            </div>
          )}

          {bio && <p style={styles.bio}>{bio}</p>}

          {/* Friend action button */}
          <div style={styles.actionRow}>
            {friendStatus === 'friend' ? (
              <button
                style={styles.unfriendBtn}
                onClick={handleUnfriend}
                disabled={actionLoading}
              >
                <MdPersonRemove size={18} />
                <span>{actionLoading ? 'Processing...' : 'Unfriend'}</span>
              </button>
            ) : friendStatus === 'pending' ? (
              <button style={styles.pendingBtn} disabled>
                <span>Request Sent</span>
              </button>
            ) : (
              <button
                style={styles.addFriendBtn}
                onClick={handleAddFriend}
                disabled={actionLoading}
              >
                <MdPersonAdd size={18} />
                <span>{actionLoading ? 'Sending...' : 'Add Friend'}</span>
              </button>
            )}
          </div>

          {message && (
            <div style={{ marginTop: 8, fontSize: 13, color: message.includes('fail') || message.includes('Failed') ? '#d32f2f' : '#1a6b3a', textAlign: 'center' }}>
              {message}
            </div>
          )}
        </div>

        {/* Top 4 Friends */}
        {topFriends.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Top Friends</h3>
            <div style={styles.grid4}>
              {topFriends.slice(0, 4).map((f, i) => {
                const fImg = normalizeImg(f.imageURL);
                const fName = f.fullName || f.firstName || '';
                return (
                  <div key={f._id || i} style={styles.gridItem} onClick={() => f._id && f._id !== myId && navigate(`/user/${f._id}`)}>
                    {fImg ? (
                      <img src={fImg} alt={fName} style={styles.gridImg} />
                    ) : (
                      <div style={styles.gridImgPlaceholder}>{(fName || '?').charAt(0)}</div>
                    )}
                    <span style={styles.gridLabel}>{fName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top 4 Portfolio Images */}
        {topImages.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Portfolio</h3>
            <div style={styles.grid4}>
              {topImages.slice(0, 4).map((img, i) => {
                const imgUrl = normalizeImg(img.imageURL || img);
                return (
                  <div key={i} style={styles.gridItem}>
                    {imgUrl ? (
                      <img src={imgUrl} alt="Portfolio" style={styles.gridImg} />
                    ) : (
                      <div style={styles.gridImgPlaceholder}>?</div>
                    )}
                  </div>
                );
              })}
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
  loadingText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 15,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderBottom: '1px solid #eee',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    color: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#222',
  },
  bannerWrap: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#1a6b3a',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a6b3a 0%, #2ecc71 100%)',
  },
  avatarWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -50,
    position: 'relative',
    zIndex: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '3px solid #fff',
  },
  infoSection: {
    padding: '12px 20px 20px',
    textAlign: 'center',
  },
  name: {
    margin: '8px 0 2px',
    fontSize: 22,
    fontWeight: 700,
    color: '#222',
  },
  onlineLabel: {
    fontSize: 12,
    color: '#888',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  bio: {
    marginTop: 12,
    fontSize: 14,
    color: '#444',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  actionRow: {
    marginTop: 16,
  },
  addFriendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  pendingBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#888',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'default',
  },
  unfriendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  section: {
    padding: '0 20px 20px',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1px solid #eee',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
  },
  gridImg: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 8,
    objectFit: 'cover',
  },
  gridImgPlaceholder: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 8,
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: '#999',
  },
  gridLabel: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
};
