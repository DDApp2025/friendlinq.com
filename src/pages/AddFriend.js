import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchUsers, sendFriendReq } from '../actions/friend_actions';
import { MdSearch, MdPersonAdd } from 'react-icons/md';
import normalizeImg from '../utils/normalizeImg';

export default function AddFriend() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myId = useSelector((s) => s.authReducer.getProfileData?._id);
  const searchResults = useSelector((s) => s.friendReducer.searchResults);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentIds, setSentIds] = useState({}); // track which requests were sent
  const [message, setMessage] = useState('');
  const debounceRef = useRef(null);

  const handleSearch = (text) => {
    setQuery(text);
    setMessage('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      dispatch({ type: 'SET_SEARCH_USER_EMPTY' });
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      await dispatch(searchUsers(text.trim()));
      setLoading(false);
    }, 400);
  };

  const handleSendRequest = async (userId) => {
    setSentIds((prev) => ({ ...prev, [userId]: 'sending' }));
    setMessage('');
    const res = await dispatch(sendFriendReq(userId));
    if (res.success) {
      setSentIds((prev) => ({ ...prev, [userId]: 'sent' }));
      setMessage(res.message || 'Friend request sent!');
    } else {
      setSentIds((prev) => ({ ...prev, [userId]: 'failed' }));
      setMessage(res.message || 'Failed to send request');
    }
  };

  // Filter out self from results
  const results = (searchResults || []).filter((u) => {
    const uid = u._id || u.userId;
    return uid !== myId;
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Find Friends</h2>

        {/* Search bar */}
        <div style={styles.searchRow}>
          <MdSearch size={20} color="#888" />
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {message && (
          <div
            style={{
              padding: '8px 0',
              fontSize: 13,
              color: message.includes('fail') || message.includes('Failed')
                ? '#d32f2f'
                : '#1a6b3a',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={styles.empty}>Searching...</div>
        ) : query && results.length === 0 ? (
          <div style={styles.empty}>No users found</div>
        ) : (
          <div style={styles.list}>
            {results.map((user) => {
              const uid = user._id || user.userId;
              const img = normalizeImg(user.imageURL);
              const name =
                user.fullName ||
                `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                'User';
              const initials = (name.charAt(0) || '?').toUpperCase();
              const status = sentIds[uid];

              return (
                <div key={uid} style={styles.row}>
                  <div
                    style={styles.rowLeft}
                    onClick={() => navigate(`/user/${uid}`)}
                  >
                    {img ? (
                      <img src={img} alt={name} style={styles.avatar} />
                    ) : (
                      <div style={styles.avatarFallback}>{initials}</div>
                    )}
                    <span style={styles.name}>{name}</span>
                  </div>

                  <div style={styles.rowRight}>
                    {status === 'sent' ? (
                      <span style={styles.sentLabel}>Request Sent</span>
                    ) : (
                      <button
                        style={styles.addBtn}
                        onClick={() => handleSendRequest(uid)}
                        disabled={status === 'sending'}
                      >
                        <MdPersonAdd size={16} />
                        <span>
                          {status === 'sending'
                            ? '...'
                            : status === 'failed'
                            ? 'Retry'
                            : 'Add'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14,
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
    flexShrink: 0,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  sentLabel: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
};
