import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordAttempt } from '../actions/auth_actions';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword) {
      setError('Please enter old password');
      return;
    }
    if (!newPassword) {
      setError('Please enter new password');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password should be minimum six letters');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await dispatch(ChangePasswordAttempt({
      oldPassword,
      newPassword: confirmPassword,
    }));
    setLoading(false);

    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(res.message || 'Password changed successfully');
    } else {
      setError(res.message || 'Failed to change password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Back button */}
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 style={styles.title}>Change Password</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrapper}>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => { setOldPassword(e.target.value); setError(''); }}
              placeholder="Old Password"
              autoCapitalize="none"
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
              placeholder="New Password"
              autoCapitalize="none"
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              placeholder="Confirm Password"
              autoCapitalize="none"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
          {success && <p style={styles.successText}>{success}</p>}

          <button type="submit" disabled={loading} style={styles.confirmBtn}>
            {loading ? 'Changing...' : 'Confirm'}
          </button>
        </form>
      </div>

      {loading && (
        <div style={styles.overlay}>
          <div style={styles.spinner} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#1a6b3a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    width: '100%',
    maxWidth: 480,
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    padding: 0,
    marginTop: 12,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  inputWrapper: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid grey',
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  successText: {
    color: '#90ee90',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  confirmBtn: {
    height: 50,
    width: '100%',
    backgroundColor: 'grey',
    border: 'none',
    borderRadius: 25,
    marginTop: 30,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1a6b3a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default ChangePassword;
