import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ForgotPasswordAttempt } from '../actions/auth_actions';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Enter email');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter valid email');
      return;
    }

    setLoading(true);
    const res = await dispatch(ForgotPasswordAttempt({ email }));
    setLoading(false);

    if (res.success) {
      setSuccess('Your FriendLinq password has been sent to your registered email. Please check your email.');
      setEmail('');
    } else {
      setError(res.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Forgot Password | Friendlinq</title>
        <meta name="description" content="Reset your Friendlinq password. Enter your email to receive a verification code." />
        <link rel="canonical" href="https://friendlinq.com/forgot-password" />
        <meta property="og:title" content="Forgot Password | Friendlinq" />
        <meta property="og:description" content="Reset your Friendlinq password. Enter your email to receive a verification code." />
        <meta property="og:url" content="https://friendlinq.com/forgot-password" />
      </Helmet>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={styles.title}>Forgot Password</h1>
          <div style={{ width: 50 }} />
        </div>

        <p style={styles.description}>
          Enter the email you used to join FriendLinq below and we'll send you an OTP for resetting your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Email"
              autoCapitalize="none"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
          {success && <p style={styles.successText}>{success}</p>}

          <button type="submit" disabled={loading} style={styles.confirmBtn}>
            {loading ? 'Sending...' : 'Confirm'}
          </button>
        </form>

        <p style={styles.linkText}>
          Already have the OTP?{' '}
          <span onClick={() => navigate('/verify-otp')} style={styles.link}>Verify OTP</span>
        </p>
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
  description: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
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
    backgroundColor: '#87CEEB',
    border: 'none',
    borderRadius: 5,
    marginTop: 30,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  linkText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    textDecoration: 'underline',
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

export default ForgotPassword;
