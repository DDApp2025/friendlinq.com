import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LoginAttempt } from '../actions/auth_actions';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('userCredentials');
    if (saved) {
      try {
        const cred = JSON.parse(saved);
        if (cred.userName) setEmail(cred.userName);
        if (cred.password) setPassword(cred.password);
      } catch (_) {}
    }
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      setError('All fields are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password should be minimum six letters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const res = await dispatch(LoginAttempt(email, password));
    setLoading(false);

    if (res.success) {
      if (rememberMe) {
        localStorage.setItem(
          'userCredentials',
          JSON.stringify({ userName: email, password })
        );
      } else {
        localStorage.removeItem('userCredentials');
      }
      navigate('/home');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollContent}>
        {/* App Logo */}
        <div style={styles.iconWrapper}>
          <img src="/logo-app.jpeg" alt="FriendLinq" style={styles.logoImage} />
        </div>

        {/* App Name */}
        <h1 style={styles.appName}>FriendLinq</h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Email"
              autoCapitalize="none"
              autoFocus
              style={styles.input}
            />
          </div>

          {/* Password Input */}
          <div style={{ ...styles.inputWrapper, ...styles.passwordRow }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              style={{ ...styles.input, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                /* eye-off icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="grey" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                </svg>
              ) : (
                /* eye icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="grey" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password / Remember Me row */}
          <div style={styles.optionsRow}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot Password ?
            </Link>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.rememberText}>Remember Me</span>
            </label>
          </div>

          {/* Error Message */}
          {error && <p style={styles.errorText}>{error}</p>}

          {/* Login Button */}
          <button type="submit" disabled={loading} style={styles.loginButton}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Button */}
        <button
          onClick={() => navigate('/register')}
          style={styles.signUpButton}
        >
          Sign Up
        </button>

        {/* Tagline */}
        <p style={styles.tagline}>
          Join others finding connections on FriendLinq
        </p>
      </div>

      {/* Loading Overlay */}
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
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  iconWrapper: {
    marginTop: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 0,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    height: 50,
    display: 'flex',
    alignItems: 'center',
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
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    padding: 0,
    marginRight: 5,
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  forgotLink: {
    color: 'black',
    fontSize: 15,
    textDecoration: 'none',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#1a6b3a',
    width: 18,
    height: 18,
    cursor: 'pointer',
  },
  rememberText: {
    color: 'black',
    marginLeft: 4,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#1a6b3a',
    border: 'none',
    borderRadius: 30,
    marginTop: 30,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  signUpButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#4a9e6e',
    border: 'none',
    borderRadius: 30,
    marginTop: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tagline: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

export default Login;
