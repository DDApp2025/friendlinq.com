import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  MdPersonAdd,
  MdChat,
  MdComment,
  MdThumbUp,
  MdGroup,
  MdVideocam,
  MdNotifications,
  MdCheckCircle,
  MdDelete,
  MdDoneAll,
} from 'react-icons/md';
import {
  getNotifications,
  readNotification,
  viewAllNotifications,
  deleteNotification,
} from '../actions/notification_actions';
import * as actionTypes from '../actions/actions_types';
import normalizeImg from '../utils/normalizeImg';

const LIMIT = 20;

// Map notification type strings to icons — matches notification_screen.js icon set
const typeIconMap = {
  friend_request: MdPersonAdd,
  Friend_Request: MdPersonAdd,
  FRIEND_REQUEST: MdPersonAdd,
  new_message: MdChat,
  New_Message: MdChat,
  NEW_MESSAGE: MdChat,
  message: MdChat,
  comment: MdComment,
  Comment: MdComment,
  COMMENT: MdComment,
  like: MdThumbUp,
  Like: MdThumbUp,
  LIKE: MdThumbUp,
  group_add: MdGroup,
  Group_Add: MdGroup,
  GROUP_ADD: MdGroup,
  group: MdGroup,
  live_stream: MdVideocam,
  Live_Stream: MdVideocam,
  LIVE_STREAM: MdVideocam,
  live: MdVideocam,
};

const typeColorMap = {
  friend_request: '#4CAF50',
  Friend_Request: '#4CAF50',
  FRIEND_REQUEST: '#4CAF50',
  new_message: '#2196F3',
  New_Message: '#2196F3',
  NEW_MESSAGE: '#2196F3',
  message: '#2196F3',
  comment: '#FF9800',
  Comment: '#FF9800',
  COMMENT: '#FF9800',
  like: '#E91E63',
  Like: '#E91E63',
  LIKE: '#E91E63',
  group_add: '#9C27B0',
  Group_Add: '#9C27B0',
  GROUP_ADD: '#9C27B0',
  group: '#9C27B0',
  live_stream: '#F44336',
  Live_Stream: '#F44336',
  LIVE_STREAM: '#F44336',
  live: '#F44336',
};

function getIcon(type) {
  return typeIconMap[type] || MdNotifications;
}
function getColor(type) {
  return typeColorMap[type] || '#757575';
}

function relativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return '';
  }
}

