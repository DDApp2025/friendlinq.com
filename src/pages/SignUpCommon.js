import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { SignUpAttempt, LoginAttempt, getProfileAttempt, makeUserFriendWithAdmin } from '../actions/auth_actions';

function SignUpCommon() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Enter valid name');
      return false;
    }
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
    if (confirmPassword.length < 6) {
      setError('Password should be minimum six letters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);

    // Step 1: Register
    const signupData = {
      fullName: name,
      email: email,
      password: confirmPassword,
      gender: '',
      deviceType: 'ANDROID',
      deviceToken: 'web',
      usertype: '0',
    };

    const res = await dispatch(SignUpAttempt(signupData));

    if (res.statusCode === 200 || res.success) {
      // Make friend with admin
      if (res.data?.customerData?._id) {
        await dispatch(makeUserFriendWithAdmin(res.data.customerData._id));
      }

      // Wait 1.5s for backend to finish processing the new account
      await new Promise((r) => setTimeout(r, 1500));

      // Auto-login after signup
      const loginRes = await dispatch(LoginAttempt(email, confirmPassword));
      if (loginRes.success) {
        await dispatch(getProfileAttempt());
        setLoading(false);
        navigate('/home');
      } else {
        // Retry login once
        await new Promise((r) => setTimeout(r, 1000));
        const loginRes2 = await dispatch(LoginAttempt(email, confirmPassword));
        setLoading(false);
        if (loginRes2.success) {
          await dispatch(getProfileAttempt());
          navigate('/home');
        } else {
          setSuccessMsg('Account created! Taking you to login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } else {
      setLoading(false);
      setError(res.message || 'Registration failed');
    }
  };

  const EyeIcon = ({ open }) => open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="grey" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="grey" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Sign Up Free | Friendlinq — Private Social Network, No Ads</title>
        <meta name="description" content="Join Friendlinq free — the ad-free social network and Facebook alternative. No tracking, no algorithms. Connect with friends, join groups, video call, and share photos." />
        <link rel="canonical" href="https://friendlinq.com/register" />
        <meta property="og:title" content="Sign Up Free | Friendlinq — Private Social Network, No Ads" />
        <meta property="og:description" content="Join Friendlinq free — the ad-free, private social network. No tracking, no algorithms, no data selling. Connect with friends and family, join community groups, and make video calls." />
        <meta property="og:url" content="https://friendlinq.com/register" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://friendlinq.com/og-image.jpg" />
        <meta property="og:site_name" content="Friendlinq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign Up Free | Friendlinq — Private Social Network, No Ads" />
        <meta name="twitter:description" content="Join Friendlinq free — the ad-free social network. No tracking, no algorithms, no data selling. Just real connection." />
      </Helmet>
      <div style={styles.scrollContent}>
        {/* Logo */}
        <div style={styles.iconWrapper}>
          <div style={styles.iconCircle}>
            <div style={styles.iconSquare}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20C8 14 12 10 17 10C20 10 22 11.5 23 13C24 11.5 26 10 29 10C34 10 38 14 38 20C38 26 34 30 29 30C26 30 24 28.5 23 27C22 28.5 20 30 17 30C12 30 8 26 8 20Z" stroke="white" strokeWidth="2.5" fill="none" />
                <path d="M2 20C2 14 6 10 11 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <h1 style={styles.title}>Create Your Friendlinq Account</h1>

        {/* Full Name */}
        <div style={{ ...styles.inputWrapper, marginTop: 40 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Enter your full name"
            style={styles.input}
          />
        </div>

        {/* Email */}
        <div style={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="Enter your email"
            autoCapitalize="none"
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={{ ...styles.inputWrapper, ...styles.passwordRow }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Create a strong password"
            autoCapitalize="none"
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {/* Confirm Password */}
        <div style={{ ...styles.inputWrapper, ...styles.passwordRow }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            placeholder="Confirm your password"
            autoCapitalize="none"
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        {successMsg && <p style={{ color: '#1a6b3a', textAlign: 'center', marginTop: 10, fontSize: 14, fontWeight: 600 }}>{successMsg}</p>}

        <button onClick={handleSignup} disabled={loading} style={styles.nextButton}>
          {loading ? 'Signing up...' : 'Next'}
        </button>

        <div style={styles.loginRow}>
          <span style={styles.loginText}>Already have an account ?</span>
          <Link to="/login" style={styles.loginLink}>Login</Link>
        </div>
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
    backgroundColor: '#ededed',
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
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  iconSquare: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#1a6b3a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    height: 50,
    width: '100%',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  nextButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#1a6b3a',
    border: 'none',
    borderRadius: 40,
    marginTop: 30,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loginRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 5,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 15,
    color: 'black',
  },
  loginLink: {
    color: '#1a6b3a',
    fontSize: 17,
    fontWeight: 'bold',
    textDecoration: 'none',
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

export default SignUpCommon;
