import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getChatMessages, sendMessage, sendMediaMessage, markChatRead } from '../actions/chat_actions';
import SOCKET from '../api/socket';
import normalizeImg from '../utils/normalizeImg';
import { MdArrowBack, MdSend, MdAttachFile, MdClose } from 'react-icons/md';

const LIMIT = 50;

export default function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId: receiverId } = useParams();
  const location = useLocation();

  const token = useSelector((s) => s.authReducer.login_access_token);
  const profile = useSelector((s) => s.authReducer.getProfileData);
  const myId = profile?._id || profile?.id || '';

  // Other user info from navigation state
  const otherUser = location.state || {};
  const otherName = otherUser.userName || 'Chat';
  const otherImage = normalizeImg(otherUser.userImage || '');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // ── Scroll to bottom ───────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // ── Load messages ──────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!myId || !receiverId) return;
    setLoading(true);
    const res = await dispatch(getChatMessages(myId, receiverId, 0, LIMIT));
    if (res.success) {
      setMessages(res.data || []);
    }
    setLoading(false);
    scrollToBottom();
  }, [dispatch, myId, receiverId, scrollToBottom]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // ── Mark as read ───────────────────────────────────────
  useEffect(() => {
    if (token && receiverId) {
      dispatch(markChatRead(token, receiverId));
    }
  }, [dispatch, token, receiverId]);

  // ── Socket.IO real-time ────────────────────────────────
  useEffect(() => {
    if (!myId) return;

    // Connect socket if not connected
    if (!SOCKET.connected) {
      SOCKET.connect();
    }

    // Emit login/join so server knows our userId
    SOCKET.emit('login', { userId: myId });

    const handleNewMessage = (data) => {
      // senderId can be an object { _id: '...' } or a plain string
      const rawSender = data?.senderId;
      const msgSenderId = typeof rawSender === 'object' ? rawSender?._id : (rawSender || data?.sender_id || data?.from);
      const rawReceiver = data?.receiverId;
      const msgReceiverId = typeof rawReceiver === 'object' ? rawReceiver?._id : (rawReceiver || data?.receiver_id || data?.to);

      const isForThisChat =
        (msgSenderId === receiverId && msgReceiverId === myId) ||
        (msgSenderId === myId && msgReceiverId === receiverId);

      if (isForThisChat) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((m) => m._id === data._id);
          if (exists) return prev;
          return [...prev, data];
        });
        scrollToBottom();

        // Mark as read since we're in the chat
        if (msgSenderId === receiverId) {
          dispatch(markChatRead(token, receiverId));
        }
      }
    };

    // Listen to both event names from the RN app
    SOCKET.on('newMessage', handleNewMessage);
    SOCKET.on('chatMessage', handleNewMessage);

    return () => {
      SOCKET.off('newMessage', handleNewMessage);
      SOCKET.off('chatMessage', handleNewMessage);
    };
  }, [myId, receiverId, token, dispatch, scrollToBottom]);

  // ── Send text message ──────────────────────────────────
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !mediaFile) return;
    setSending(true);

    if (mediaFile) {
      const res = await dispatch(sendMediaMessage(myId, receiverId, mediaFile));
      if (res.success) {
        clearMedia();
      }
    }

    if (trimmed) {
      const res = await dispatch(sendMessage(myId, receiverId, trimmed));
      if (res.success) {
        // Optimistic: add to local messages
        const newMsg = {
          _id: Date.now().toString(),
          senderId: myId,
          receiverId: receiverId,
          textMessage: trimmed,
          createdAt: new Date().toISOString(),
          ...(res.data || {}),
        };
        setMessages((prev) => [...prev, newMsg]);
        setText('');
        scrollToBottom();
      }
    }

    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Media picker ───────────────────────────────────────
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

  // ── Helpers ────────────────────────────────────────────
  const isMine = (msg) => {
    // senderId can be an object with _id (from Node API) or a plain string
    const sid = typeof msg.senderId === 'object' ? msg.senderId?._id : (msg.senderId || msg.sender_id || msg.from);
    return sid === myId;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageMedia = (msg) => {
    const url = msg.mediaUrl || msg.media || msg.fileUrl || msg.file || '';
    if (!url) return null;
    return normalizeImg(url);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/messages')} style={styles.backBtn}>
          <MdArrowBack size={24} color="#fff" />
        </button>
        <div style={styles.headerAvatarWrap}>
          {otherImage ? (
            <img src={otherImage} alt={otherName} style={styles.headerAvatar} />
          ) : (
            <div style={styles.headerAvatarFallback}>
              {(otherName || '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span style={styles.headerName}>{otherName}</span>
      </div>

      {/* Messages area */}
      <div ref={chatContainerRef} style={styles.messagesArea}>
        {loading && <div style={styles.loadingText}>Loading messages...</div>}

        {!loading && messages.length === 0 && (
          <div style={styles.emptyText}>No messages yet. Say hello!</div>
        )}

        {messages.map((msg, idx) => {
          const mine = isMine(msg);
          const mediaUrl = getMessageMedia(msg);

          return (
            <div
              key={msg._id || idx}
              style={{
                ...styles.msgRow,
                justifyContent: mine ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: mine ? '#1a6b3a' : '#e8e8e8',
                  color: mine ? '#fff' : '#222',
                  borderBottomRightRadius: mine ? 4 : 16,
                  borderBottomLeftRadius: mine ? 16 : 4,
                }}
              >
                {mediaUrl && (
                  <img src={mediaUrl} alt="Shared media" style={styles.msgMedia} />
                )}
                {(msg.textMessage || msg.message || msg.text || msg.content) && (
                  <span style={styles.msgText}>{msg.textMessage || msg.message || msg.text || msg.content}</span>
                )}
                <span
                  style={{
                    ...styles.msgTime,
                    color: mine ? 'rgba(255,255,255,0.6)' : '#999',
                  }}
                >
                  {formatTime(msg.createdAt || msg.created_at || msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Media preview */}
      {mediaPreview && (
        <div style={styles.mediaPreviewBar}>
          <img src={mediaPreview} alt="Media attachment preview" style={styles.mediaThumb} />
          <span style={styles.mediaFileName}>{mediaFile?.name}</span>
          <button onClick={clearMedia} style={styles.clearMediaBtn}>
            <MdClose size={18} />
          </button>
        </div>
      )}

      {/* Input area */}
      <div style={styles.inputArea}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleMediaSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={styles.attachBtn}
        >
          <MdAttachFile size={22} color="#666" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.textInput}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          style={{
            ...styles.sendBtn,
            opacity: (!text.trim() && !mediaFile) || sending ? 0.5 : 1,
          }}
          disabled={(!text.trim() && !mediaFile) || sending}
        >
          <MdSend size={22} color="#fff" />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 56px)',
    maxWidth: 600,
    margin: '0 auto',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    backgroundColor: '#1a6b3a',
    flexShrink: 0,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  headerAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  headerAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    flex: 1,
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 12px 8px',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 14,
  },
  msgRow: {
    display: 'flex',
    marginBottom: 8,
  },
  bubble: {
    maxWidth: '75%',
    padding: '8px 12px',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  msgTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  msgMedia: {
    maxWidth: '100%',
    maxHeight: 200,
    borderRadius: 8,
    objectFit: 'cover',
    marginBottom: 4,
  },
  mediaPreviewBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #eee',
  },
  mediaThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    objectFit: 'cover',
  },
  mediaFileName: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clearMediaBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    color: '#999',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderTop: '1px solid #eee',
    backgroundColor: '#fff',
    flexShrink: 0,
  },
  attachBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  textInput: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    backgroundColor: '#1a6b3a',
    border: 'none',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
};
