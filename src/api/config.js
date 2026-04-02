import { io } from 'socket.io-client';

export const BASE_URL = 'https://natural.friendlinq.com'; // node
export const BASE_URL_2 = 'https://unpokedfolks.com/api/Client'; // .net
export const BASE_URL_5 = 'https://unpokedfolks.com/api';
export const BASE_URL_3 = 'https://unpokedfolks.com/api';
export const BASE_URL_4 = "https://unpokedfolks.com/Customer";

export const BASE_URL_IMAGE = 'https://unpokedfolks.com';

export const SOCKET = io("http://44.209.181.33:3155", {
  autoConnect: false,
  reconnectionDelay: 1000,
  reconnection: true,
  transports: ["websocket"],
  jsonp: false,
  rejectUnauthorized: false,
  timeout: 20000,
});

export const MAX_GROUP_CALL_USERS_COUNT = 100;

export const REPORT_SMS_POST = "/v1/sendSMS";
export const UPLOAD_GROUP_PROFILE_PIC = "/api/v1/postGroup/updateGroupIcon";

export const REPORT_POST = '/Post/UpdatePostSensitivity';
export const GET_GROUP_FOR_JOIN = "/Group/GetGroups";
export const SEND_REQUEST_GROUP_FOR_JOIN = "/Group/SubmitGroupRequest";
export const GROUP_REQUESTS = "/Group/GetGroupRequest";
export const ACCEPT_GROUP_REQUESTS = "/Group/ProcessGroupRequest";
export const SHARE_POST = "/Post/SharePost";
export const GET_GROUP_LIST = "/Group/GetGroupsList";
export const GET_APP_VERSION_IOS = "/GetLatestVersioniOS";
export const GET_APP_VERSION_ANDROID = "/GetLatestVersionandriod";
export const MAKE_FRIEND_WITH_USER = "/Friend/MakeUserFriendWithAdmin";
export const SUBMIT_PHONE_NUMBERS_FOR_FRIENDS_SUGGESTION = "/Friend/SubmitPhoneNumberSuggestion";
export const FRIENDS_SUGGESTION = "/Friend/GetSuggestion";
export const GET_PUBLIC_POST = "/Post/PublicPost";
export const UNFRIEND = "/Friend/DeleteFreind";

