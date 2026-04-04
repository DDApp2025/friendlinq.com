import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ResetPasswordAttempt } from '../actions/auth_actions';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resetPasswordToken = useSelector((state) => state.authReducer.resetPasswordToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    if (!resetPasswordToken) {
      setError('No reset token found. Please verify OTP first.');
      return;
    }

    setLoading(true);
    const res = await dispatch(ResetPasswordAttempt({
      passwordResetToken: resetPasswordToken,
      newPassword: confirmPassword,
    }));
    setLoading(false);

    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login');
    } else {
      setError(res.message || 'Failed to reset password');
    }
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Reset Password | Friendlinq — Ad-Free Social Network</title>
        <meta name="description" content="Set a new password for your Friendlinq account. Friendlinq is the free, ad-free private social network — a Facebook alternative with no tracking and no data selling." />
        <link rel="canonical" href="https://friendlinq.com/reset-password" />
        <meta property="og:title" content="Reset Password | Friendlinq — Ad-Free Social Network" />
        <meta property="og:description" content="Set a new password for Friendlinq. The free, ad-free private social network — a Facebook alternative with no tracking and no algorithms." />
        <meta property="og:url" content="https://friendlinq.com/reset-password" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reset Password | Friendlinq — Ad-Free Social Network" />
        <meta name="twitter:description" content="Set a new password for Friendlinq. The free, ad-free private social network with no tracking." />
      </Helmet>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={styles.title}>Reset Password</h1>
          <div style={{ width: 50 }} />
        </div>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading} style={styles.confirmBtn}>
            {loading ? 'Resetting...' : 'Confirm'}
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 0,
  },
  inputWrapper: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 20,
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
  confirmBtn: {
    height: 50,
    width: '100%',
    backgroundColor: '#87CEEB',
    border: 'none',
    borderRadius: 5,
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

export default ResetPassword;
