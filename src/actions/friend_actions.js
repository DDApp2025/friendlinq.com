import { nodeApi, dotnetApi } from '../api/axios';
import {
  GET_FRIENDS_LIST,
  ACCEPT_FRIEND_REQUEST,
  GET_USERS,
  SEND_FRIEND_REQUEST,
  UNFRIEND,
  GET_FRIEND_COUNT_ENDPOINT,
  BASE_URL_2,
} from '../api/config';
import * as T from './actions_types';
import normalizeImg from '../utils/normalizeImg';

// ── helpers ────────────────────────────────────────────────
function normalizeFriend(f) {
  if (!f) return f;
  return { ...f, imageURL: normalizeImg(f.imageURL) };
}

function normalizeList(raw) {
  return (raw || []).map(normalizeFriend);
}

// ── 62. Friends list (status="Accepted") ───────────────────
export const getFriendList = (skip = 0, limit = 20) => {
  return async (dispatch) => {
    dispatch({ type: T.GET_FRIEND_LIST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('status', 'Accepted');
      fd.append('skip', skip);
      fd.append('limit', limit);
      const res = await nodeApi.post(GET_FRIENDS_LIST, fd);
      if (res.data?.statusCode === 200) {
        const list = normalizeList(
          res.data.data?.friendList || res.data.data?.myFriendList || []
        );
        const total =
          res.data.data?.totalFriend ??
          res.data.data?.totalMyFriend ??
          list.length;
        const topFourFriendList = res.data.data?.topFourFriendList || [];
        dispatch({ type: T.GET_FRIEND_LIST_SUCCESS, payload: { list, total, topFourFriendList } });
        return { success: true, data: list, total, topFourFriendList };
      }
      dispatch({ type: T.GET_FRIEND_LIST_FAIL });
      return { success: false };
    } catch (e) {
      dispatch({ type: T.GET_FRIEND_LIST_FAIL });
      return { success: false };
    }
  };
};

// ── 63. Friend count (.NET) ────────────────────────────────
export const getFriendCount = (token) => {
  return async () => {
    try {
      const res = await dotnetApi.post('/Client' + GET_FRIEND_COUNT_ENDPOINT, {
        authorization: token,
      });
      if ((res.data?.StatusCode ?? res.data?.statusCode) === 200) {
        return {
          success: true,
          count: res.data?.Data?.count ?? res.data?.data?.count ?? 0,
        };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };
};

// ── 64. Incoming requests (status="Pending") ──────────────
export const getIncomingRequests = (skip = 0, limit = 20) => {
  return async (dispatch) => {
    dispatch({ type: T.GET_FRIEND_COMING_REQUESTS_LIST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('status', 'Pending');
      fd.append('skip', skip);
      fd.append('limit', limit);
      const res = await nodeApi.post(GET_FRIENDS_LIST, fd);
      if (res.data?.statusCode === 200) {
        const list = normalizeList(
          res.data.data?.friendList || res.data.data?.myFriendList || []
        );
        dispatch({
          type: T.GET_FRIEND_COMING_REQUESTS_LIST_SUCCESS,
          payload: { list },
        });
        return { success: true, data: list };
      }
      dispatch({ type: T.GET_FRIEND_COMING_REQUESTS_LIST_FAIL });
      return { success: false };
    } catch {
      dispatch({ type: T.GET_FRIEND_COMING_REQUESTS_LIST_FAIL });
      return { success: false };
    }
  };
};

// ── 65. Sent requests (status="Send") ─────────────────────
export const getSentRequests = (skip = 0, limit = 20) => {
  return async (dispatch) => {
    dispatch({ type: T.GET_FRIEND_OUTGOING_REQUESTS_LIST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('status', 'Send');
      fd.append('skip', skip);
      fd.append('limit', limit);
      const res = await nodeApi.post(GET_FRIENDS_LIST, fd);
      if (res.data?.statusCode === 200) {
        const list = normalizeList(
          res.data.data?.friendList || res.data.data?.myFriendList || []
        );
        dispatch({
          type: T.GET_FRIEND_OUTGOING_REQUESTS_LIST_SUCCESS,
          payload: { list },
        });
        return { success: true, data: list };
      }
      dispatch({ type: T.GET_FRIEND_OUTGOING_REQUESTS_LIST_FAIL });
      return { success: false };
    } catch {
      dispatch({ type: T.GET_FRIEND_OUTGOING_REQUESTS_LIST_FAIL });
      return { success: false };
    }
  };
};

// ── 66. Accept friend request ──────────────────────────────
export const acceptFriendRequest = (friendId) => {
  return async (dispatch) => {
    dispatch({ type: T.ACCEPT_FRIEND_REQUEST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('friendId', friendId);
      const res = await nodeApi.post(ACCEPT_FRIEND_REQUEST, fd);
      if (res.data?.statusCode === 200) {
        dispatch({ type: T.ACCEPT_FRIEND_REQUEST_SUCCESS, friendId });
        return { success: true };
      }
      dispatch({ type: T.ACCEPT_FRIEND_REQUEST_FAIL });
      return { success: false, message: res.data?.message };
    } catch (e) {
      dispatch({ type: T.ACCEPT_FRIEND_REQUEST_FAIL });
      return { success: false, message: 'Accept failed' };
    }
  };
};

// ── 66b. Reject friend request ─────────────────────────────
export const rejectFriendRequest = (friendId) => {
  return async (dispatch) => {
    dispatch({ type: T.REJECT_FRIEND_REQUEST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('friendId', friendId);
      fd.append('status', 'Rejected');
      const res = await nodeApi.post(ACCEPT_FRIEND_REQUEST, fd);
      if (res.data?.statusCode === 200) {
        dispatch({ type: T.REJECT_FRIEND_REQUEST_SUCCESS, friendId });
        return { success: true };
      }
      dispatch({ type: T.REJECT_FRIEND_REQUEST_FAIL });
      return { success: false };
    } catch {
      dispatch({ type: T.REJECT_FRIEND_REQUEST_FAIL });
      return { success: false };
    }
  };
};

// ── 67. Unfriend (.NET) ────────────────────────────────────
export const unfriend = (friendId, token) => {
  return async (dispatch) => {
    dispatch({ type: T.UNFRIEND_ATTEMPT });
    try {
      const res = await dotnetApi.post(UNFRIEND, {
        authorization: token,
        FriendId: friendId,
      });
      if ((res.data?.StatusCode ?? res.data?.statusCode) === 200) {
        dispatch({ type: T.UNFRIEND_SUCCESS, friendId });
        return { success: true };
      }
      dispatch({ type: T.UNFRIEND_FAIL });
      return { success: false };
    } catch {
      dispatch({ type: T.UNFRIEND_FAIL });
      return { success: false };
    }
  };
};

// ── 68. Search users ───────────────────────────────────────
export const searchUsers = (query) => {
  return async (dispatch) => {
    dispatch({ type: T.SEARCH_USER_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('searchText', query);
      fd.append('skip', 0);
      fd.append('limit', 100);
      const res = await nodeApi.post(GET_USERS, fd);
      if (res.data?.statusCode === 200) {
        const list = normalizeList(
          res.data.data?.customerData || res.data.data?.userData || res.data.data?.users || res.data.data || []
        );
        dispatch({ type: T.SEARCH_USER_SUCCESS, payload: list });
        return { success: true, data: list };
      }
      dispatch({ type: T.SEARCH_USER_FAIL });
      return { success: false };
    } catch {
      dispatch({ type: T.SEARCH_USER_FAIL });
      return { success: false };
    }
  };
};

// ── 69. Send friend request ────────────────────────────────
export const sendFriendReq = (friendId) => {
  return async (dispatch) => {
    dispatch({ type: T.SEND_FRIEND_REQUEST_ATTEMPT });
    try {
      const fd = new FormData();
      fd.append('friendId', friendId);
      const res = await nodeApi.post(SEND_FRIEND_REQUEST, fd);
      if (res.data?.statusCode === 200) {
        dispatch({ type: T.SEND_FRIEND_REQUEST_SUCCESS, friendId });
        return { success: true, message: res.data?.message };
      }
      dispatch({ type: T.SEND_FRIEND_REQUEST_FAIL });
      return { success: false, message: res.data?.message };
    } catch (e) {
      dispatch({ type: T.SEND_FRIEND_REQUEST_FAIL });
      return { success: false, message: 'Request failed' };
    }
  };
};
