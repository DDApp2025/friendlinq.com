import { nodeApi, dotnetApi } from '../api/axios';
import {
  GET_NOTIFICATION,
  READ_NOTIFICATION,
  VIEW_ALL_NOTIFICATION,
  DELETE_NOTIFICATION,
} from '../api/config';

// ── Get notifications (Node — GET with query params) ─────
// POST + auth header triggers CORS preflight that the Node server
// doesn't handle for notification routes. GET works (same as
// getChatMessages and getProfile).
export const getNotifications = async (skip = 0, limit = 20) => {
  try {
    const url = GET_NOTIFICATION + '?skip=' + skip + '&limit=' + limit;
    const res = await nodeApi.get(url);
    return res.data;
  } catch (err) {
    console.error('getNotifications error:', err);
    return { statusCode: 500 };
  }
};

// ── Mark one notification read (Node — GET) ──────────────
export const readNotification = async (notificationId) => {
  try {
    const url = READ_NOTIFICATION + '?notificationId=' + notificationId;
    const res = await nodeApi.get(url);
    return res.data;
  } catch (err) {
    console.error('readNotification error:', err);
    return { statusCode: 500 };
  }
};

// ── Mark all notifications read (Node — GET) ─────────────
export const viewAllNotifications = async () => {
  try {
    const res = await nodeApi.get(VIEW_ALL_NOTIFICATION);
    return res.data;
  } catch (err) {
    console.error('viewAllNotifications error:', err);
    return { statusCode: 500 };
  }
};

// ── Delete notification (.NET, JSON) ─────────────────────
export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem('accessUserToken');
    const res = await dotnetApi.post(DELETE_NOTIFICATION, {
      authorization: token,
      notificationid: notificationId,
    });
    return res.data;
  } catch (err) {
    console.error('deleteNotification error:', err);
    return { statusCode: 500 };
  }
};
