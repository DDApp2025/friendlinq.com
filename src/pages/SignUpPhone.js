import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL_3 } from '../api/config';

const COUNTRY_CODES = [
  { code: '+1', name: 'US/CA' },
  { code: '+44', name: 'UK' },
  { code: '+91', name: 'IN' },
  { code: '+61', name: 'AU' },
  { code: '+49', name: 'DE' },
  { code: '+33', name: 'FR' },
  { code: '+81', name: 'JP' },
  { code: '+86', name: 'CN' },
  { code: '+55', name: 'BR' },
  { code: '+52', name: 'MX' },
  { code: '+234', name: 'NG' },
  { code: '+27', name: 'ZA' },
  { code: '+82', name: 'KR' },
  { code: '+39', name: 'IT' },
  { code: '+34', name: 'ES' },
  { code: '+7', name: 'RU' },
  { code: '+62', name: 'ID' },
  { code: '+63', name: 'PH' },
  { code: '+66', name: 'TH' },
  { code: '+84', name: 'VN' },
];

function SignUpPhone() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    if (!canResend && showOtpModal) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setCanResend(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [canResend, showOtpModal]);

  const sendOTP = useCallback(async (isResend = false) => {
    try {
      setLoading(true);
      const fullPhone = countryCode + phone;
      const res = await fetch(
        `${BASE_URL_3}/Customer/SendOtpOnPhone?email=${encodeURIComponent(fullPhone)}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const val = await res.json();
      if (val?.StatusCode === 200) {
        if (!isResend) {
          setShowOtpModal(true);
        }
        setTimer(60);
        setCanResend(false);
      } else {
        setError(val?.Message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [countryCode, phone]);

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please fill OTP');
      return;
    }
    try {
      setLoading(true);
      const fullPhone = countryCode + phone;
      const res = await fetch(
        `${BASE_URL_3}/Customer/VerifyPhoneOtp?phone=${encodeURIComponent(fullPhone)}&otp=${otp}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const val = await res.json();
      if (val?.StatusCode === 200) {
        setShowOtpModal(false);
        navigate('/register/details', { state: { phone: fullPhone } });
      } else {
        setError('Please enter valid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (!phone.trim()) {
      setError('Please enter phone number');
      return;
    }
    sendOTP();
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

        <h1 style={styles.title}>Create Your Friendlinq Account</h1>

        {/* Phone input row */}
        <div style={styles.phoneRow}>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={styles.countrySelect}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.name}
              </option>
            ))}
          </select>
          <div style={styles.phoneInputWrapper}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              placeholder="Enter your phone number"
              style={styles.input}
            />
          </div>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <button onClick={handleNext} disabled={loading} style={styles.nextButton}>
          {loading ? 'Sending...' : 'Next'}
        </button>

        <div style={styles.loginRow}>
          <span style={styles.loginText}>Already have an account ?</span>
          <Link to="/login" style={styles.loginLink}>Login</Link>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalText}>
              A one time OTP has been sent to the phone number you entered. Only valid, active phone numbers will receive an OTP code. Enter the six digit code and click verify.
            </p>
            <p style={{ ...styles.modalText, marginTop: 10, fontWeight: '600' }}>
              Phone Number {countryCode}{phone}
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setError(''); }}
              placeholder="OTP"
              style={styles.otpInput}
              maxLength={6}
            />

            {!canResend && (
              <p style={{ marginTop: 5, fontSize: 14, color: '#333' }}>
                Resend in {timer}s
              </p>
            )}

            {error && <p style={styles.errorText}>{error}</p>}

            <div style={styles.modalButtons}>
              {canResend && (
                <button
                  onClick={() => { setError(''); sendOTP(true); }}
                  style={styles.modalBtn}
                >
                  Resend
                </button>
              )}
              <button onClick={() => { setError(''); verifyOtp(); }} style={styles.modalBtn}>
                Verify
              </button>
              <button
                onClick={() => { setShowOtpModal(false); setOtp(''); setError(''); }}
                style={{ ...styles.modalBtn, backgroundColor: 'red' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
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
    marginTop: 15,
    textAlign: 'center',
  },
  phoneRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
    gap: 10,
  },
  countrySelect: {
    height: 50,
    minWidth: 80,
    borderRadius: 5,
    border: 'none',
    backgroundColor: 'white',
    fontSize: 15,
    padding: '0 7px',
    cursor: 'pointer',
    outline: 'none',
  },
  phoneInputWrapper: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
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
  // OTP Modal
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 80,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 25,
    maxWidth: 400,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  otpInput: {
    width: 150,
    height: 40,
    border: '1px solid grey',
    borderRadius: 4,
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
    outline: 'none',
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  modalBtn: {
    backgroundColor: '#1a6b3a',
    color: 'white',
    border: 'none',
    padding: '7px 15px',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 14,
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

export default SignUpPhone;
