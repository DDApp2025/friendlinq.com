import { nodeApi, dotnetApi } from '../api/axios';
import {
  SEND_TEXT_MESSAGE,
  GET_TEXT_MESSAGE,
  CHAT_MEDIA_MESSAGE,
  GET_CHAT_NOTIFICATION_END_POINT,
  READ_CHAT_NOTIFICATION_END_POINT,
  READ_TAB_COUNTER_NOTIFICATION_END_POINT,
} from '../api/config';
import * as T from './actions_types';

// ── Chat list (.NET) ──────────────────────────────────────
export const getChatList = (token) => {
  return async (dispatch) => {
    try {
      const res = await dotnetApi.post(GET_CHAT_NOTIFICATION_END_POINT, {
        authorization: token,
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      if (code === 200) {
        const list = res.data?.Data || res.data?.data || [];
        return { success: true, data: list };
      }
      return { success: false };
    } catch (e) {
      console.error('getChatList error:', e);
      return { success: false };
    }
  };
};

// ── Unread chat count (.NET) ──────────────────────────────
export const getChatCount = (token) => {
  return async (dispatch) => {
    try {
      const res = await dotnetApi.post(READ_TAB_COUNTER_NOTIFICATION_END_POINT, {
        authorization: token,
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      if (code === 200) {
        const count = res.data?.Data?.count ?? res.data?.data?.count ?? res.data?.Data ?? 0;
        dispatch({ type: T.GET_CHAT_NOTIFICATION_SUCCESS, getChatNotificationData: count });
        return { success: true, count };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };
};

// ── Get messages (Node — GET with query params, mirrors RN) ──
export const getChatMessages = (senderId, receiverId, skip = 0, limit = 50) => {
  return async (dispatch) => {
    dispatch({ type: T.GET_TEXT_MESSAGE_ATTEMPT });
    try {
      const url = GET_TEXT_MESSAGE + '?receiverId=' + receiverId + '&skip=' + skip + '&limit=' + limit;
      const res = await nodeApi.get(url);
      if (res.data?.statusCode === 200) {
        const messages = res.data.data?.chatData || res.data.data?.messages || res.data.data?.chatMessages || res.data.data || [];
        dispatch({ type: T.GET_TEXT_MESSAGE_SUCCESS, getMessagesData: messages });
        return { success: true, data: messages };
      }
      dispatch({ type: T.GET_TEXT_MESSAGE_FAIL });
      return { success: false };
    } catch (e) {
      console.error('getChatMessages error:', e);
      dispatch({ type: T.GET_TEXT_MESSAGE_FAIL });
      return { success: false };
    }
  };
};

// ── Send message (Node — FormData) ────────────────────────
export const sendMessage = (senderId, receiverId, message) => {
  return async (dispatch) => {
    dispatch({ type: T.SEND_TEXT_MESSAGE_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('receiverId', receiverId);
      fd.append('textMessage', message);
      const res = await nodeApi.post(SEND_TEXT_MESSAGE, fd);
      if (res.data?.statusCode === 200) {
        dispatch({ type: T.SEND_TEXT_MESSAGE_SUCCESS });
        return { success: true, data: res.data.data };
      }
      dispatch({ type: T.SEND_TEXT_MESSAGE_FAIL });
      return { success: false };
    } catch (e) {
      console.error('sendMessage error:', e);
      dispatch({ type: T.SEND_TEXT_MESSAGE_FAIL });
      return { success: false };
    }
  };
};

// ── Send media (Node — FormData with file) ────────────────
export const sendMediaMessage = (senderId, receiverId, file) => {
  return async (dispatch) => {
    dispatch({ type: T.CHAT_MEDIA_MESSAGE_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('receiverId', receiverId);
      fd.append('file', file);
      const res = await nodeApi.post(CHAT_MEDIA_MESSAGE, fd);
      if (res.data?.statusCode === 200) {
        dispatch({ type: T.CHAT_MEDIA_MESSAGE_SUCCESS });
        return { success: true, data: res.data.data };
      }
      dispatch({ type: T.CHAT_MEDIA_MESSAGE_FAIL });
      return { success: false };
    } catch (e) {
      console.error('sendMediaMessage error:', e);
      dispatch({ type: T.CHAT_MEDIA_MESSAGE_FAIL });
      return { success: false };
    }
  };
};

// ── Mark as read (.NET) ───────────────────────────────────
export const markChatRead = (token, otherUserId) => {
  return async () => {
    try {
      const res = await dotnetApi.post(READ_CHAT_NOTIFICATION_END_POINT, {
        authorization: token,
        senderId: otherUserId,
        dateTime: new Date().toISOString(),
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      return { success: code === 200 };
    } catch {
      return { success: false };
    }
  };
};
