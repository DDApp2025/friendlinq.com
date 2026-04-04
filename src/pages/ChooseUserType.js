import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAttempt, updateUserType, setUserType } from '../actions/auth_actions';

function ChooseUserType() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((s) => s);
  const token = store.authReducer.login_access_token;
  const profileData = store.authReducer.getProfileData;

  useEffect(() => {
    dispatch(getProfileAttempt());
  }, [dispatch]);

  const handleChoose = async (type) => {
    setLoading(true);
    localStorage.setItem('usertype', type);
    dispatch(setUserType(type));

    if (token && profileData?._id) {
      await dispatch(updateUserType(token, profileData._id, type));
    }

    setLoading(false);
    navigate('/home');
  };

  return (
    <div style={styles.container}>
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

        <h1 style={styles.pageTitle}>Choose Your Friendlinq Experience</h1>

        <div style={styles.content}>
          {/* Social Media Section */}
          <h2 style={styles.sectionTitle}>Friendlinq Social Media:</h2>
          <p style={styles.body}>
            Connect with friends and make new ones in your area.
          </p>
          <p style={{ ...styles.body, marginTop: 20, whiteSpace: 'pre-line' }}>
            {`Features:\n\u2713 Create custom profile\n\u2713 Join groups\n\u2713 Message friends\n\u2713 Post and download in your feed`}
          </p>
          <button
            onClick={() => handleChoose('normal')}
            disabled={loading}
            style={styles.chooseButton}
          >
            Join Friendlinq Social Media for Free
          </button>

          {/* Dating Section */}
          <h2 style={{ ...styles.sectionTitle, marginTop: 20 }}>Friendlinq Flirting/Dating:</h2>
          <p style={styles.body}>
            Find meaningful connections and potential partners
          </p>
          <p style={{ ...styles.body, marginTop: 20, whiteSpace: 'pre-line' }}>
            {`Features:\n\u2713 All Social Features, plus\n\u2713 Single Adults Flirting/Dating\n\u2713 Premium Messaging\n\u2713 Ad free experience`}
          </p>
          <p style={{ ...styles.body, marginTop: 20, whiteSpace: 'pre-line' }}>
            {`Pricing:\nPlans starting at $.99/month with our limited-time offer!`}
          </p>
          <button
            onClick={() => handleChoose('dating')}
            disabled={loading}
            style={styles.chooseButton}
          >
            Explore Flirting/Dating Plans
          </button>
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
    marginTop: 5,
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
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    width: '100%',
  },
  sectionTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 0,
  },
  body: {
    color: 'black',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 0,
    lineHeight: 1.5,
  },
  chooseButton: {
    height: 50,
    width: '90%',
    backgroundColor: '#1a6b3a',
    border: 'none',
    borderRadius: 40,
    marginTop: 30,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
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

export default ChooseUserType;
