import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nodeApi, dotnetApi } from '../api/axios';
import { LogoutAttempt, updateUserType, setUserType } from '../actions/auth_actions';

const CHANGE_AUTO_REFRESH_VALUE = '/api/v1/user/autoRefresh';
const CHANGE_WALLPAPER = '/api/v1/user/updateWallpaperData';
const GET_EMAIL_UPDATES_STATUS_ENDPOINT = '/Customer/IsEmailsSubscribed';
const STOP_NOTIFICATION_STATUS_ENDPOINT = '/Customer/UnsubscribeEmail';
const START_NOTIFICATION__STATUS_ENDPOINT = '/Customer/SubscribeEmail';
const SUSPEND_ACCOUNT_ENDPOINT = '/Customer/SuspendAccount';
const SET_USER_ONLINE_STATUS = '/Customer/SetUserOnlineStatus';

const WALLPAPERS = [
  { id: 'default', label: 'Default', color: '#ffffff' },
  { id: 'light-green', label: 'Light Green', color: '#e8f5e9' },
  { id: 'light-blue', label: 'Light Blue', color: '#e3f2fd' },
  { id: 'light-pink', label: 'Light Pink', color: '#fce4ec' },
  { id: 'light-yellow', label: 'Light Yellow', color: '#fffde7' },
  { id: 'light-purple', label: 'Light Purple', color: '#f3e5f5' },
];

