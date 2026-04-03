import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfileAttempt } from '../actions/auth_actions';
import { getFriendsList } from '../actions/profile_actions';
import { MdEdit, MdLocationOn, MdEmail, MdPeople, MdCollections } from 'react-icons/md';
import normalizeImg from '../utils/normalizeImg';

export default function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((s) => s.authReducer.getProfileData) || {};
  const [friends, setFriends] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await dispatch(getProfileAttempt());
      const friendRes = await dispatch(getFriendsList(0, 100));
      if (friendRes?.success) {
        const list = friendRes.data?.friendList || friendRes.data?.myFriendList || [];
        setFriends(list);
        setFriendCount(friendRes.data?.totalFriend || friendRes.data?.totalMyFriend || list.length);
      }
      setLoading(false);
    };
    load();
  }, [dispatch]);

  const fullName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User';
  const imageURL = profile.imageURL || '';
  const bannerURL = normalizeImg(profile.bannerURL);
  const bio = profile.bio || profile.aboutMe || '';
  const rawLoc = profile.address || '';
  // Only show location if it's readable text, not GPS coordinates or objects
  const location = (typeof rawLoc === 'string' && rawLoc && !/^[\d.,\s-]+$/.test(rawLoc)) ? rawLoc : '';
  const email = profile.email || '';
  const topFriends = profile.topFourFriend || [];
  const topImages = profile.topFourImage || [];
  const initials = `${(profile.firstName || '').charAt(0)}${(profile.lastName || '').charAt(0)}`.toUpperCase() || '?';

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {/* Banner */}
        <div style={styles.bannerWrap}>
          {bannerURL ? (
            <img src={bannerURL} alt="Banner" style={styles.bannerImg} onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div style={styles.bannerPlaceholder} />
          )}
          {/* Edit Profile button */}
          <button style={styles.editBtn} onClick={() => navigate('/edit-profile')}>
            <MdEdit size={16} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile photo overlapping banner */}
        <div style={styles.avatarWrap}>
          {imageURL ? (
            <img src={imageURL} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>{initials}</div>
          )}
        </div>

        {/* Info section */}
        <div style={styles.infoSection}>
          <h2 style={styles.name}>{fullName}</h2>

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

          <div style={styles.friendCountRow}>
            <MdPeople size={18} color="#1a6b3a" />
            <span style={styles.friendCountText}>{friendCount} Friends</span>
          </div>
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
                  <div key={f._id || i} style={styles.gridItem} onClick={() => f._id && navigate(`/user/${f._id}`)}>
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

        {/* Photo Library link */}
        <div style={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ ...styles.sectionTitle, marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Photo Library</h3>
            <button
              onClick={() => navigate('/portfolio')}
              style={{ background: 'none', border: 'none', color: '#1a6b3a', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <MdCollections size={16} /> Manage
            </button>
          </div>
        </div>

        {/* Top 4 Portfolio Images */}
        {topImages.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Photo Library</h3>
            <div style={styles.grid4}>
              {topImages.slice(0, 4).map((img, i) => {
                const imgUrl = normalizeImg(img.imageURL || img);
                return (
                  <div key={i} style={styles.gridItem}>
                    {imgUrl ? (
                      <img src={imgUrl} alt="Portfolio" style={styles.gridImg} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={styles.gridImgPlaceholder}>?</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Friends list preview */}
        {friends.length > 0 && topFriends.length === 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Friends ({friendCount})</h3>
            <div style={styles.grid4}>
              {friends.slice(0, 4).map((f, i) => {
                const fImg = normalizeImg(f.imageURL);
                const fName = f.fullName || f.firstName || '';
                return (
                  <div key={f._id || i} style={styles.gridItem} onClick={() => f._id && navigate(`/user/${f._id}`)}>
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
  profileCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
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
  editBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  avatarWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -50,
    position: 'relative',
    zIndex: 2,
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
  infoSection: {
    padding: '12px 20px 20px',
    textAlign: 'center',
  },
  name: {
    margin: '8px 0 4px',
    fontSize: 22,
    fontWeight: 700,
    color: '#222',
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
  friendCountRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    padding: '8px 0',
    borderTop: '1px solid #eee',
  },
  friendCountText: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1a6b3a',
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
