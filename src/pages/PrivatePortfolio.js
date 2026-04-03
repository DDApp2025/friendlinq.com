import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { dotnetApi } from '../api/axios';
import normalizeImg from '../utils/normalizeImg';
import { MdClose, MdArrowBack, MdPlayArrow, MdLock } from 'react-icons/md';

export default function PrivatePortfolio() {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const token = useSelector((s) => s.authReducer.login_access_token);

  const [portfolio, setPortfolio] = useState([]);
  const [videoPortfolio, setVideoPortfolio] = useState([]);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isOwnPortfolio] = useState(!friendId);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (friendId) {
      checkAccess();
    } else {
      fetchOwnPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId]);

  const fetchOwnPortfolio = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.post('/Customer/GetPrivatePortfolio', {
        authorization: token,
      });
      if (res.data?.StatusCode === 200) {
        const data = res.data.Data || [];
        setPortfolio(data.filter((e) => !e?.filePath?.match('mp4')));
        setVideoPortfolio(data.filter((e) => e?.filePath?.match('mp4')));
      }
    } catch (err) {
      console.error('Failed to fetch private portfolio', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.post('/Customer/CheckPrivatePortfolioAccessAndGet', {
        authorization: token,
        friendId: friendId,
      });
      if (res.data?.StatusCode === 200) {
        const data = res.data.Data || [];
        if (data.length > 0) {
          setPortfolio(data.filter((e) => !e?.filePath?.match('mp4')));
          setVideoPortfolio(data.filter((e) => e?.filePath?.match('mp4')));
          setAccessDenied(false);
        } else {
          setAccessDenied(true);
        }
      } else {
        setAccessDenied(true);
      }
    } catch (err) {
      console.error('Check access error', err);
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    try {
      const res = await dotnetApi.post('/Customer/AccessToPrivatePortfolio', {
        authorization: token,
        friendId: friendId,
      });
      if (res.data?.StatusCode === 200) {
        alert('Access request sent!');
      } else {
        alert(res.data?.Message || 'Request failed');
      }
    } catch (err) {
      console.error('Request access error', err);
      alert('Request failed');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10000000) {
      alert('File must be less than 10 MB');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('authorization', token);
      formData.append('File[0]', file);
      // .NET upload uses direct fetch since it's multipart with auth in body
      const res = await fetch('https://unpokedfolks.com/api/Customer/UploadPrivatePortfolio', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.StatusCode === 200) {
        fetchOwnPortfolio();
      } else {
        alert(data.Message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this item?')) return;
    setLoading(true);
    try {
      const res = await dotnetApi.post('/Customer/DeletePrivatePortfolio', {
        authorization: token,
        portfolioId: item._id,
      });
      if (res.data?.StatusCode === 200) {
        fetchOwnPortfolio();
      } else {
        alert(res.data?.Message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = isVideo ? videoPortfolio : portfolio;
  const previewItem = previewIndex >= 0 ? currentList[previewIndex] : null;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  if (accessDenied && friendId) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <MdArrowBack size={24} />
            </button>
            <h2 style={styles.title}>Private Portfolio</h2>
          </div>
          <div style={styles.accessDenied}>
            <MdLock size={48} color="#999" />
            <p>This portfolio is private.</p>
            <button style={styles.requestBtn} onClick={handleRequestAccess}>
              Request Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={styles.title}>Private Portfolio</h2>
        </div>

        {isOwnPortfolio && (
          <div style={styles.actions}>
            <button style={styles.addBtn} onClick={() => fileInputRef.current?.click()} disabled={loading}>
              Upload File
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleUpload} />
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, backgroundColor: isVideo ? '#e0e0e0' : '#fff' }}
            onClick={() => setIsVideo(false)}
          >
            Images
          </button>
          <button
            style={{ ...styles.tab, backgroundColor: !isVideo ? '#e0e0e0' : '#fff' }}
            onClick={() => setIsVideo(true)}
          >
            Videos
          </button>
        </div>

        {currentList.length === 0 ? (
          <div style={styles.loadingText}>No {isVideo ? 'videos' : 'images'} yet.</div>
        ) : (
          <div style={styles.grid}>
            {currentList.map((item, index) => {
              const imgUrl = normalizeImg(item.filePath);
              const isVid = item?.filePath?.match('mp4');
              return (
                <div key={item._id || index} style={styles.gridCell}>
                  <div style={styles.cellInner} onClick={() => setPreviewIndex(index)}>
                    <img src={imgUrl} alt="Private portfolio" style={styles.cellImg} />
                    {isVid && (
                      <div style={styles.playOverlay}>
                        <MdPlayArrow size={36} color="#fff" />
                      </div>
                    )}
                  </div>
                  {isOwnPortfolio && (
                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                    >
                      <MdClose size={22} color="#fff" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview overlay */}
      {previewItem && (
        <div style={styles.previewOverlay}>
          <button style={styles.previewClose} onClick={() => setPreviewIndex(-1)}>
            <MdClose size={32} color="#fff" />
          </button>
          {previewItem.filePath?.match('mp4') ? (
            <video
              src={normalizeImg(previewItem.filePath)}
              controls
              autoPlay
              style={styles.previewMedia}
            />
          ) : (
            <img
              src={normalizeImg(previewItem.filePath)}
              alt="Preview"
              style={styles.previewMedia}
            />
          )}
          {isOwnPortfolio && (
            <button
              style={styles.previewDeleteBtn}
              onClick={() => { handleDelete(previewItem); setPreviewIndex(-1); }}
            >
              Delete
            </button>
          )}
        </div>
      )}
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
    maxWidth: 700,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a6b3a',
  },
  actions: {
    display: 'flex',
    gap: 10,
    padding: '12px 16px',
  },
  addBtn: {
    flex: 1,
    padding: '10px 0',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tabs: { display: 'flex' },
  tab: {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    color: '#1a6b3a',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 15,
  },
  accessDenied: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  requestBtn: {
    marginTop: 16,
    padding: '10px 30px',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 5,
    padding: 5,
  },
  gridCell: {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
  },
  cellInner: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
  },
  cellImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  previewOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#000',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'rgba(0,0,0,0.6)',
    border: 'none',
    borderRadius: '50%',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
  },
  previewMedia: {
    maxWidth: '90%',
    maxHeight: '80vh',
    objectFit: 'contain',
  },
  previewDeleteBtn: {
    marginTop: 20,
    padding: '10px 40px',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
