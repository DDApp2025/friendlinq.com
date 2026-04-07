export const firstName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return 'User';
  const trimmed = fullName.trim();
  if (!trimmed) return 'User';
  return trimmed.split(' ')[0];
};
