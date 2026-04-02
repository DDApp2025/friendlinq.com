import { nodeApi } from '../api/axios';
import { LOGIN, LOGOUT, GET_PROFILE, SIGN_UP, BASE_URL, MAKE_FRIEND_WITH_USER, BASE_URL_3, BASE_URL_5, UPDATE_USER_TYPE } from '../api/config';
import * as actionTypes from './actions_types';

export const LoginAttempt = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.LOGIN_ATTEMPT });

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('deviceType', 'ANDROID');
      formData.append('deviceToken', 'web');
      formData.append('latitude', '123.123');
      formData.append('longitude', '222.333');

      const res = await nodeApi.post(LOGIN, formData);
      console.log('Login response:', JSON.stringify(res.data));

      if (res.data?.statusCode === 200) {
        const customerData = res.data.data.customerData;
        const { email: userEmail, accessToken } = customerData;

        localStorage.setItem('accessUserToken', accessToken);

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          email: userEmail,
          login_access_token: accessToken,
        });

        // Store full profile data immediately from login response
        const profileData = { ...customerData };
        if (profileData.imageURL && typeof profileData.imageURL === 'object') {
          profileData.imageURL = profileData.imageURL.thumbnail
            ? 'https://natural.friendlinq.com/' + profileData.imageURL.thumbnail
            : '';
        } else if (profileData.imageURL && typeof profileData.imageURL === 'string' && !profileData.imageURL.startsWith('http')) {
          profileData.imageURL = 'https://natural.friendlinq.com/' + profileData.imageURL;
        }

        dispatch({
          type: actionTypes.GET_PROFILE_SUCCESS,
          getProfile: profileData,
        });

        return { success: true, data: res.data };
      } else {
        dispatch({ type: actionTypes.LOGIN_FAIL });
        return { success: false, message: res.data.message || 'Login failed' };
      }
    } catch (error) {
      dispatch({ type: actionTypes.LOGIN_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Network error' };
    }
  };
};

export const LogoutAttempt = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.LOGOUT_ATTEMPT });

    try {
      const res = await nodeApi.get(LOGOUT);

      if (res.data.statusCode === 200) {
        localStorage.removeItem('accessUserToken');

        dispatch({ type: actionTypes.LOGOUT_SUCCESS });
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          email: '',
          login_access_token: '',
        });

        return { success: true };
      } else {
        dispatch({ type: actionTypes.LOGOUT_FAIL });
        return { success: false, message: res.data.message || 'Logout failed' };
      }
    } catch (error) {
      dispatch({ type: actionTypes.LOGOUT_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Network error' };
    }
  };
};

export const SignUpAttempt = (params) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SIGNUP_ATTEMPT });

    try {
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }

      const res = await nodeApi.post(SIGN_UP, formData);

      if (res.data?.statusCode === 200) {
        dispatch({ type: actionTypes.SIGNUP_SUCCESS });
        return { success: true, statusCode: 200, data: res.data.data, message: res.data.message };
      } else {
        dispatch({ type: actionTypes.SIGNUP_FAIL });
        return { success: false, statusCode: res.data?.statusCode, message: res.data?.message || 'Registration failed' };
      }
    } catch (error) {
      dispatch({ type: actionTypes.SIGNUP_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Network error' };
    }
  };
};

export const makeUserFriendWithAdmin = (userId) => {
  return async () => {
    try {
      const res = await fetch(BASE_URL_3 + MAKE_FRIEND_WITH_USER, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserId: userId }),
      });
      return await res.json();
    } catch (error) {
      return { success: false };
    }
  };
};

export const updateUserType = (token, userId, userType) => {
  return async (dispatch) => {
    try {
      const response = await fetch(BASE_URL_5 + UPDATE_USER_TYPE, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({
          authorization: token,
          user_id: userId,
          user_type: userType === 'dating' ? '1' : '0',
        }),
      });
      const res = await response.json();
      if (res.StatusCode === 200) {
        dispatch({ type: actionTypes.USER_TYPE, userType });
      }
      return res;
    } catch (error) {
      return { StatusCode: 500 };
    }
  };
};

export const setUserType = (userType) => {
  return { type: actionTypes.USER_TYPE, userType };
};

export const getProfileAttempt = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_PROFILE_ATTEMPT });

    try {
      const res = await nodeApi.get(GET_PROFILE);

      if (res.data?.statusCode === 200) {
        const profileData = res.data.data?.customerData || {};
        // imageURL comes as an object { thumbnail, original } — store the full URL
        if (profileData.imageURL && typeof profileData.imageURL === 'object') {
          profileData.imageURL = profileData.imageURL.thumbnail
            ? 'https://natural.friendlinq.com/' + profileData.imageURL.thumbnail
            : '';
        } else if (profileData.imageURL && !profileData.imageURL.startsWith('http')) {
          profileData.imageURL = 'https://natural.friendlinq.com/' + profileData.imageURL;
        }

        dispatch({
          type: actionTypes.GET_PROFILE_SUCCESS,
          getProfile: profileData,
        });

        return { success: true, data: res.data };
      } else {
        dispatch({ type: actionTypes.GET_PROFILE_FAIL });
        return { success: false, message: res.data.message || 'Failed to get profile' };
      }
    } catch (error) {
      dispatch({ type: actionTypes.GET_PROFILE_FAIL });
      return { success: false, message: error?.response?.data?.message || 'Network error' };
    }
  };
};