// Decide navigation target based on notification type
function getNavTarget(n) {
  const type = (n.type || n.notificationType || '').toLowerCase();
  if (type.includes('message') || type.includes('chat')) {
    const userId = n.senderId || n.fromUserId || n.userId;
    return userId ? `/chat/${userId}` : null;
  }
  if (type.includes('comment') || type.includes('like')) {
    const postId = n.postId || n.data?.postId;
    return postId ? `/comments/${postId}` : null;
  }
  if (type.includes('friend')) {
    return '/friends';
  }
  if (type.includes('group')) {
    return '/home'; // groups not yet built
  }
  if (type.includes('live') || type.includes('stream')) {
    const callId = n.callId || n.data?.callId || n.senderId || n.fromUserId;
    const hostId = n.senderId || n.fromUserId;
    return callId ? `/live/${callId}?hostId=${hostId || ''}` : '/home';
  }
  return null;
}

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((s) => s.authReducer.getNotificationData);
  const totalCount = useSelector((s) => s.authReducer.notificationTotalCount);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [readIds, setReadIds] = useState(new Set());

  const fetchNotifications = useCallback(
    async (skip = 0, reset = false) => {
      setLoading(true);
      if (reset) {
        dispatch({ type: actionTypes.GET_NOTIFICATION_LIST_EMPTY });
      }
      const res = await getNotifications(skip, LIMIT);
      if (res?.statusCode === 200) {
        dispatch({
          type: actionTypes.GET_NOTIFICATION_SUCCESS,
          getNotificationData: res.data,
        });
      }
      setLoading(false);
      setInitialLoad(false);
    },
    [dispatch]
  );

  useEffect(() => {
    // Reset & load fresh
    dispatch({ type: actionTypes.GET_NOTIFICATION_LIST_EMPTY });
    fetchNotifications(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (loading) return;
    if (notifications.length >= (totalCount || 0)) return;
    fetchNotifications(notifications.length);
  };

  const handleMarkAllRead = () => {
    // Mark all read locally (instant)
    setReadIds(new Set(notifications.map((n) => n._id)));
    // Fire API in background
    viewAllNotifications();
    dispatch({ type: actionTypes.GET_NOTIFICATION_COUNT_RESET });
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    const res = await deleteNotification(notifId);
    // .NET may return 200 or success differently
    dispatch({
      type: actionTypes.DELETE_NOTIFICATION_SUCCESS,
      param: { notificationid: notifId },
    });
  };

  const handleClick = (n) => {
    // Mark as read locally (instant) + fire API in background
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(n._id);
      return next;
    });
    readNotification(n._id);

    // Navigate after a brief moment so the user sees the read state change
    const target = getNavTarget(n);
    if (target) {
      setTimeout(() => navigate(target), 300);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Notifications</h2>
        <button onClick={handleMarkAllRead} style={styles.markAllBtn}>
          <MdDoneAll size={18} />
          <span style={{ marginLeft: 4 }}>Mark all read</span>
        </button>
      </div>

      {/* List */}
      <div style={styles.list}>
        {initialLoad && loading ? (
          <p style={styles.emptyText}>Loading...</p>
        ) : notifications.length === 0 ? (
          <p style={styles.emptyText}>No notifications yet</p>
        ) : (
          notifications.map((n) => {
            const IconComp = getIcon(n.type || n.notificationType);
            const iconColor = getColor(n.type || n.notificationType);
            const senderImg = normalizeImg(
              n.senderImage || n.fromUserImage || n.image
            );
            const isRead = n.isRead || readIds.has(n._id);
            const isUnread = !isRead;

            return (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                style={{
                  ...styles.item,
                  backgroundColor: isUnread ? '#e8f5e9' : '#fff',
                  cursor: 'pointer',
                }}
              >
                {/* Avatar / Icon */}
                <div style={styles.avatarWrap}>
                  {senderImg ? (
                    <img
                      src={senderImg}
                      alt=""
                      style={styles.avatar}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        ...styles.iconCircle,
                        backgroundColor: iconColor + '22',
                      }}
                    >
                      <IconComp size={22} color={iconColor} />
                    </div>
                  )}
                  {/* Type badge */}
                  <div
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: iconColor,
                    }}
                  >
                    <IconComp size={12} color="#fff" />
                  </div>
                </div>

                {/* Content */}
                <div style={styles.content}>
                  <p style={styles.message}>
                    {n.textMessage || n.message || n.notificationMessage || n.title || ''}
                  </p>
                  <span style={styles.time}>
                    {relativeTime(n.createdAt || n.created_at || n.date)}
                  </span>
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  {isUnread && (
                    <div style={styles.unreadDot} />
                  )}
                  <button
                    onClick={(e) => handleDelete(e, n._id)}
                    style={styles.deleteBtn}
                    title="Delete"
                  >
                    <MdDelete size={18} color="#999" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Load more */}
        {notifications.length > 0 &&
          notifications.length < (totalCount || 0) && (
            <button onClick={handleLoadMore} style={styles.loadMoreBtn} disabled={loading}>
              {loading ? 'Loading...' : 'Load more'}
            </button>
          )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    paddingBottom: 70,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: '#1a6b3a',
  },
  markAllBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: '1px solid #1a6b3a',
    borderRadius: 20,
    padding: '6px 14px',
    color: '#1a6b3a',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  list: {
    padding: '0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.15s',
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #fff',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    margin: 0,
    fontSize: 14,
    color: '#333',
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    display: 'block',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
    flexShrink: 0,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    background: 'none',
    border: 'none',
    color: '#1a6b3a',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 40,
    fontSize: 15,
  },
};

export default Notifications;
