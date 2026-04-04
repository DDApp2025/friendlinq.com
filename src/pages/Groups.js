import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  MdGroup,
  MdGroupAdd,
  MdArrowBack,
  MdExitToApp,
  MdPhoto,
  MdSend,
  MdMoreVert,
  MdClose,
  MdPublic,
  MdSearch,
} from 'react-icons/md';
import { nodeApi, dotnetApi } from '../api/axios';
import normalizeImg from '../utils/normalizeImg';
import * as config from '../api/config';

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const IMG_BASE = 'https://natural.friendlinq.com';

// Find first array with objects in a nested response (max 3 levels)
function findArray(obj, depth = 0) {
  if (depth > 3) return null;
  if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') return obj;
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const val of Object.values(obj)) {
      const found = findArray(val, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

// ── Views enum ───────────────────────────────────────────────
const VIEW = {
  LIST: 'list',
  CREATE: 'create',
  HOME: 'home',
  MEMBERS: 'members',
  BROWSE: 'browse',
};

export default function Groups() {
  const token = useSelector((s) => s.authReducer.login_access_token);
  const profile = useSelector((s) => s.authReducer.getProfileData) || {};

  const [view, setView] = useState(VIEW.LIST);
  const [loading, setLoading] = useState(false);

  // Group list
  const [groups, setGroups] = useState([]);

  // Create group
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Group home
  const [activeGroup, setActiveGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState('');

  // Members
  const [members, setMembers] = useState([]);

  // Browse / join
  const [browseGroups, setBrowseGroups] = useState([]);
  const [browseSearch, setBrowseSearch] = useState('');

  // Menu
  const [showMenu, setShowMenu] = useState(false);

  // ── Task 96: Get group list (.NET JSON) ──────────────────
  // RN uses post_services2 → BASE_URL_3 + GET_GROUP_LIST → JSON POST
  // dotnetApi base = https://unpokedfolks.com/api
  // GET_GROUP_LIST = "/Group/GetGroupsList"
  const loadGroups = useCallback(async () => {
    console.log('=== LOAD GROUPS START === token exists:', !!token);
    setLoading(true);
    try {
      console.log('=== CALLING dotnetApi.post ===', config.GET_GROUP_LIST);
      const res = await dotnetApi.post(config.GET_GROUP_LIST, {
        authorization: token,
      });
      console.log('=== RESPONSE STATUS ===', res.status);
      console.log('=== RESPONSE DATA TYPE ===', typeof res.data, Array.isArray(res.data));
      console.log('=== RESPONSE DATA KEYS ===', res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? Object.keys(res.data) : 'N/A');
      console.log('=== RESPONSE DATA (first 2000) ===', JSON.stringify(res.data).slice(0, 2000));
      const list = findArray(res.data) || [];
      console.log('=== PARSED LIST LENGTH ===', list.length);
      setGroups(list);
    } catch (e) {
      console.error('=== LOAD GROUPS ERROR ===', e.message);
      console.error('=== ERROR RESPONSE ===', e.response?.status, e.response?.data);
      console.error('=== FULL ERROR ===', e);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) loadGroups();
  }, [token, loadGroups]);

  // ── Task 97: Create group (.NET JSON) ────────────────────
  // RN uses post_services5 → BASE_URL_3 + CREATE_PRIVATE_GROUP_ENDPOINT → JSON POST
  // CREATE_PRIVATE_GROUP_ENDPOINT = "/Group/SubmitPrivateGroup"
  // ADD_ADMIN_TO_GROUP_END_POINT = "/Group/AddAdminToGroup"
  const handleCreateGroup = async () => {
    if (!newName.trim()) return alert('Enter a group name');
    setLoading(true);
    try {
      const res = await dotnetApi.post(config.CREATE_PRIVATE_GROUP_ENDPOINT, {
        authorization: token,
        name: newName.trim(),
        isPrivate: false,
        description: newDesc.trim(),
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      if (code === 200) {
        const groupId = res.data?.Data?.groupId;
        if (groupId) {
          await dotnetApi.post(config.ADD_ADMIN_TO_GROUP_END_POINT, {
            authorization: token,
            groupId,
          });
        }
        setNewName('');
        setNewDesc('');
        setView(VIEW.LIST);
        loadGroups();
      } else {
        alert(res.data?.message || res.data?.Message || 'Failed to create group');
      }
    } catch (e) {
      console.error('createGroup', e);
      alert('Error creating group');
    }
    setLoading(false);
  };

  // ── Task 98: Group home feed (Node FormData) ─────────────
  // RN uses post_services → BASE_URL + GET_GROUP_POST → FormData + token header
  // GET_GROUP_POST = "/api/postGroup/getGroupPost"
  const loadGroupPosts = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('groupId', groupId);
      fd.append('skip', '0');
      fd.append('limit', '25');
      const res = await nodeApi.post(config.GET_GROUP_POST, fd);
      if (res.data?.statusCode === 200) {
        setPosts(res.data.data?.myPost || res.data.data?.groupPosts || []);
      } else {
        setPosts([]);
      }
    } catch (e) {
      console.error('loadGroupPosts', e);
    }
    setLoading(false);
  }, []);

  const openGroupHome = (group) => {
    const g = {
      groupId: group._id,
      groupName: group.groupName,
      groupAdminId: group.groupAdminId?._id || group.groupAdminId,
      groupIcon: group.ExtraElements?.profileImage || null,
    };
    setActiveGroup(g);
    setView(VIEW.HOME);
    setPosts([]);
    loadGroupPosts(g.groupId);
  };

  // ── Task 99: Group members (Node FormData) ───────────────
  // GET_GROUP_MEMBERS = "/api/v1/postGroup/getMemberOfGroup"
  const loadMembers = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('groupId', groupId);
      fd.append('skip', '0');
      fd.append('limit', '100');
      const res = await nodeApi.post(config.GET_GROUP_MEMBERS, fd);
      if (res.data?.statusCode === 200) {
        setMembers(res.data.data?.groupMemberList || []);
      }
    } catch (e) {
      console.error('loadMembers', e);
    }
    setLoading(false);
  }, []);

  const openMembers = () => {
    if (!activeGroup) return;
    setView(VIEW.MEMBERS);
    setMembers([]);
    loadMembers(activeGroup.groupId);
  };

  // ── Task 100: Add member (Node FormData) ─────────────────
  // ADD_GROUP_MEMBERS = "/api/v1/postGroup/addMember"
  const handleAddMember = async (friendId) => { // eslint-disable-line no-unused-vars
    try {
      const fd = new FormData();
      fd.append('groupId', activeGroup.groupId);
      fd.append('friendId', friendId);
      const res = await nodeApi.post(config.ADD_GROUP_MEMBERS, fd);
      if (res.data?.statusCode === 200) {
        loadMembers(activeGroup.groupId);
      } else {
        alert(res.data?.message || 'Failed to add member');
      }
    } catch (e) {
      console.error('addMember', e);
    }
  };

  // ── Task 101: Leave group (Node FormData) ────────────────
  // LEFT_GROUP = "/api/postGroup/leftGroup"
  const handleLeaveGroup = async () => {
    if (!activeGroup) return;
    if (!window.confirm('Leave this group?')) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('groupId', activeGroup.groupId);
      const res = await nodeApi.post(config.LEFT_GROUP, fd);
      if (res.data?.statusCode === 200) {
        setView(VIEW.LIST);
        setActiveGroup(null);
        loadGroups();
      } else {
        alert(res.data?.message || 'Failed to leave group');
      }
    } catch (e) {
      console.error('leaveGroup', e);
    }
    setLoading(false);
  };

  // ── Task 102: Join public group (.NET Client JSON) ───────
  // SEND_REQUEST_GROUP_FOR_JOIN = "/Group/SubmitGroupRequest"
  // RN uses BASE_URL_2 (.NET Client) → dotnetApi needs /Client prefix
  const handleJoinGroup = async (groupId) => {
    setLoading(true);
    try {
      const res = await dotnetApi.post(config.SEND_REQUEST_GROUP_FOR_JOIN, {
        authorization: token,
        groupId,
      });
      const code = res.data?.StatusCode ?? res.data?.statusCode;
      if (code === 200) {
        alert('Join request sent!');
        loadBrowseGroups();
      } else {
        alert(res.data?.Message || res.data?.message || 'Failed to send join request');
      }
    } catch (e) {
      console.error('joinGroup', e);
    }
    setLoading(false);
  };

  // ── Task 103: Browse groups to join (.NET Client JSON) ───
  // GET_GROUP_FOR_JOIN = "/Group/GetGroups"
  // RN uses BASE_URL_2 (.NET Client) → dotnetApi needs /Client prefix
  const loadBrowseGroups = useCallback(async () => {
    setLoading(true);
    try {
      const url = config.GET_GROUP_FOR_JOIN;
      console.log('[Groups] GetGroups URL path:', url, '→ full:', dotnetApi.defaults.baseURL + url);
      const res = await dotnetApi.post(url, {
        authorization: token,
        search: browseSearch || '',
      });
      console.log('[Groups] GetGroups response:', res.data);
      const list = findArray(res.data) || [];
      setBrowseGroups(list);
    } catch (e) {
      console.error('browseGroups', e);
    }
    setLoading(false);
  }, [token, browseSearch]);

  const openBrowse = () => {
    setView(VIEW.BROWSE);
    setBrowseGroups([]);
    loadBrowseGroups();
  };

  // ── Task 104: Create group post (Node FormData) ──────────
  // CREATE_GROUP_POST = "/api/v1/postGroup/createGroupPost"
  const handleCreatePost = async () => {
    if (!postText.trim()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('postTitle', postText.trim());
      fd.append('groupId', activeGroup.groupId);
      fd.append('postContent', postText.trim());
      fd.append('isMediaFileUploaded', postImage ? 'true' : 'false');
      fd.append('isMediaTypeVideo', 'false');
      if (postImage) {
        fd.append('mediaFile', postImage);
      }
      const res = await nodeApi.post(config.CREATE_GROUP_POST, fd);
      if (res.data?.statusCode === 200) {
        setPostText('');
        setPostImage(null);
        setPostImagePreview('');
        loadGroupPosts(activeGroup.groupId);
      } else {
        alert(res.data?.message || 'Failed to create post');
      }
    } catch (e) {
      console.error('createPost', e);
    }
    setLoading(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostImage(file);
    setPostImagePreview(URL.createObjectURL(file));
  };

  // ── RENDER ─────────────────────────────────────────────────
  // Group list view
  if (view === VIEW.LIST) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <h2 style={s.title}>Groups</h2>
        </div>
        <div style={s.actionBar}>
          <button style={s.actionBtn} onClick={openBrowse}>
            <MdPublic size={20} /> Join Group
          </button>
          <button style={s.actionBtn} onClick={() => setView(VIEW.CREATE)}>
            <MdGroupAdd size={20} /> Create Group
          </button>
        </div>
        {loading && <div style={s.loader}>Loading...</div>}
        <div style={s.list}>
          {groups.length === 0 && !loading && (
            <div style={s.empty}>No groups yet. Create or join one!</div>
          )}
          {groups.map((g, i) => {
            const icon = g.ExtraElements?.profileImage;
            const isPaused = g.ExtraElements?.pause;
            return (
              <div
                key={g._id || i}
                style={{
                  ...s.groupRow,
                  opacity: isPaused ? 0.5 : 1,
                  cursor: isPaused ? 'default' : 'pointer',
                }}
                onClick={() => !isPaused && openGroupHome(g)}
              >
                {icon ? (
                  <img
                    src={IMG_BASE + '/' + icon}
                    alt=""
                    style={s.groupIcon}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={s.groupIconFallback}>
                    <MdGroup size={24} color="#999" />
                  </div>
                )}
                <div style={s.groupInfo}>
                  <div style={s.groupName}>{g.groupName}</div>
                  <div style={s.groupDate}>
                    {fmtDate(g.updatedAt)}
                  </div>
                  {g.description && (
                    <div style={s.groupDesc}>{g.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Create group view
  if (view === VIEW.CREATE) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => setView(VIEW.LIST)}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={s.title}>Create Group</h2>
        </div>
        <div style={s.form}>
          <input
            style={s.input}
            placeholder="Enter Group Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <textarea
            style={s.textarea}
            placeholder="Enter Group Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={4}
          />
          <button
            style={s.primaryBtn}
            onClick={handleCreateGroup}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  // Group home view
  if (view === VIEW.HOME && activeGroup) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => { setView(VIEW.LIST); setActiveGroup(null); setShowMenu(false); }}>
            <MdArrowBack size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            {activeGroup.groupIcon ? (
              <img src={IMG_BASE + '/' + activeGroup.groupIcon} alt={activeGroup.groupName || 'Group icon'} style={{ width: 36, height: 36, borderRadius: 18 }} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdGroup size={20} color="#999" />
              </div>
            )}
            <h2 style={{ ...s.title, margin: 0, fontSize: 18 }}>{activeGroup.groupName}</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <button style={s.backBtn} onClick={() => setShowMenu(!showMenu)}>
              <MdMoreVert size={24} />
            </button>
            {showMenu && (
              <div style={s.menu}>
                <button style={s.menuItem} onClick={() => { setShowMenu(false); openMembers(); }}>
                  <MdGroup size={18} /> Members
                </button>
                {activeGroup.groupAdminId !== profile._id && (
                  <button style={{ ...s.menuItem, color: '#d32f2f' }} onClick={() => { setShowMenu(false); handleLeaveGroup(); }}>
                    <MdExitToApp size={18} /> Leave Group
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create post area */}
        <div style={s.postArea}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <textarea
              style={{ ...s.input, flex: 1, minHeight: 40, resize: 'vertical' }}
              placeholder="What's on your mind..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>
          {postImagePreview && (
            <div style={{ position: 'relative', marginTop: 8 }}>
              <img src={postImagePreview} alt="Post image preview" style={{ maxHeight: 120, borderRadius: 8 }} />
              <button
                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 2 }}
                onClick={() => { setPostImage(null); setPostImagePreview(''); }}
              >
                <MdClose size={18} color="#fff" />
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#555' }}>
              <MdPhoto size={20} /> Photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
            </label>
            <button style={s.menuItem} onClick={openMembers}>
              <MdGroup size={18} color="#1a6b3a" /> Members
            </button>
            <div style={{ flex: 1 }} />
            <button
              style={{ ...s.primaryBtn, padding: '6px 16px', opacity: postText.trim() ? 1 : 0.5 }}
              onClick={handleCreatePost}
              disabled={loading || !postText.trim()}
            >
              <MdSend size={16} /> Post
            </button>
          </div>
        </div>

        {loading && <div style={s.loader}>Loading...</div>}

        {/* Posts feed */}
        <div style={s.list}>
          {posts.length === 0 && !loading && (
            <div style={s.empty}>No posts yet. Be the first to post!</div>
          )}
          {posts.map((p, i) => {
            const author = p.postAuthor || {};
            const authorImg = author.imageURL?.thumbnail
              ? normalizeImg(author.imageURL.thumbnail)
              : '';
            const postImg = p.imageURL?.original
              ? normalizeImg(p.imageURL.original)
              : '';
            return (
              <div key={p._id || i} style={s.postCard}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  {authorImg ? (
                    <img src={authorImg} alt={author.fullName || 'Post author'} style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: '#999' }}>
                      {(author.fullName || '?')[0]}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a6b3a' }}>{author.fullName || 'User'}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{fmtDate(p.updatedAt || p.createdAt)}</div>
                  </div>
                </div>
                {p.postContent && <div style={{ fontSize: 14, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{p.postContent}</div>}
                {postImg && (
                  <img src={postImg} alt="Group post image" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Members view
  if (view === VIEW.MEMBERS) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => { setView(VIEW.HOME); }}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={s.title}>Members</h2>
        </div>
        {loading && <div style={s.loader}>Loading...</div>}
        <div style={s.list}>
          {members.length === 0 && !loading && (
            <div style={s.empty}>No members found</div>
          )}
          {members.map((m, i) => {
            const member = m.groupMemberId || {};
            const img = member.imageURL?.thumbnail
              ? normalizeImg(member.imageURL.thumbnail)
              : '';
            return (
              <div key={member._id || i} style={s.groupRow}>
                {img ? (
                  <img src={img} alt={member.fullName || 'Group member'} style={s.groupIcon} />
                ) : (
                  <div style={s.groupIconFallback}>
                    {(member.fullName || '?')[0]}
                  </div>
                )}
                <div style={s.groupInfo}>
                  <div style={s.groupName}>{member.fullName || 'User'}</div>
                  <div style={s.groupDate}>{member.email || ''}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Browse / Join groups view
  if (view === VIEW.BROWSE) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => setView(VIEW.LIST)}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={s.title}>Join a Group</h2>
        </div>
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
          <input
            style={{ ...s.input, flex: 1 }}
            placeholder="Search groups..."
            value={browseSearch}
            onChange={(e) => setBrowseSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadBrowseGroups()}
          />
          <button style={s.primaryBtn} onClick={loadBrowseGroups}>
            <MdSearch size={18} />
          </button>
        </div>
        {loading && <div style={s.loader}>Loading...</div>}
        <div style={s.list}>
          {browseGroups.length === 0 && !loading && (
            <div style={s.empty}>No groups found</div>
          )}
          {browseGroups.map((g, i) => (
            <div key={g.GroupId || g._id || i} style={s.groupRow}>
              <div style={s.groupIconFallback}>
                <MdGroup size={24} color="#999" />
              </div>
              <div style={{ ...s.groupInfo, flex: 1 }}>
                <div style={s.groupName}>{g.GroupName || g.groupName}</div>
                {(g.Description || g.description) && (
                  <div style={s.groupDesc}>{g.Description || g.description}</div>
                )}
              </div>
              <button
                style={{ ...s.primaryBtn, padding: '6px 12px', fontSize: 13 }}
                onClick={() => handleJoinGroup(g.GroupId || g._id)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ── Styles ───────────────────────────────────────────────────
const s = {
  page: {
    maxWidth: 600,
    margin: '0 auto',
    paddingBottom: 70,
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a6b3a',
    margin: 0,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    color: '#1a6b3a',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    backgroundColor: '#f0f7f2',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 13,
    color: '#1a6b3a',
    fontWeight: 500,
  },
  list: {
    padding: '0 0px',
  },
  groupRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    objectFit: 'cover',
    backgroundColor: '#eee',
  },
  groupIconFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  groupInfo: {
    flex: 1,
    minWidth: 0,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a6b3a',
  },
  groupDate: {
    fontSize: 12,
    color: '#888',
  },
  groupDesc: {
    fontSize: 12,
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  loader: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#aaa',
    fontSize: 14,
  },
  form: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #ddd',
    fontSize: 14,
    outline: 'none',
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #ddd',
    fontSize: 14,
    outline: 'none',
    backgroundColor: '#f9f9f9',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  primaryBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  postArea: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  postCard: {
    padding: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  menu: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    zIndex: 20,
    minWidth: 160,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'left',
    color: '#333',
  },
};
