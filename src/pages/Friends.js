import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getFriendList,
  getIncomingRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
} from '../actions/friend_actions';
import { MdPersonAdd, MdPersonRemove, MdCheck, MdClose, MdStar, MdStarBorder } from 'react-icons/md';
import { nodeApi } from '../api/axios';
import { UPDATE_TOP_FRIENDS } from '../api/config';
import normalizeImg from '../utils/normalizeImg';
import { firstName } from '../utils/displayName';

const TABS = [
  { key: 'friends', label: 'Friends' },
  { key: 'incoming', label: 'Requests' },
  { key: 'sent', label: 'Sent' },
];

export default function Friends() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.login_access_token);
  const { friendsList, incomingRequests, sentRequests, loading } = useSelector(
    (s) => s.friendReducer
  );

  const [tab, setTab] = useState('friends');
  const [actionId, setActionId] = useState(null);

  const myId = useSelector((s) => s.authReducer.getProfileData?._id);
  const topFourFriendList = useSelector((s) => s.friendReducer.topFourFriendList) || [];

  // Derive favorite IDs from Redux topFourFriendList
  const favoriteIds = topFourFriendList.map((f) => f.friendId || f._id).filter(Boolean);

  // ── Load data when tab changes ────────────────────────────
  const loadTab = useCallback(() => {
    if (tab === 'friends') dispatch(getFriendList(0, 100));
    else if (tab === 'incoming') dispatch(getIncomingRequests(0, 100));
    else if (tab === 'sent') dispatch(getSentRequests(0, 100));
  }, [tab, dispatch]);

  useEffect(() => {
    loadTab();
  }, [loadTab]);

  // ── Toggle favorite ──────────────────────────────────────
  const toggleFavorite = async (friend) => {
    const fId = friend._id || friend.friendId;
    const isFav = favoriteIds.includes(fId);

    let newFavIds;
    if (isFav) {
      newFavIds = favoriteIds.filter((id) => id !== fId);
    } else {
      if (favoriteIds.length >= 4) {
        alert('You can select up to 4 favorite friends');
        return;
      }
      newFavIds = [...favoriteIds, fId];
    }

    // Build the friendList array that the API expects
    const friendListPayload = newFavIds.map((id) => {
      const f = friendsList.find((fr) => (fr._id || fr.friendId) === id);
      const fName = firstName(f?.fullName);
      const rawImg = f?.imageURL;
      const fImg = typeof rawImg === 'object' ? (rawImg?.thumbnail || '') : (rawImg || '');
      return {
        userId: myId,
        friendId: id,
        friendName: fName,
        friendImage: fImg,
        usertype: '0',
      };
    });

    setActionId(fId);
    try {
      const fd = new FormData();
      fd.append('friendList', JSON.stringify(friendListPayload));
      const res = await nodeApi.post(UPDATE_TOP_FRIENDS, fd);
      if (res.data?.statusCode === 200) {
        // Re-fetch friend list to get updated topFourFriendList from server
        dispatch(getFriendList(0, 100));
      } else {
        alert('Failed to update favorites');
      }
    } catch {
      alert('Failed to update favorites');
    } finally {
      setActionId(null);
    }
  };

  // ── Actions ───────────────────────────────────────────────
  const handleAccept = async (friendId) => {
    setActionId(friendId);
    const res = await dispatch(acceptFriendRequest(friendId));
    if (res.success) dispatch(getFriendList(0, 100)); // refresh friends
    setActionId(null);
  };

  const handleReject = async (friendId) => {
    setActionId(friendId);
    await dispatch(rejectFriendRequest(friendId));
    setActionId(null);
  };

  const handleUnfriend = async (friendId) => {
    setActionId(friendId);
    await dispatch(unfriend(friendId, token));
    setActionId(null);
  };

  // ── Derive list for current tab ───────────────────────────
  const getList = () => {
    if (tab === 'friends') return friendsList;
    if (tab === 'incoming') return incomingRequests;
    if (tab === 'sent') return sentRequests;
    return [];
  };

  const list = getList();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Friends</h2>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {TABS.map((t) => (
            <button
              key={t.key}
              style={{
                ...styles.tabBtn,
                ...(tab === t.key ? styles.tabBtnActive : {}),
              }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === 'incoming' && incomingRequests.length > 0 && (
                <span style={styles.badge}>{incomingRequests.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading && list.length === 0 ? (
          <div style={styles.empty}>Loading...</div>
        ) : list.length === 0 ? (
          <div style={styles.empty}>
            {tab === 'friends' && 'No friends yet'}
            {tab === 'incoming' && 'No pending requests'}
            {tab === 'sent' && 'No sent requests'}
          </div>
        ) : (
          <div style={styles.list}>
            {list.map((item) => {
              const id = item._id || item.friendId;
              const img = normalizeImg(item.imageURL);
              const name = firstName(
                item.fullName ||
                `${item.firstName || ''} ${item.lastName || ''}`.trim()
              );
              const initials = (name.charAt(0) || '?').toUpperCase();
              const busy = actionId === id;

              return (
                <div key={id} style={styles.row}>
                  <div
                    style={styles.rowLeft}
                    onClick={() => navigate(`/user/${id}`)}
                  >
                    {img ? (
                      <img src={img} alt={name} style={styles.avatar} />
                    ) : (
                      <div style={styles.avatarFallback}>{initials}</div>
                    )}
                    <span style={styles.name}>{name}</span>
                  </div>

                  <div style={styles.rowRight}>
                    {tab === 'friends' && (
                      <>
                        <button
                          style={styles.favBtn}
                          onClick={() => toggleFavorite(item)}
                          title={favoriteIds.includes(id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favoriteIds.includes(id)
                            ? <MdStar size={22} color="#f0c040" />
                            : <MdStarBorder size={22} color="#999" />}
                        </button>
                        <button
                          style={styles.btnDanger}
                          onClick={() => handleUnfriend(id)}
                          disabled={busy}
                        >
                          <MdPersonRemove size={16} />
                          <span>{busy ? '...' : 'Unfriend'}</span>
                        </button>
                      </>
                    )}
                    {tab === 'incoming' && (
                      <>
                        <button
                          style={styles.btnPrimary}
                          onClick={() => handleAccept(id)}
                          disabled={busy}
                        >
                          <MdCheck size={16} />
                          <span>{busy ? '...' : 'Accept'}</span>
                        </button>
                        <button
                          style={styles.btnDanger}
                          onClick={() => handleReject(id)}
                          disabled={busy}
                        >
                          <MdClose size={16} />
                        </button>
                      </>
                    )}
                    {tab === 'sent' && (
                      <span style={styles.pendingLabel}>Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Friend link */}
        <button
          style={styles.addFriendLink}
          onClick={() => navigate('/add-friend')}
        >
          <MdPersonAdd size={18} />
          <span>Find Friends</span>
        </button>
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
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    padding: '16px',
  },
  title: {
    margin: '0 0 12px',
    fontSize: 20,
    fontWeight: 700,
    color: '#222',
  },
  tabRow: {
    display: 'flex',
    gap: 0,
    borderBottom: '2px solid #eee',
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    padding: '10px 0',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: -2,
    fontSize: 14,
    fontWeight: 600,
    color: '#888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabBtnActive: {
    color: '#1a6b3a',
    borderBottomColor: '#1a6b3a',
  },
  badge: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 10,
    padding: '1px 6px',
    minWidth: 18,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 14,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#222',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  favBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  pendingLabel: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  addFriendLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    padding: '10px 0',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
};
