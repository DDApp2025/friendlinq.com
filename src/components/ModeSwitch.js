import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserType } from '../actions/auth_actions';
import { BASE_URL } from '../api/config';

// One place to change between Social Mode and Dating Mode, used by the top menu and by Settings.
// Same words and same steps as the app (homeSocial_screen.js confirmModeSwitch).
// Social Mode and Dating Mode use the same account; the mode decides which feed you see
// and which profile other members see.

const TEXT = {
  toDating: {
    title: 'Switch to Dating Mode?',
    body:
      'Dating Mode is a separate profile with its own friends, chats, groups, photos and posts. Nothing from your Public Profile is shown there, and nothing from Dating is shown on your Public Profile.\n\nYou can switch back any time from the menu.',
    button: 'Switch to Dating',
  },
  toSocial: {
    title: 'Switch to Social Mode?',
    body:
      'You will go back to your Public Profile, with your friends, chats, groups, photos and posts.\n\nYour Dating Profile and everything in it is kept separately. You can switch back any time from the menu.',
    button: 'Switch to Social',
  },
};

export function useModeSwitch() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.authReducer);
  const userType = auth.userType === 'dating' ? 'dating' : 'normal';
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const label = userType === 'dating' ? 'Switch to Social Mode' : 'Switch to Dating Mode';
  const t = userType === 'dating' ? TEXT.toSocial : TEXT.toDating;

  const requestSwitch = () => setOpen(true);

  // Social and Dating are two separate linked profiles (Robert, November 7, 2026). The server hands back
  // the other profile's sign-in; the page then reloads so everything shown belongs to that profile.
  const doSwitch = async () => {
    const newType = userType === 'dating' ? 'normal' : 'dating';
    const token = auth.login_access_token;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('to', newType === 'dating' ? 'dating' : 'social');
      const r = await fetch(BASE_URL + '/api/v1/user/switchProfile', { method: 'POST', headers: { authorization: token }, body: fd });
      const res = await r.json();
      const c = res && res.statusCode === 200 && res.data && res.data.customerData;
      if (c && c.accessToken) {
        localStorage.setItem('accessUserToken', c.accessToken);
        localStorage.setItem('usertype', newType);
        // Keep the real sign-in email; the Dating record has an internal address.
        const keepEmail = /@dating\.friendlinq\.com$/i.test(String(c.email || '')) ? (auth && !/@dating\.friendlinq\.com$/i.test(String(auth.email || '')) && auth.email) || c.email : c.email;
        dispatch({ type: 'LOGIN_SUCCESS', email: keepEmail, login_access_token: c.accessToken });
        dispatch({ type: 'GET_PROFILE_SUCCESS', getProfile: c });
        dispatch(setUserType(newType));
        setOpen(false);
        const firstTimeDating = newType === 'dating' && !(c.looking_for && c.looking_for !== 'null');
        setTimeout(() => { window.location.href = firstTimeDating ? '/profile' : '/home'; }, 200);
      } else {
        alert((res && res.message) || 'Unable to switch. Please try again.');
      }
    } catch (err) {
      console.error('mode switch error:', err);
      alert('Unable to switch. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const dialog = open ? (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label={t.title}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{t.title}</h3>
        <p style={styles.body}>{t.body}</p>
        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </button>
          <button style={styles.okBtn} onClick={doSwitch} disabled={busy}>
            {busy ? 'Switching...' : t.button}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { userType, label, requestSwitch, dialog };
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 440,
    width: '100%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  title: { margin: '0 0 12px', color: '#1a6b3a', fontSize: 20 },
  body: { margin: '0 0 20px', color: '#333', fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-line' },
  buttons: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: 8,
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 15,
  },
  okBtn: {
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#1a6b3a',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
  },
};
