// Robert's addition (Nov 6, 2026): a member's posts listed on their profile page, the same as the app
// (My Profile shows your own posts; another member's profile shows theirs).
import React, { useEffect, useState } from 'react';
import { nodeApi } from '../../api/axios';
import PostCard from './PostCard';

export default function ProfilePosts({ userId, own }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append('skip', 0);
        fd.append('limit', 100);
        if (!own) fd.append('userToId', userId);
        const res = await nodeApi.post(own ? '/api/post/getMyPost' : '/api/post/getAnotherUsersPost', fd);
        const list = res.data?.data?.myPost || [];
        if (alive) setPosts(list.filter((p) => !p.groupId));
      } catch (e) {
        if (alive) setPosts([]);
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [userId, own]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>{own ? 'My Posts' : 'Posts'}</h3>
      {loading && <div style={{ color: '#888', fontSize: 14, padding: 12 }}>Loading posts...</div>}
      {!loading && posts.length === 0 && <div style={{ color: '#888', fontSize: 14, padding: 12 }}>No posts yet.</div>}
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          onUpdate={(u) => setPosts((list) => list.map((x) => (x._id === u._id ? u : x)))}
          onDelete={(id) => setPosts((list) => list.filter((x) => x._id !== id))}
        />
      ))}
    </div>
  );
}
