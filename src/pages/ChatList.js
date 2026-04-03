import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getChatList, getChatCount } from '../actions/chat_actions';
import normalizeImg from '../utils/normalizeImg';

export default function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.login_access_token);
  const profile = useSelector((s) => s.authReducer.getProfileData);
  const unreadTotal = useSelector((s) => s.authReducer.chatnotificationCount);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    const res = await dispatch(getChatList(token));
    if (res.success) {
      setChats(res.data || []);
    }
    setLoading(false);
  }, [dispatch, token]);

  useEffect(() => {
    fetchChats();
    dispatch(getChatCount(token));
  }, [fetchChats, dispatch, token]);

  const openChat = (chat) => {
    // .NET GetChatList response fields: friendId, senderId, name, imageURL.thumbnail, count, LastMessage
    const otherUserId = chat.friendId || chat.senderId || chat.Aborad_id || chat.aborad_id || '';
    const otherUserName = chat.name || chat.Aborad_Name || chat.aborad_Name || chat.fullName || 'User';
    const rawImg = chat.imageURL?.thumbnail || chat.imageURL || chat.Aborad_Image || chat.aborad_Image || '';

    navigate(`/chat/${otherUserId}`, {
      state: {
        userId: otherUserId,
        userName: otherUserName,
        userImage: rawImg,
      },
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>Messages</h2>
          {unreadTotal > 0 && (
            <span style={styles.headerBadge}>{unreadTotal} unread</span>
          )}
        </div>

        {loading && <div style={styles.loading}>Loading chats...</div>}

        {!loading && chats.length === 0 && (
          <div style={styles.empty}>No conversations yet. Start chatting with a friend!</div>
        )}

        {chats.map((chat, idx) => {
          const rawImg = chat.imageURL?.thumbnail || chat.imageURL || chat.Aborad_Image || chat.aborad_Image || '';
          const img = normalizeImg(rawImg);
          const name = chat.name || chat.Aborad_Name || chat.aborad_Name || chat.fullName || 'User';
          const lastMsg = chat.LastMessage || chat.lastMessage || chat.message || '';
          const time = chat.LastMessageDate || chat.lastMessageDate || chat.createdAt || '';
          const unread = chat.count || chat.UnReadCount || chat.unReadCount || chat.unreadCount || 0;

          return (
            <button
              key={chat.friendId || chat.senderId || chat.Aborad_id || idx}
              style={styles.chatItem}
              onClick={() => openChat(chat)}
            >
              <div style={styles.avatarWrap}>
                {img ? (
                  <img src={img} alt={name} style={styles.avatar} />
                ) : (
                  <div style={styles.avatarFallback}>
                    {(name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={styles.chatInfo}>
                <div style={styles.chatTopRow}>
                  <span style={{ ...styles.chatName, fontWeight: unread > 0 ? 700 : 500 }}>{name}</span>
                  <span style={styles.chatTime}>{formatTime(time)}</span>
                </div>
                <div style={styles.chatBottomRow}>
                  <span style={{ ...styles.chatLastMsg, fontWeight: unread > 0 ? 600 : 400 }}>
                    {lastMsg || 'Tap to chat'}
                  </span>
                  {unread > 0 && (
                    <span style={styles.unreadBadge}>
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 56px)',
  },
  content: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 12px',
    borderBottom: '1px solid #eee',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#1a6b3a',
  },
  headerBadge: {
    backgroundColor: '#1a6b3a',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 12,
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 14,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    textAlign: 'left',
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    minWidth: 0,
  },
  chatTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    color: '#222',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    flexShrink: 0,
  },
  chatBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatLastMsg: {
    fontSize: 13,
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#1a6b3a',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    flexShrink: 0,
  },
};
