import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdVideocam, MdMenu } from 'react-icons/md';
import {
  MdHouse,
  MdWallpaper,
  MdPersonAdd,
  MdNotificationsActive,
  MdChat,
  MdGroup,
  MdCall,
  MdStar,
  MdPerson,
  MdMailOutline,
  MdHeadsetMic,
  MdSettings,
  MdLogout,
} from 'react-icons/md';

const navLinks = [
  { label: 'Home', path: '/home', icon: MdHouse },
  { label: 'Photos', path: '/photos', icon: MdWallpaper },
  { label: 'Add Friend', path: '/add-friend', icon: MdPersonAdd },
  { label: 'Notifications', path: '/notifications', icon: MdNotificationsActive, badgeKey: 'notificationCount' },
  { label: 'Messages', path: '/messages', icon: MdChat, badgeKey: 'chatnotificationCount' },
  { label: 'Friends', path: '/friends', icon: MdGroup },
  { label: 'Groups', path: '/groups', icon: MdGroup },
  { label: 'Call', path: '/call', icon: MdCall },
  { label: 'Favorites', path: '/favorites', icon: MdStar },
];

const dropdownItems = [
  { label: 'Profile', path: '/profile', icon: MdPerson },
  { label: 'Send Invitation', path: '/invite', icon: MdMailOutline },
  { label: 'Support', path: '/support', icon: MdHeadsetMic },
  { label: 'Settings', path: '/settings', icon: MdSettings },
];

const TopNav = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer);
  const profile = auth.getProfileData || {};
  const imageURL = profile.imageURL || '';
  const displayName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '';
  const initials = displayName
    ? displayName.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase()
    : '';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem('accessUserToken');
    dispatch({ type: 'LOGIN_SUCCESS', email: '', login_access_token: '' });
    dispatch({ type: 'GET_PROFILE_SUCCESS', getProfile: {} });
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      {/* Left: hamburger (mobile) + logo */}
      <div style={styles.left}>
        <button
          onClick={onMenuToggle}
          style={styles.hamburger}
          aria-label="Toggle menu"
          className="topnav-hamburger"
        >
          <MdMenu size={28} color="#fff" />
        </button>
        <div style={styles.logoWrap} onClick={() => navigate('/home')}>
          <img src="/logo-icon.png" alt="FriendLinq" style={styles.logoImg} />
          <span style={styles.logoText}>FriendLinq</span>
        </div>
      </div>

      {/* Center: desktop nav links */}
      <nav style={styles.center} className="topnav-links">
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          const badgeCount = link.badgeKey ? auth[link.badgeKey] : null;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                ...styles.navLink,
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                borderBottom: active ? '2px solid #fff' : '2px solid transparent',
              }}
            >
              <span style={styles.linkIconWrap}>
                {link.label}
                {badgeCount ? (
                  <span style={styles.navBadge}>
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right: video + profile with dropdown */}
      <div style={styles.right}>
        <button style={styles.iconBtn} aria-label="Video call">
          <MdVideocam size={24} color="#fff" />
        </button>

        <button
          style={styles.iconBtn}
          aria-label="Notifications"
          onClick={() => navigate('/notifications')}
        >
          <div style={styles.bellWrap}>
            <MdNotificationsActive size={24} color="#fff" />
            {auth.notificationCount ? (
              <span style={styles.bellBadge}>
                {auth.notificationCount > 99 ? '99+' : auth.notificationCount}
              </span>
            ) : null}
          </div>
        </button>

        <div ref={dropdownRef} style={styles.profileWrap}>
          <div
            style={styles.avatarWrap}
            onClick={() => setDropdownOpen((o) => !o)}
          >
            {imageURL ? (
              <img
                src={imageURL}
                alt="Profile"
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarFallback}>
                {initials || '?'}
              </div>
            )}
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div style={styles.dropdown}>
              {/* Profile summary at top */}
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownAvatarWrap}>
                  {imageURL ? (
                    <img src={imageURL} alt="Profile" style={styles.dropdownAvatar} />
                  ) : (
                    <div style={styles.dropdownAvatarFallback}>
                      {initials || '?'}
                    </div>
                  )}
                </div>
                <div style={styles.dropdownInfo}>
                  <span style={styles.dropdownName}>
                    {displayName || 'User'}
                  </span>
                  {profile.email && (
                    <span style={styles.dropdownEmail}>{profile.email}</span>
                  )}
                </div>
              </div>

              <div style={styles.dropdownDivider} />

              {/* Menu items */}
              {dropdownItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(item.path);
                    }}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0faf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={18} color="#1a6b3a" />
                    <span style={styles.dropdownLabel}>{item.label}</span>
                  </button>
                );
              })}

              <div style={styles.dropdownDivider} />

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={styles.dropdownItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MdLogout size={18} color="#d32f2f" />
                <span style={{ ...styles.dropdownLabel, color: '#d32f2f' }}>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#1a6b3a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    zIndex: 1001,
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
  },
  logoImg: {
    height: 32,
    width: 'auto',
    objectFit: 'contain',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  navLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '16px 10px',
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
  },
  linkIconWrap: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  navBadge: {
    backgroundColor: 'red',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    marginLeft: 2,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  bellWrap: {
    position: 'relative',
    display: 'inline-flex',
  },
  bellBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    lineHeight: 1,
  },
  profileWrap: {
    position: 'relative',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.5)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    display: 'block',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Dropdown styles
  dropdown: {
    position: 'absolute',
    top: 44,
    right: 0,
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    zIndex: 2000,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
  },
  dropdownAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #1a6b3a',
    flexShrink: 0,
  },
  dropdownAvatar: {
    width: 40,
    height: 40,
    display: 'block',
    objectFit: 'cover',
  },
  dropdownAvatarFallback: {
    width: 40,
    height: 40,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden',
  },
  dropdownName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownEmail: {
    fontSize: 12,
    color: '#888',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    margin: '0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s',
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: 500,
  },
};

export default TopNav;
