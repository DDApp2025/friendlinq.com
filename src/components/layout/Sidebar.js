import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MdHouse,
  MdWallpaper,
  MdPersonAdd,
  MdNotificationsActive,
  MdChat,
  MdGroup,
  MdCall,
  MdStar,
  MdSettings,
  MdHeadsetMic,
  MdLogout,
  MdClose,
  MdEdit,
} from 'react-icons/md';

const menuItems = [
  { label: 'Home', path: '/home', icon: MdHouse },
  { label: 'Photos', path: '/photos', icon: MdWallpaper },
  { label: 'Add Friend', path: '/add-friend', icon: MdPersonAdd },
  { label: 'Notifications', path: '/notifications', icon: MdNotificationsActive },
  { label: 'Messages', path: '/messages', icon: MdChat },
  { label: 'Friends', path: '/friends', icon: MdGroup },
  { label: 'Call', path: '/call', icon: MdCall },
  { label: 'Favorites', path: '/favorites', icon: MdStar },
];

const bottomItems = [
  { label: 'Settings', path: '/settings', icon: MdSettings },
  { label: 'Support', path: '/support', icon: MdHeadsetMic },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer);
  const profile = auth.getProfileData || {};
  const imageURL = profile.imageURL || '';
  const firstName = profile.firstName || '';
  const lastName = profile.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const email = profile.email || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessUserToken');
    dispatch({ type: 'LOGIN_SUCCESS', email: '', login_access_token: '' });
    dispatch({ type: 'GET_PROFILE_SUCCESS', getProfile: {} });
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div style={styles.overlay} onClick={onClose} />
      )}

      {/* Drawer */}
      <aside
        style={{
          ...styles.drawer,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Profile header */}
        <div style={styles.profileSection}>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close menu">
            <MdClose size={24} color="#fff" />
          </button>
          <div style={styles.profileRow}>
            {imageURL ? (
              <img src={imageURL} alt="Profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>{initials || '?'}</div>
            )}
            <div style={styles.profileInfo}>
              <span style={styles.profileName}>{fullName}</span>
              {email && <span style={styles.profileEmail}>{email}</span>}
            </div>
          </div>
          <button
            style={styles.editBtn}
            onClick={() => handleNav('/profile')}
          >
            <MdEdit size={16} color="#fff" />
            <span style={{ color: '#fff', fontSize: 13 }}>Edit Profile</span>
          </button>
        </div>

        {/* Nav links */}
        <nav style={styles.navSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={styles.menuItem}
              >
                <Icon size={22} color="#333" />
                <span style={styles.menuLabel}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={styles.bottomSection}>
          <div style={styles.divider} />
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={styles.menuItem}
              >
                <Icon size={22} color="#333" />
                <span style={styles.menuLabel}>{item.label}</span>
              </button>
            );
          })}
          <button onClick={handleLogout} style={styles.menuItem}>
            <MdLogout size={22} color="#d32f2f" />
            <span style={{ ...styles.menuLabel, color: '#d32f2f' }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1100,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    maxWidth: '80vw',
    backgroundColor: '#fff',
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease',
    boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
    overflowY: 'auto',
  },
  profileSection: {
    backgroundColor: '#1a6b3a',
    padding: '16px 16px 20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginBottom: 12,
    display: 'flex',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  editBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 16,
    cursor: 'pointer',
    padding: '4px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  navSection: {
    flex: 1,
    padding: '8px 0',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'left',
  },
  menuLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: 500,
  },
  bottomSection: {
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    margin: '4px 16px 8px',
  },
};

export default Sidebar;
