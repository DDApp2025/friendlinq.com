import { nodeApi, dotnetApi } from '../api/axios';
import {
  CREATE_MY_POST,
  GET_COMMENT,
  COMMENT_POST,
  DELETE_COMMENT,
  NOTIFY_POST_API,
  GET_FRIENDS_LIST,
} from '../api/config';

// ── Create post (FormData) ────────────────────────────────
export const createPost = async ({ postTitle, postContent, postType, mediaFile, isdating }) => {
  try {
    const fd = new FormData();
    fd.append('postTitle', postTitle || '');
    fd.append('postContent', postContent || '');
    fd.append('postType', postType); // "Public" or "Friend_Only"
    fd.append('isdating', isdating || '0');

    if (mediaFile) {
      fd.append('isMediaFileUploaded', 'true');
      const isVideo = mediaFile.type?.startsWith('video');
      fd.append('isMediaTypeVideo', isVideo ? 'true' : 'false');
      fd.append('mediaFile', mediaFile);
    } else {
      fd.append('isMediaFileUploaded', 'false');
      fd.append('isMediaTypeVideo', 'false');
    }

    const res = await nodeApi.post(CREATE_MY_POST, fd);
    return res.data;
  } catch (err) {
    console.error('createPost error:', err);
    return { statusCode: 500, message: err?.response?.data?.message || 'Network error' };
  }
};

// ── Get comments for a post ───────────────────────────────
export const getComments = async (postId) => {
  try {
    const fd = new FormData();
    fd.append('postId', postId);
    const res = await nodeApi.post(GET_COMMENT, fd);
    return res.data;
  } catch (err) {
    console.error('getComments error:', err);
    return { statusCode: 500 };
  }
};

// ── Add comment ───────────────────────────────────────────
export const addComment = async (postId, comment) => {
  try {
    const fd = new FormData();
    fd.append('postId', postId);
    fd.append('comment', comment);
    const res = await nodeApi.post(COMMENT_POST, fd);
    return res.data;
  } catch (err) {
    console.error('addComment error:', err);
    return { statusCode: 500 };
  }
};

// ── Delete comment ────────────────────────────────────────
export const deleteComment = async (commentId, postId) => {
  try {
    const fd = new FormData();
    fd.append('commentId', commentId);
    fd.append('postId', postId);
    const res = await nodeApi.post(DELETE_COMMENT, fd);
    return res.data;
  } catch (err) {
    console.error('deleteComment error:', err);
    return { statusCode: 500 };
  }
};

// ── Notify all friends about new post (.NET) ──────────────
// Replicates the notifyApi pattern from the RN app
export const notifyFriends = async (token, postId, authorName) => {
  try {
    // 1. Get friends list
    const fd = new FormData();
    fd.append('status', 'Accepted');
    fd.append('skip', 0);
    fd.append('limit', 1000);
    const friendsRes = await nodeApi.post(GET_FRIENDS_LIST, fd);

    if (friendsRes.data?.statusCode !== 200) return;

    const friends = friendsRes.data.data?.friendList || friendsRes.data.data?.myFriendList || [];

    // 2. Notify each friend via .NET endpoint
    for (const friend of friends) {
      const friendId = friend?._id || friend?.friendId;
      if (!friendId) continue;
      try {
        await dotnetApi.post(NOTIFY_POST_API, {
          authorization: token,
          PostId: postId,
          PostAuthorName: authorName,
          FriendId: friendId,
        });
      } catch {
        // best-effort — don't fail the whole flow
      }
    }
  } catch (err) {
    console.error('notifyFriends error:', err);
  }
};
