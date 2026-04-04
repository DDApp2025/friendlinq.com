import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdHouse,
  MdWallpaper,
  MdPersonAdd,
  MdNotificationsActive,
  MdChat,
  MdGroup,
  MdCall,
  MdStar,
} from 'react-icons/md';

const tabs = [
  { key: 'home', icon: MdHouse, label: 'Home', path: '/home' },
  { key: 'photos', icon: MdWallpaper, label: 'Photos', path: '/photos' },
  { key: 'addfriend', icon: MdPersonAdd, label: 'Add Friend', path: '/add-friend' },
  { key: 'notifications', icon: MdNotificationsActive, label: 'Notifications', path: '/notifications', badgeKey: 'notificationCount' },
  { key: 'messages', icon: MdChat, label: 'Messages', path: '/messages', badgeKey: 'chatnotificationCount' },
  { key: 'groups', icon: MdGroup, label: 'Groups', path: '/groups' },
  { key: 'call', icon: MdCall, label: 'Call', path: '/call' },
  { key: 'favorites', icon: MdStar, label: 'Favorites', path: '/favorites' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.authReducer);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.container} aria-label="Bottom navigation">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        const Icon = tab.icon;
        const badgeCount = tab.badgeKey ? auth[tab.badgeKey] : null;

        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            style={styles.tab}
            aria-label={tab.label}
            title={tab.label}
          >
            <div style={styles.iconWrap}>
              <Icon
                size={26}
                color={active ? '#ffffff' : 'rgba(255,255,255,0.45)'}
              />
              {badgeCount ? (
                <span style={styles.badge}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#1a6b3a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1000,
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
  },
  iconWrap: {
    position: 'relative',
    display: 'inline-flex',
  },
  badge: {
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
};

export default BottomNav;
