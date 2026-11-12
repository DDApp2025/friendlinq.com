// Music posts, same as the app (Robert, November 12, 2026, 9:08 AM: "2 yes"). A music post is a post whose
// file is a sound file (mp3, m4a, aac, wav or ogg). It shows its cover picture (or a green Friendlinq
// music card) with a sound player under it. It never starts by itself, and starting one stops any other.
import React, { useRef } from 'react';
import normalizeImg from '../../utils/normalizeImg';

const AUDIO_RE = /\.(mp3|m4a|aac|wav|ogg|oga|opus)(\?.*)?$/i;

export const isAudioUrl = (u) => typeof u === 'string' && AUDIO_RE.test(u.trim());
export const isAudioFile = (f) =>
  !!f && ((f.type || '').startsWith('audio') || AUDIO_RE.test(f.name || ''));

// The cover picture. A shared post keeps the cover in videoThumbnailUrl.thumbnail, because sharing
// copies the sound file address into videoThumbnailUrl.original.
export const audioCoverOf = (post) => {
  const v = post && post.videoThumbnailUrl;
  const options = [v && v.original, v && v.thumbnail, post && post.imageURL && post.imageURL.original];
  for (const c of options) {
    if (c && typeof c === 'string' && !isAudioUrl(c)) return c;
  }
  return null;
};

// The picture to send when a post is shared (keeps a music post's cover).
export const shareThumbOf = (post) => {
  if (post && isAudioUrl(post.videoURL)) return audioCoverOf(post);
  return (post && post.videoThumbnailUrl && post.videoThumbnailUrl.original) || null;
};

export default function MusicPost({ post }) {
  const ref = useRef(null);
  const cover = audioCoverOf(post);
  const src = normalizeImg(post.videoURL);
  const onPlay = () => {
    document.querySelectorAll('audio[data-fl-music]').forEach((a) => {
      if (a !== ref.current && !a.paused) a.pause();
    });
  };
  return (
    <div style={styles.wrap}>
      {cover ? (
        <img src={normalizeImg(cover)} alt="Music cover" style={styles.cover} />
      ) : (
        <div style={styles.card}>
          <div style={{ fontSize: 64, lineHeight: 1 }} aria-hidden="true">♫</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>Friendlinq Music</div>
        </div>
      )}
      <audio
        ref={ref}
        data-fl-music="1"
        src={src}
        controls
        preload="none"
        controlsList="nodownload"
        onPlay={onPlay}
        style={styles.audio}
      />
    </div>
  );
}

const styles = {
  wrap: { width: '100%', background: '#000', marginTop: 6 },
  cover: { width: '100%', maxHeight: 520, objectFit: 'cover', display: 'block' },
  card: {
    width: '100%',
    aspectRatio: '1 / 1',
    maxHeight: 420,
    background: '#2e7d32',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audio: { width: '100%', display: 'block', background: '#111' },
};