export const SIGN_UP = '/api/v1/user/registration';
export const LOGIN = '/api/v1/user/login';
export const UPLOAD_PROFILE_PIC = '/api/v1/user/uploadsProfilePic';
export const BANNER_PROFILE_PIC = '/api/v1/user/uploadsBannerImage';
export const UPLOAD_PORTFOLIO_PIC = '/api/v1/post/createPortfolio';
export const GET_PROFILE = '/api/user/getProfile';
export const EDIT_PROFILE = '/api/v1/user/saveProfileData';
export const GOOGLE_LOGIN = '/api/v1/user/loginWithGoogle';
export const GET_USERS = '/api/user/searchUser';
export const GET_USER_PROFILE = '/api/user/getProfileofAnotherUser';
export const CREATE_MY_POST = '/api/v1/post/createPost';
export const GET_MY_POST = '/api/post/getMyPost';
export const DELETE_MY_POST = '/api/post/deleteMyPost';
export const SEND_FRIEND_REQUEST = '/api/user/sendFriendRequest';
export const FORGOT_PASSWORD = '/api/v1/user/forgotPassword';
export const VERIFY_OTP = '/api/user/verifyOtp';
export const RESET_PASSWORD = '/api/user/resetPassword';
export const CHANGE_PASSWORD = '/api/v1/user/changePassword';
export const LOGOUT = '/api/user/logout';
export const GET_FRIENDS_LIST = '/api/user/getFriendList';
export const ACCEPT_FRIEND_REQUEST = '/api/user/acceptFriendRequest';
export const MY_POST_LIKE = '/api/v1/post/likeUnlikePost';
export const MY_POST_DISLIKE = '/api/v1/post/dislikePost';
export const COMMENT_POST = '/api/v1/post/postComment';
export const GET_COMMENT = '/api/post/getPostComment';
export const GET_ANOTHER_USERS_POST = '/api/post/getAnotherUsersPost';
export const GET_ALL_USERS_POST = '/api/post/getAllFriendsPost';
export const DELETE_COMMENT = '/api/post/deleteComment';
export const SEND_TEXT_MESSAGE = '/api/v1/chat/sendMessage';
export const GET_TEXT_MESSAGE = '/api/v1/chat/getChatMessage';
export const CHAT_MEDIA_MESSAGE = '/api/v1/chat/chatMedia';
export const GET_NOTIFICATION = '/api/v1/notification/getNotification';
export const CREATE_GROUP = '/api/v1/postGroup/createGroup';
export const GET_GROUPS_LIST = '/api/v1/postGroup/getGroupList';
export const DELETE_GROUP = '/api/postGroup/deleteGroup';
export const GET_GROUP_MEMBERS = '/api/v1/postGroup/getMemberOfGroup';
export const ADD_GROUP_MEMBERS = '/api/v1/postGroup/addMember';
export const CREATE_GROUP_POST = '/api/v1/postGroup/createGroupPost';
export const GET_GROUP_POST = '/api/postGroup/getGroupPost';
export const DELETE_GROUP_MEMBERS = '/api/postGroup/deleteMemberOfGroup';
export const CLEAR_GROUP_MEMBERS_UIDS = '/api/v1/postGroup/RefreshForGroupCall';
export const LEFT_GROUP = '/api/postGroup/leftGroup';
export const READ_NOTIFICATION = '/api/v1/notification/readNotification';
export const DELETE_NOTIFICATION = '/Notification/DeleteNotification';
export const VIEW_ALL_NOTIFICATION = '/api/v1/notification/viewAllNotification';
export const GET_OTP_ON_EMAIL = '/sendforgotemail';
export const GET_CHAT_NOTIFICATION_END_POINT = '/Chat/GetChatList';
export const READ_CHAT_NOTIFICATION_END_POINT = '/Chat/ReadChat';
export const DELETE_CHAT_NOTIFICATION_END_POINT = '/Chat/DeleteAllChat';
export const READ_TAB_COUNTER_NOTIFICATION_END_POINT = '/Chat/GetCount';
export const ADD_ADMIN_TO_GROUP_END_POINT = '/Group/AddAdminToGroup';
export const FIND_FRIRND_OR_NOT_END_POINT = '/Customer/IsFriend';
export const UPDATE_USER_LOCATION_END_POINT = '/Customer/UpdateLocation';
export const GET_NEAR_BY_END_POINT = '/Customer/GetNearBy';
export const GET_PRIVATE_PORTFILIO_FRIENDS_ACCESSIBLE_POINT = '/Customer/GetPrivatePortfolioAccessibleFriends';
export const ACCESS_To_PRIVATE_PORTFILIO_POINT = '/Customer/AccessToPrivatePortfolio';
export const GET_PRIVATE_PORTFILIO_ENDPOINT = '/Customer/GetPrivatePortfolio';
export const DELETE_PRIVATE_PORTFILIO_ENDPOINT = '/Customer/DeletePrivatePortfolio';
export const HAVE_ACCESS_TO_PRIVATE_PORTFILIO_ENDPOINT = '/Customer/CheckPrivatePortfolioAccessAndGet';
export const DELETE_CHAT_MESSAGE_ENDPOINT = '/Chat/DeleteChat';
export const PLAN_ENDPOINT = '/Plan/GetPlans';
export const PROCESS_STRIPE_PAYMENT_ENDPOINT = '/ProcessPayment';
export const GET_PLANDETAIL_ENDPOINT = '/Customer/GetActivePlan';
export const VALIDATE_DEVICE_TOKEN_ENDPOINT = '/Customer/ValidateDeviceToken';
export const GET_EMAIL_UPDATES_STATUS_ENDPOINT = '/Customer/IsEmailsSubscribed';
export const STOP_NOTIFICATION_STATUS_ENDPOINT = '/Customer/UnsubscribeEmail';
export const START_NOTIFICATION__STATUS_ENDPOINT = '/Customer/SubscribeEmail';
export const GET_FRIEND_COUNT_ENDPOINT = '/Friend/GetFriendCount';
export const CHANGE_COMMENT_VALUE = '/api/v1/post/commentOnOff';
export const CHANGE_AUTO_REFRESH_VALUE = '/api/v1/user/autoRefresh';
export const CHANGE_WALLPAPER = '/api/v1/user/updateWallpaperData';
export const CHANGE_VIDEO = '/api/v1/user/updateUserVideo';
export const IS_PORTFOLIO_SUBSCRIBED_ENDPOINT = '/IsPortfolioSubscribed';
export const GET_PORFOLIO_RATE_ENDPOINT = '/Plan/GetPortfolioRate';
export const PROCESS_PORTFOIO_PAMENT_ENDPOINT = '/ProcessPortfolioPayment';
export const GET_BALANCE_ENDPOINT = '/GetBalance';
export const SUSPEND_ACCOUNT_ENDPOINT = '/Customer/SuspendAccount';
export const IS_SUSPEND_ACCOUNT_ENDPOINT = '/Customer/IsSuspended';
export const CREATE_PRIVATE_GROUP_ENDPOINT = '/Group/SubmitPrivateGroup';
export const PAY_FOR_JOIN_PRIVATE_GROUP_ENDPOINT = '/ProcessGroupPayment';
export const GET_PRIVATE_GROUP_RATE_ENDPOINT = '/Plan/GetPrivateGroupRate';
export const UPDATE_GROUP_ENDPOINT = '/Group/UpdateGroup';
export const VERIFY_EMAIL = '/Customer/VerifyEmail';
export const GET_USER_ONLINE_STATUS = '/Customer/GetUserOnlineStatus';
export const SET_USER_ONLINE_STATUS = '/Customer/SetUserOnlineStatus';
export const IS_CHAT_SUBSCRIBED = '/Customer/IsChatSubscribed';
export const PROCESS_CHAT_PAYMENT = '/Customer/ProcessChatPayment';
export const POST_FEEDBACK = '/Feedback/PostFeedback';
export const GENERATE_AGORA_TOKEN = '/Voice/GetDynamicKeyWithoutAppId';
export const UPDATE_TOP_FRIENDS = '/api/v1/user/addTopFourFriend';
export const UPDATE_TOP_IMAGES = '/api/v1/user/addTopFourImage';
export const UPDATE_GROUP_CHANNEL = '/api/postGroup/updateGroupChannel';
export const GET_GROUP_DETAILS = '/api/postGroup/getGroupDetails';
export const SCHEDULE_CALL = '/api/v1/call/schedule';
export const VALIDATE_SCHEDULE_CALL = '/api/v1/call/single';
export const UPDATE_SCHEDULE_CALL = '/api/v1/call/updateData';
export const UPDATE_DEVICE_TOKEN = '/Customer/UpdateDeviceToken';
export const SEND_INVITATION_MAIL = '/Customer/Sendinvitationmail';
export const UPDATE_COMMENT = '/api/v1/post/editPostComment';
export const UPDATE_POST = '/api/v1/post/editPost';
export const GET_POST_DETAIL = '/api/post/postDetail';
export const NOTIFY_POST_API = '/Notification/NotifyUser';
export const GROUP_STATUS_CHANGE = '/Group/PauseGroup';
export const UPDATE_USER_TYPE = '/Customer/updateUserType';
export const NOTIFY_USERS_FOR_LIVE_STREAMING = '/Notification/NotifyUserForLiveStreaming';
export const UPDATE_LIVE_STREAMING_COUNT = '/Post/UpdateBroadcastUsersCount';
export const UPDATE_BROADCAST_ID = '/Customer/updateBroadCastId';
export const UPLOAD_GROUP_PIC = '/Group/addProfileImageForGroup';