function Settings() {
  const [loading, setLoading] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState('default');
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showDatingSplash, setShowDatingSplash] = useState(false);
  const [splashStep, setSplashStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((s) => s);
  const token = store.authReducer.login_access_token;
  const email = store.authReducer.email;
  const userType = store.authReducer.userType;
  const profile = store.authReducer.getProfileData || {};

  useEffect(() => {
    getEmailUpdateStatus();
    // Load auto-refresh from profile if available
    if (profile.autoRefresh !== undefined) {
      setAutoRefresh(!!profile.autoRefresh);
    }
    if (profile.wallpaper) {
      setSelectedWallpaper(profile.wallpaper);
    }
  }, []);

  const getEmailUpdateStatus = async () => {
    try {
      const res = await dotnetApi.post(GET_EMAIL_UPDATES_STATUS_ENDPOINT, {
        email: email,
      });
      if (res.data?.StatusCode === 200) {
        setEmailSubscribed(res.data.SubscribeEmail);
      }
    } catch (err) {
      console.error('getEmailUpdateStatus error:', err);
    }
  };

  const toggleEmailSubscription = async () => {
    setLoading(true);
    try {
      const endpoint = emailSubscribed
        ? STOP_NOTIFICATION_STATUS_ENDPOINT
        : START_NOTIFICATION__STATUS_ENDPOINT;
      const res = await dotnetApi.post(endpoint, {
        authorization: token,
      });
      if (res.data?.StatusCode === 200) {
        setEmailSubscribed(!emailSubscribed);
      }
    } catch (err) {
      console.error('toggleEmailSubscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('autoRefresh', autoRefresh ? 'false' : 'true');
      const res = await nodeApi.post(CHANGE_AUTO_REFRESH_VALUE, formData);
      if (res.data?.statusCode === 200) {
        setAutoRefresh(!autoRefresh);
      }
    } catch (err) {
      console.error('toggleAutoRefresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWallpaper = async (wallpaperId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('wallpaper', wallpaperId);
      const res = await nodeApi.post(CHANGE_WALLPAPER, formData);
      if (res.data?.statusCode === 200) {
        setSelectedWallpaper(wallpaperId);
      }
    } catch (err) {
      console.error('updateWallpaper error:', err);
    } finally {
      setLoading(false);
    }
  };

  const suspendAccount = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.post(SUSPEND_ACCOUNT_ENDPOINT, {
        authorization: token,
      });
      if (res.data?.StatusCode === 200 && res.data?.Message === 'Success') {
        await dispatch(LogoutAttempt());
        localStorage.removeItem('accessUserToken');
        navigate('/login');
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      console.error('suspendAccount error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
      setShowSuspendConfirm(false);
    }
  };

  const toggleUserType = async () => {
    const newType = userType === 'dating' ? 'normal' : 'dating';

    // Show dating splash on first switch to dating
    if (newType === 'dating' && !localStorage.getItem('datingSplashSeen')) {
      setShowDatingSplash(true);
      setSplashStep(1);
      return;
    }

    await switchUserType(newType);
  };

  const switchUserType = async (newType) => {
    setLoading(true);
    try {
      const res = await dispatch(updateUserType(token, profile._id, newType));
      if (res.StatusCode === 200) {
        localStorage.setItem('usertype', newType);
        dispatch(setUserType(newType));
      } else {
        alert('Failed to switch mode');
      }
    } catch (err) {
      console.error('switchUserType error:', err);
      alert('Failed to switch mode');
    } finally {
      setLoading(false);
    }
  };

  const handleDatingSplashContinue = async () => {
    if (splashStep === 1) {
      setSplashStep(2);
    } else {
      setShowDatingSplash(false);
      localStorage.setItem('datingSplashSeen', 'true');
      await switchUserType('dating');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.post(SET_USER_ONLINE_STATUS, {
        authorization: token,
        IsOnline: 0,
      });
      if (res.data?.StatusCode === 200) {
        await dispatch(LogoutAttempt());
        localStorage.removeItem('accessUserToken');
        navigate('/login');
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      console.error('handleLogout error:', err);
      // Still logout on error
      await dispatch(LogoutAttempt());
      localStorage.removeItem('accessUserToken');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          &#8592;
        </button>
        <h2 style={styles.title}>Settings</h2>
      </div>

      {loading && <div style={styles.loadingBar}>Processing...</div>}

      {/* Email Subscription Toggle */}
      <div style={styles.section}>
        <div style={styles.row} onClick={toggleEmailSubscription}>
          <span style={styles.icon}>🔔</span>
          <span style={styles.label}>Get Updates in Email</span>
          <div
            style={{
              ...styles.toggle,
              backgroundColor: emailSubscribed ? '#1a6b3a' : '#ccc',
            }}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: emailSubscribed ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Auto-Refresh Toggle */}
      <div style={styles.section}>
        <div style={styles.row} onClick={toggleAutoRefresh}>
          <span style={styles.icon}>🔄</span>
          <span style={styles.label}>Auto-Refresh Feed</span>
          <div
            style={{
              ...styles.toggle,
              backgroundColor: autoRefresh ? '#1a6b3a' : '#ccc',
            }}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: autoRefresh ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Dating Mode Toggle */}
      <div style={styles.section}>
        <div style={styles.row} onClick={toggleUserType}>
          <span style={styles.icon}>&#x2764;</span>
          <span style={styles.label}>
            {userType === 'dating' ? 'Switch to Normal Mode' : 'Switch to Dating Mode'}
          </span>
          <div
            style={{
              ...styles.toggle,
              backgroundColor: userType === 'dating' ? '#e84393' : '#ccc',
            }}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: userType === 'dating' ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
        {userType === 'dating' && (
          <p style={{ margin: '4px 10px 0', fontSize: 13, color: '#e84393' }}>
            Dating mode active — your feed and posts will be dating-only
          </p>
        )}
      </div>

      {/* Wallpaper Selection */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Chat Wallpaper</h3>
        <div style={styles.wallpaperGrid}>
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => updateWallpaper(wp.id)}
              style={{
                ...styles.wallpaperItem,
                backgroundColor: wp.color,
                border:
                  selectedWallpaper === wp.id
                    ? '3px solid #1a6b3a'
                    : '2px solid #ddd',
              }}
            >
              <span style={styles.wallpaperLabel}>{wp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation items */}
      <div style={styles.section}>
        <button style={styles.menuRow} onClick={() => navigate('/change-password')}>
          <span style={styles.icon}>🔒</span>
          <span style={styles.label}>Change Password</span>
        </button>
      </div>

      <div style={styles.section}>
        <button style={styles.menuRow} onClick={() => navigate('/subscription')}>
          <span style={styles.icon}>📋</span>
          <span style={styles.label}>Plans</span>
        </button>
      </div>

      <div style={styles.section}>
        <button style={styles.menuRow} onClick={() => navigate('/choose-tutorial')}>
          <span style={styles.icon}>📖</span>
          <span style={styles.label}>Tutorials</span>
        </button>
      </div>

      {/* Delete / Suspend Account */}
      <div style={styles.section}>
        <button
          style={styles.menuRow}
          onClick={() => setShowSuspendConfirm(true)}
        >
          <span style={styles.icon}>⚠️</span>
          <span style={{ ...styles.label, color: '#d32f2f' }}>Delete Account</span>
        </button>
      </div>

      {/* Logout */}
      <div style={styles.section}>
        <button style={styles.menuRow} onClick={handleLogout}>
          <span style={styles.icon}>🚪</span>
          <span style={{ ...styles.label, color: '#d32f2f' }}>Logout</span>
        </button>
      </div>

      {/* Dating Splash Modal */}
      {showDatingSplash && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: 440, textAlign: 'center' }}>
            <p style={{ color: '#e84393', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
              {splashStep === 1
                ? 'Diverse faces, unique stories, waiting to unfold.\nFind your perfect match today!'
                : "Life's a beach, but it's better shared.\nFind your perfect wave."}
            </p>
            <div style={{ height: 200, backgroundColor: '#fce4ec', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 48 }}>{splashStep === 1 ? '\u2764\uFE0F' : '\u{1F3D6}\uFE0F'}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowDatingSplash(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.dangerBtn, background: '#e84393' }}
                onClick={handleDatingSplashContinue}
              >
                {splashStep === 1 ? 'Continue' : 'Start Dating Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend confirmation modal */}
      {showSuspendConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 16px', color: '#333' }}>
              Are you sure you want to delete your account?
            </h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              This action will suspend your account. You will be logged out.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowSuspendConfirm(false)}
              >
                Cancel
              </button>
              <button style={styles.dangerBtn} onClick={suspendAccount}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 16,
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#1a6b3a',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 0,
  },
  loadingBar: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    marginBottom: 16,
    color: '#1a6b3a',
    fontSize: 14,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 10px',
    cursor: 'pointer',
    borderRadius: 8,
  },
  menuRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 10px',
    cursor: 'pointer',
    borderRadius: 8,
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  wallpaperGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    padding: '0 10px',
  },
  wallpaperItem: {
    height: 70,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.2s',
  },
  wallpaperLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#555',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '90%',
  },
  cancelBtn: {
    padding: '10px 24px',
    borderRadius: 20,
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  },
  dangerBtn: {
    padding: '10px 24px',
    borderRadius: 20,
    border: 'none',
    background: '#d32f2f',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  },
};

export default Settings;
