export default function normalizeImg(url) {
  if (!url) return '';
  let raw = url;
  if (typeof url === 'object') {
    raw = url.thumbnail || url.original || '';
  }
  if (!raw) return '';
  // Fix wrong domain stored in database
  raw = raw.replace('natural.selectnaturally.com', 'natural.friendlinq.com');
  raw = raw.replace('https://unpokedfolks.com/uploads', 'https://natural.friendlinq.com/uploads');
  if (raw.startsWith('http')) return raw;
  return 'https://natural.friendlinq.com/' + raw;
}
