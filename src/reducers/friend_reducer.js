import * as T from '../actions/actions_types';

const initialState = {
  friendsList: [],
  friendsTotal: 0,
  incomingRequests: [],
  sentRequests: [],
  searchResults: [],
  loading: false,
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    // ── Friends list ───────────────────────────────────────
    case T.GET_FRIEND_LIST_ATTEMPT:
      return { ...state, loading: true };
    case T.GET_FRIEND_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        friendsList: action.payload.list,
        friendsTotal: action.payload.total,
      };
    case T.GET_FRIEND_LIST_FAIL:
      return { ...state, loading: false };

    // ── Incoming requests ──────────────────────────────────
    case T.GET_FRIEND_COMING_REQUESTS_LIST_ATTEMPT:
      return { ...state, loading: true };
    case T.GET_FRIEND_COMING_REQUESTS_LIST_SUCCESS:
      return { ...state, loading: false, incomingRequests: action.payload.list };
    case T.GET_FRIEND_COMING_REQUESTS_LIST_FAIL:
      return { ...state, loading: false };

    // ── Sent requests ──────────────────────────────────────
    case T.GET_FRIEND_OUTGOING_REQUESTS_LIST_ATTEMPT:
      return { ...state, loading: true };
    case T.GET_FRIEND_OUTGOING_REQUESTS_LIST_SUCCESS:
      return { ...state, loading: false, sentRequests: action.payload.list };
    case T.GET_FRIEND_OUTGOING_REQUESTS_LIST_FAIL:
      return { ...state, loading: false };

    // ── Accept → remove from incoming ──────────────────────
    case T.ACCEPT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        incomingRequests: state.incomingRequests.filter(
          (r) => r._id !== action.friendId && r.friendId !== action.friendId
        ),
      };

    // ── Reject → remove from incoming ──────────────────────
    case T.REJECT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        incomingRequests: state.incomingRequests.filter(
          (r) => r._id !== action.friendId && r.friendId !== action.friendId
        ),
      };

    // ── Unfriend → remove from friends list ────────────────
    case T.UNFRIEND_SUCCESS:
      return {
        ...state,
        friendsList: state.friendsList.filter(
          (f) => f._id !== action.friendId && f.friendId !== action.friendId
        ),
        friendsTotal: Math.max(0, state.friendsTotal - 1),
      };

    // ── Search results ─────────────────────────────────────
    case T.SEARCH_USER_SUCCESS:
      return { ...state, searchResults: action.payload };
    case T.SET_SEARCH_USER_EMPTY:
      return { ...state, searchResults: [] };

    default:
      return state;
  }
};

export default friendReducer;
