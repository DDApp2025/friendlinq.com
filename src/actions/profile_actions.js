import { nodeApi, dotnetApi } from '../api/axios';
import {
  UPLOAD_PROFILE_PIC,
  BANNER_PROFILE_PIC,
  EDIT_PROFILE,
  GET_USER_PROFILE,
  SEND_FRIEND_REQUEST,
  GET_FRIENDS_LIST,
  UNFRIEND,
  GET_USER_ONLINE_STATUS,
  BASE_URL_3,
} from '../api/config';
import * as actionTypes from './actions_types';

import normalizeImg from '../utils/normalizeImg';

export const uploadProfilePic = (file) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.PROFILE_PIC_ATTEMPT });
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await nodeApi.post(UPLOAD_PROFILE_PIC, formData);
      if (res.data?.statusCode === 200) {
        const imageURL = normalizeImg(res.data.data?.imageURL || res.data.data?.customerData?.imageURL);
        dispatch({ type: actionTypes.PROFILE_PIC_SUCCESS, imageURL });
        return { success: true, imageURL };
      }
      dispatch({ type: actionTypes.PROFILE_PIC_FAIL });
      return { success: false, message: res.data?.message };
    } catch (error) {
      dispatch({ type: actionTypes.PROFILE_PIC_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Upload failed' };
    }
  };
};

export const uploadBannerPic = (file) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.BANNER_PIC_ATTEMPT });
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await nodeApi.post(BANNER_PROFILE_PIC, formData);
      if (res.data?.statusCode === 200) {
        const imageURL = normalizeImg(res.data.data?.imageURL || res.data.data?.bannerURL || res.data.data?.customerData?.bannerURL);
        dispatch({ type: actionTypes.BANNER_PIC_SUCCESS, imageURL });
        return { success: true, imageURL };
      }
      dispatch({ type: actionTypes.BANNER_PIC_FAIL });
      return { success: false, message: res.data?.message };
    } catch (error) {
      dispatch({ type: actionTypes.BANNER_PIC_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Upload failed' };
    }
  };
};

export const saveProfileData = (fields) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.EDIT_PROFILE_ATTEMPT });
    try {
      const formData = new FormData();
      Object.keys(fields).forEach((key) => {
        if (fields[key] !== undefined && fields[key] !== null) {
          formData.append(key, fields[key]);
        }
      });
      const res = await nodeApi.post(EDIT_PROFILE, formData);
      if (res.data?.statusCode === 200) {
        const profileData = res.data.data?.customerData || res.data.data || {};
        profileData.imageURL = normalizeImg(profileData.imageURL);
        if (profileData.bannerURL) {
          profileData.bannerURL = normalizeImg(profileData.bannerURL);
        }
        dispatch({ type: actionTypes.EDIT_PROFILE_SUCCESS, getProfile: profileData });
        return { success: true, data: profileData };
      }
      dispatch({ type: actionTypes.EDIT_PROFILE_FAIL });
      return { success: false, message: res.data?.message };
    } catch (error) {
      dispatch({ type: actionTypes.EDIT_PROFILE_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Save failed' };
    }
  };
};

export const getUserProfile = (userId) => {
  return async () => {
    try {
      const res = await nodeApi.get(GET_USER_PROFILE, { params: { userId } });
      if (res.data?.statusCode === 200) {
        const userData = res.data.data?.customerData || res.data.data || {};
        userData.imageURL = normalizeImg(userData.imageURL);
        if (userData.bannerURL) {
          userData.bannerURL = normalizeImg(userData.bannerURL);
        }
        return { success: true, data: userData };
      }
      return { success: false, message: res.data?.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || 'Failed to load profile' };
    }
  };
};

export const sendFriendRequest = (userId) => {
  return async () => {
    try {
      const formData = new FormData();
      formData.append('friendId', userId);
      const res = await nodeApi.post(SEND_FRIEND_REQUEST, formData);
      if (res.data?.statusCode === 200) {
        return { success: true, message: res.data?.message };
      }
      return { success: false, message: res.data?.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || 'Request failed' };
    }
  };
};

export const unfriendUser = (userId, token) => {
  return async () => {
    try {
      const res = await dotnetApi.post(UNFRIEND, {
        authorization: token,
        FriendId: userId,
      });
      if ((res.data?.StatusCode ?? res.data?.statusCode) === 200) {
        return { success: true };
      }
      return { success: false, message: res.data?.Message || res.data?.message };
    } catch (error) {
      return { success: false, message: 'Unfriend failed' };
    }
  };
};

export const getFriendsList = (skip = 0, limit = 100) => {
  return async () => {
    try {
      const formData = new FormData();
      formData.append('skip', skip);
      formData.append('limit', limit);
      formData.append('status', 'Accepted');
      const res = await nodeApi.post(GET_FRIENDS_LIST, formData);
      if (res.data?.statusCode === 200) {
        return { success: true, data: res.data.data };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };
};

export const getUserOnlineStatus = (userId, token) => {
  return async () => {
    try {
      const res = await dotnetApi.post(GET_USER_ONLINE_STATUS, {
        authorization: token,
        UserId: userId,
      });
      if ((res.data?.StatusCode ?? res.data?.statusCode) === 200) {
        return { success: true, isOnline: res.data?.Data?.isOnline || res.data?.data?.isOnline || false };
      }
      return { success: false, isOnline: false };
    } catch {
      return { success: false, isOnline: false };
    }
  };
};
