import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFriendList } from '../actions/friend_actions';
import { MdStar } from 'react-icons/md';
import normalizeImg from '../utils/normalizeImg';
import { firstName } from '../utils/displayName';

export default function Favorites() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topFourFriendList = useSelector((s) => s.friendReducer.topFourFriendList) || [];
  const loading = useSelector((s) => s.friendReducer.loading);

  // Fetch friend list on mount to get topFourFriendList from server
  useEffect(() => {
    dispatch(getFriendList(0, 100));
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <MdStar size={24} color="#f0c040" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Favorite Friends
        </h2>
        <p style={styles.subtitle}>
          Your top friends shown on your profile. Manage favorites on the Friends page.
        </p>

        {loading && topFourFriendList.length === 0 ? (
          <div style={styles.empty}>Loading...</div>
        ) : topFourFriendList.length === 0 ? (
          <div style={styles.empty}>
            <p>No favorite friends yet.</p>
            <p style={{ fontSize: 13, color: '#999' }}>
              Go to the Friends page and tap the star icon to add up to 4 favorites.
            </p>
            <button style={styles.goBtn} onClick={() => navigate('/friends')}>
              Go to Friends
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {topFourFriendList.map((friend, idx) => {
              const id = friend.friendId || friend._id;
              const name = firstName(friend.friendName || friend.fullName);
              const img = normalizeImg(friend.friendImage || friend.imageURL);

              return (
                <div
                  key={id || idx}
                  style={styles.row}
                  onClick={() => navigate(`/user/${id}`)}
                >
                  {img ? (
                    <img src={img} alt={name} style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {(name.charAt(0) || '?').toUpperCase()}
                    </div>
                  )}
                  <span style={styles.name}>{name}</span>
                  <MdStar size={20} color="#f0c040" />
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
    padding: 16,
  },
  title: {
    margin: '0 0 4px',
    fontSize: 20,
    fontWeight: 700,
    color: '#222',
  },
  subtitle: {
    margin: '0 0 16px',
    fontSize: 13,
    color: '#888',
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
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 48,
    height: 48,
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
    flex: 1,
    fontSize: 15,
    fontWeight: 600,
    color: '#222',
  },
  goBtn: {
    marginTop: 16,
    padding: '10px 24px',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
