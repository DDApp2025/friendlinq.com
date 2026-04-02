import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadProfilePic, uploadBannerPic, saveProfileData } from '../actions/profile_actions';
import { MdCameraAlt, MdArrowBack, MdSave } from 'react-icons/md';

const IMG_BASE = 'https://natural.friendlinq.com/';

function normalizeImg(url) {
  if (!url) return '';
  if (typeof url === 'object') return url.thumbnail ? IMG_BASE + url.thumbnail : '';
  if (typeof url === 'string' && !url.startsWith('http')) return IMG_BASE + url;
  return url;
}

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((s) => s.authReducer.getProfileData) || {};

  const [fullName, setFullName] = useState(() => profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '');
  const [about, setAbout] = useState(() => profile.about || '');
  const [phoneNumber, setPhoneNumber] = useState(() => profile.phoneNumber || '');
  const [city, setCity] = useState(() => profile.city || '');
  const [state1, setState1] = useState(() => profile.state || '');
  const [country, setCountry] = useState(() => profile.country || '');
  const [gender, setGender] = useState(() => profile.gender || '');

  const [bannerPreview, setBannerPreview] = useState(normalizeImg(profile.bannerURL));
  const [avatarPreview, setAvatarPreview] = useState(profile.imageURL || '');
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState('');

  const picInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handlePickProfilePic = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingPic(true);
    setMessage('');
    const result = await dispatch(uploadProfilePic(file));
    setUploadingPic(false);
    if (result.success) {
      setMessage('Profile photo updated!');
      setAvatarPreview(result.imageURL);
    } else {
      setMessage(result.message || 'Photo upload failed');
    }
  };

  const handlePickBanner = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
    setUploadingBanner(true);
    setMessage('');
    const result = await dispatch(uploadBannerPic(file));
    setUploadingBanner(false);
    if (result.success) {
      setMessage('Banner updated!');
      setBannerPreview(result.imageURL);
    } else {
      setMessage(result.message || 'Banner upload failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const result = await dispatch(saveProfileData({
      fullName,
      about,
      phoneNumber,
      city,
      state: state1,
      country,
      gender,
    }));
    if (result.success) {
      setMessage('Profile saved!');
      setTimeout(() => navigate('/profile'), 800);
    } else {
      setMessage(result.message || 'Save failed');
    }
    setSaving(false);
  };

  const nameParts = fullName.trim().split(' ');
  const initials = `${(nameParts[0] || '').charAt(0)}${(nameParts[1] || '').charAt(0)}`.toUpperCase() || '?';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/profile')}>
            <MdArrowBack size={22} />
          </button>
          <h2 style={styles.title}>Edit Profile</h2>
        </div>

        {/* Banner upload */}
        <div style={styles.bannerWrap} onClick={() => bannerInputRef.current?.click()}>
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner" style={styles.bannerImg} onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div style={styles.bannerPlaceholder} />
          )}
          <div style={styles.cameraOverlayBanner}>
            <MdCameraAlt size={24} color="#fff" />
            {uploadingBanner && <span style={{ color: '#fff', fontSize: 12 }}>Uploading...</span>}
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" onChange={handlePickBanner} style={{ display: 'none' }} />
        </div>

        {/* Profile pic upload */}
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrap} onClick={() => picInputRef.current?.click()}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>{initials}</div>
            )}
            <div style={styles.cameraOverlayAvatar}>
              <MdCameraAlt size={18} color="#fff" />
            </div>
            {uploadingPic && <div style={styles.uploadingOverlay}>Uploading...</div>}
          </div>
          <input ref={picInputRef} type="file" accept="image/*" onChange={handlePickProfilePic} style={{ display: 'none' }} />
        </div>

        {/* Form fields */}
        <div style={styles.form}>
          <label style={styles.label}>Name</label>
          <input style={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name" />

          <label style={styles.label}>About</label>
          <textarea style={styles.textarea} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="About yourself" rows={3} />

          <label style={styles.label}>Phone Number</label>
          <input style={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" />

          <label style={styles.label}>Gender</label>
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} style={styles.radioInput} />
              Male
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} style={styles.radioInput} />
              Female
            </label>
          </div>

          <div style={styles.rowFields}>
            <div style={styles.halfField}>
              <label style={styles.label}>City</label>
              <input style={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            </div>
            <div style={styles.halfField}>
              <label style={styles.label}>State</label>
              <input style={styles.input} value={state1} onChange={(e) => setState1(e.target.value)} placeholder="State" />
            </div>
          </div>

          <label style={styles.label}>Country</label>
          <input style={styles.input} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />

          {message && (
            <div style={{ ...styles.message, color: message.includes('fail') || message.includes('Failed') ? '#d32f2f' : '#1a6b3a' }}>
              {message}
            </div>
          )}

          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <MdSave size={18} />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 12px',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 56px)',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    color: '#333',
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: '#222',
  },
  bannerWrap: {
    position: 'relative',
    width: '100%',
    height: 160,
    cursor: 'pointer',
    backgroundColor: '#1a6b3a',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a6b3a 0%, #2ecc71 100%)',
  },
  cameraOverlayBanner: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -45,
    marginBottom: 12,
    position: 'relative',
    zIndex: 2,
  },
  avatarWrap: {
    position: 'relative',
    cursor: 'pointer',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  cameraOverlayAvatar: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
  },
  form: {
    padding: '0 20px 24px',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 4,
    marginTop: 14,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  radioRow: {
    display: 'flex',
    gap: 24,
    marginTop: 4,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    cursor: 'pointer',
    color: '#333',
  },
  radioInput: {
    accentColor: '#1a6b3a',
  },
  rowFields: {
    display: 'flex',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  message: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginTop: 20,
    padding: '12px 0',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
