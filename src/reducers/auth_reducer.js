import * as actionTypes from "../actions/actions_types";

const CALL_STATUS_DISCONNECTED = 0;

const initialState = {
  email: "",
  login_access_token: "",
  userType: "normal",
  getProfileData: {},
  getMyPosts: [],
  resetPasswordToken: "",
  myCommentOnMyPosts: [],
  deviceToken: "abc",
  getMessagesData: [],
  callStatus: CALL_STATUS_DISCONNECTED,
  navigationProps: {},
  getNotificationData: [],
  notificationCount: null,
  notificationTotalCount: null,
  appVersion: "",
  chatnotificationCount: null,
  isUserHavePlan: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_ATTEMPT: {
      return {
        ...state,
      };
    }
    case actionTypes.USER_TYPE: {
      return {
        ...state,
        userType: action?.userType ?? 'normal'
      };
    }

    case actionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        email: action.email,
        login_access_token: action.login_access_token,
      };
    }

    case actionTypes.LOGIN_FAIL: {
      return {
        ...state,
      };
    }
    case actionTypes.EDIT_PROFILE_ATTEMPT: {
      return {
        ...state,
      };
    }

    case actionTypes.EDIT_PROFILE_SUCCESS: {
      return {
        ...state,
        getProfileData: action.getProfile,
      };
    }

    case actionTypes.EDIT_PROFILE_FAIL: {
      return {
        ...state,
      };
    }
    case actionTypes.GET_PROFILE_ATTEMPT: {
      return {
        ...state,
      };
    }

    case actionTypes.DELETE_MY_POST_SUCCESS: {
      let newpost = state.getMyPosts.filter((post) => {
        if (post._id === action.data.postId) {
          return false;
        }
        return true;
      });
      return {
        ...state,
        getMyPosts: newpost,
      };
    }

    case actionTypes.EDIT_MY_POST_SUCCESS: {
      let newpost = state.getMyPosts.map((post) => {
        if (post._id === action.post._id) {
          return {...post, ...action.data};
        }
        else {
          return post;
        }
      });
      return {
        ...state,
        getMyPosts: newpost,
      };
    }

    case actionTypes.GET_PROFILE_SUCCESS: {
      return {
        ...state,
        getProfileData: action.getProfile,
      };
    }

    case actionTypes.GET_PROFILE_FAIL: {
      return {
        ...state,
      };
    }
    case actionTypes.PROFILE_PIC_SUCCESS: {
      let getProfileData = state.getProfileData;
      getProfileData = { ...getProfileData, imageURL: action.imageURL };

      return {
        ...state,
        getProfileData: getProfileData,
      };
    }
    case actionTypes.BANNER_PIC_SUCCESS: {
      let getProfileData = state.getProfileData;
      getProfileData = { ...getProfileData, bannerURL: action.imageURL };

      return {
        ...state,
        getProfileData: getProfileData,
      };
    }
    case actionTypes.SOCIAL_LOGIN_SUCCESS: {
      return {
        ...state,
        login_access_token: action.getProfile.accessToken,
      };
    }
    case actionTypes.GET_MY_POST_SUCCESS: {
      return {
        ...state,
        getMyPosts: [...action.myPosts ?? []],
      };
    }
    case actionTypes.UPDATE_MY_POST: {
      return {
        ...state,
        getMyPosts: state.getMyPosts?.map((e) =>
          e?._id === action.post?._id ? action.post : e
        ),
      };
    }
    case actionTypes.SET_MY_POSTS_LIST_EMPTY: {
      return {
        ...state,
        getMyPosts: [],
      };
    }
    case actionTypes.VERIFY_OTP_SUCCESS: {
      return {
        ...state,
        resetPasswordToken: action.resetPasswordToken,
      };
    }

    case actionTypes.GET_MY_COMMENT_ON_MY_POSTS_SUCCESS: {
      let newPosts = [...state.getMyPosts];
      newPosts = newPosts.map((post) => {
        if (post._id === action.postId) {
          post.totalComment = action.myCommentOnMyPosts.length;
          let commentArray = [];
          for (let idx = 0; idx < action.myCommentOnMyPosts.length; idx++) {
            commentArray.push(action.myCommentOnMyPosts[idx]);
            if (idx === 1) {
              break;
            }
          }
          post.comment = commentArray;
        }
        return post;
      });

      return {
        ...state,
        myCommentOnMyPosts: action.myCommentOnMyPosts,
        getMyPosts: newPosts,
      };
    }
    case actionTypes.MY_POST_LIKE_SUCCESS: {
      let newMyPosts = [...state.getMyPosts];
      newMyPosts = newMyPosts.map((post) => {
        if (post._id === action.parameter.postId) {
          post.isLike = action.parameter.isLike;
          post.totalLike = action.parameter.isLike
            ? post.totalLike + 1
            : post.totalLike - 1;
          if (post.isDislike) {
            post.isDislike = false;
            post.totalDislike =
              post.totalDislike - 1 > 0 ? post.totalDislike - 1 : 0;
          }
        }
        return post;
      });
      return {
        ...state,
        getMyPosts: newMyPosts,
      };
    }
    case actionTypes.MY_POST_DISLIKE_SUCCESS: {
      let newMyPosts = [...state.getMyPosts];
      newMyPosts = newMyPosts.map((post) => {
        if (post._id === action.parameter.postId) {
          post.isDislike = action.parameter.isDislike;
          post.totalDislike = action.parameter.isDislike
            ? post.totalDislike + 1
            : post.totalDislike - 1;
          if (post.isLike) {
            post.isLike = false;
            post.totalLike =
              post.totalLike - 1 > 0 ? post.totalLike - 1 : 0;
          }
        }
        return post;
      });
      return {
        ...state,
        getMyPosts: newMyPosts,
      };
    }
    case actionTypes.DELETE_COMMENT_SUCCESS: {
      let deleteComment = [...state.myCommentOnMyPosts];
      deleteComment = deleteComment.filter((cmnt) => {
        if (cmnt._id === action.parameter.commenttId) {
          return false;
        }
        return true;
      });

      let newPosts = [...state.getMyPosts];
      newPosts = newPosts.map((post) => {
        if (post._id === action.parameter.postId) {
          post.totalComment = post.totalComment - 1;
          let commentArray = post?.comment?.filter((cmnt) => {
            if (cmnt._id === action.parameter.commenttId) {
              return false;
            }
            return true;
          });
          post.comment = commentArray;
        }
        return post;
      });

      return {
        ...state,
        myCommentOnMyPosts: deleteComment,
        getMyPosts: newPosts,
      };
    }
    case actionTypes.SAVE_TOKEN: {
      return {
        ...state,
        deviceToken: action.token,
      };
    }
    case actionTypes.GET_TEXT_MESSAGE_SUCCESS: {
      return {
        ...state,
        getMessagesData: action.getMessagesData.reverse(),
      };
    }
    case actionTypes.SET_CALL_STATUS: {
      return {
        ...state,
        callStatus: action.status,
      };
    }
    case actionTypes.NAVIGATION_PROPS_SUCCESS: {
      return {
        ...state,
        navigationProps: action.navigationProps,
      };
    }
    case actionTypes.GET_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        getNotificationData: [
          ...state.getNotificationData,
          ...action.getNotificationData.notificationData,
        ],
        notificationCount: action.getNotificationData.totalUnView,
        notificationTotalCount: action.getNotificationData.totalCount,
      };
    }
    case actionTypes.DELETE_NOTIFICATION_SUCCESS: {
      let getNotificationData = [...state.getNotificationData];
      if (action?.param?.deleteallnotifications === 1) {
        getNotificationData = [];
      } else {
        getNotificationData = getNotificationData.filter(
          (e) => e?._id !== action?.param?.notificationid
        );
      }
      return {
        ...state,
        getNotificationData: getNotificationData,
      };
    }
    case actionTypes.GET_CHAT_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        chatnotificationCount: action.getChatNotificationData,
      };
    }
    case actionTypes.GET_NOTIFICATION_COUNT_RESET: {
      return {
        ...state,
        notificationCount: null,
      };
    }
    case actionTypes.GET_NOTIFICATION_LIST_EMPTY: {
      return {
        ...state,
        getNotificationData: [],
      };
    }
    case actionTypes.CHECK_POST_FOR_LIKE_UNLIKE_COMMENT_ATTEMPT: {
      let newPosts = [...state.getMyPosts];
      newPosts = newPosts.map((post) => {
        if (post._id === action.parameter.data.postId) {
          if (action.parameter.data.status === "USER_LIKE_POST") {
            post.totalLike = post.totalLike + 1;
          } else if (action.parameter.data.status === "USER_UNLIKE_POST") {
            post.totalLike = post.totalLike - 1;
          } else if (action.parameter.data.status === "USER_COMMENT_POST") {
            post.totalComment = post.totalComment + 1;
          }
        }
        return post;
      });

      return {
        ...state,
        getMyPosts: newPosts,
      };
    }
    case actionTypes.GET_APP_VERSION_SUCCESS: {
      return {
        ...state,
        appVersion: action.appVersion.newversion,
      };
    }
    case actionTypes.IS_USER_HAVE_PLAN: {
      return {
        ...state,
        isUserHavePlan: action.havePlan,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
