import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nodeApi } from '../api/axios';
import normalizeImg from '../utils/normalizeImg';
import { MdClose, MdArrowBack, MdPlayArrow, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

export default function Portfolio() {
  const navigate = useNavigate();
  const profile = useSelector((s) => s.authReducer.getProfileData) || {};
  const userType = useSelector((s) => s.authReducer.userType) || 'normal';

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [portfolioVideos, setPortfolioVideos] = useState([]);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [selectedImages, setSelectedImages] = useState(
    userType === 'dating'
      ? profile?.topFourImageDating || []
      : profile?.topFourImage || []
  );
  const [selectedVideo, setSelectedVideo] = useState(
    userType === 'dating'
      ? profile?.userVideoDating || ''
      : profile?.userVideo || ''
  );
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await nodeApi.post('/api/v1/post/getMyPortfolio', { skip: 0, limit: 0 });
      if (res.data?.statusCode === 200) {
        const all = res.data.data?.myPortolio || [];
        setPortfolioImages(all.filter((e) => !e?.imageURL?.match('mp4')));
        setPortfolioVideos(all.filter((e) => e?.imageURL?.match('mp4')));
      }
    } catch (err) {
      console.error('Failed to fetch portfolio', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('mediaFile0', file);
      const res = await nodeApi.post('/api/v1/post/createPortfolio', formData);
      if (res.data?.statusCode === 200) {
        fetchPortfolio();
      } else {
        alert(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('mediaFile0', file);
      // Generate a thumbnail frame from video
      const thumbBlob = await generateVideoThumbnail(file);
      if (thumbBlob) {
        formData.append('thumbnailFile0', thumbBlob, 'thumbnail.jpg');
      }
      const res = await nodeApi.post('/api/v1/post/createPortfolio', formData);
      if (res.data?.statusCode === 200) {
        fetchPortfolio();
      } else {
        alert(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    setLoading(true);
    try {
      const res = await nodeApi.post('/api/v1/post/deleteMyPortfolio', { portfolioId: id.toString() });
      if (res.data?.statusCode === 200) {
        fetchPortfolio();
      } else {
        alert(res.data?.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = async (imageUrl) => {
    if (selectedImages.length >= 4 && !selectedImages.includes(imageUrl)) {
      alert('You can select maximum 4 images.');
      return;
    }
    let newSel;
    if (selectedImages.includes(imageUrl)) {
      newSel = selectedImages.filter((e) => e !== imageUrl);
    } else {
      newSel = [...selectedImages, imageUrl];
    }
    try {
      await nodeApi.post('/api/v1/user/addTopFourImage', { image: JSON.stringify(newSel) });
      setSelectedImages(newSel);
    } catch (err) {
      console.error('Select image error', err);
    }
  };

  const handleSelectVideo = async (videoUrl, thumbUrl) => {
    let vid = videoUrl;
    let thumb = thumbUrl;
    if (selectedVideo === videoUrl) {
      vid = '';
      thumb = '';
    }
    const body = userType === 'dating'
      ? { userVideoDating: vid, userVideoThumbnailDating: thumb }
      : { userVideo: vid, userVideoThumbnail: thumb };
    try {
      await nodeApi.post('/api/v1/user/updateUserVideo', body);
      setSelectedVideo(vid);
    } catch (err) {
      console.error('Select video error', err);
    }
  };

  const currentList = isVideo ? portfolioVideos : portfolioImages;

  const previewItem = previewIndex >= 0 ? currentList[previewIndex] : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={styles.title}>Photo Library</h2>
        </div>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button style={styles.addBtn} onClick={() => fileInputRef.current?.click()} disabled={loading}>
            {loading ? 'Uploading...' : 'Add Image'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddImage} />

          <button style={styles.addBtn} onClick={() => videoInputRef.current?.click()} disabled={loading}>
            Add Video
          </button>
          <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleAddVideo} />
        </div>

        {/* Info text */}
        <p style={styles.infoText}>Select {isVideo ? 'Video' : 'Images'} to show in your profile.</p>

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

        {/* Grid */}
        {loading && currentList.length === 0 ? (
          <div style={styles.loadingText}>Loading...</div>
        ) : currentList.length === 0 ? (
          <div style={styles.loadingText}>No {isVideo ? 'videos' : 'images'} yet.</div>
        ) : (
          <div style={styles.grid}>
            {currentList.map((item, index) => {
              const imgUrl = normalizeImg(item.imageURL);
              const thumbUrl = item.thumbnailURL ? normalizeImg(item.thumbnailURL) : '';
              const isVid = item?.imageURL?.match('mp4');
              const fullUrl = 'https://natural.friendlinq.com/' + item.imageURL;
              const fullThumbUrl = item.thumbnailURL ? 'https://natural.friendlinq.com/' + item.thumbnailURL : '';
              const isSelected = isVid
                ? selectedVideo === fullUrl
                : selectedImages.includes(fullUrl);

              return (
                <div key={item._id || index} style={styles.gridCell}>
                  <div
                    style={styles.cellInner}
                    onClick={() => setPreviewIndex(index)}
                  >
                    {isVid && thumbUrl ? (
                      <img src={thumbUrl} alt="Video thumbnail" style={styles.cellImg} />
                    ) : (
                      <img src={imgUrl} alt="Portfolio photo" style={styles.cellImg} />
                    )}
                    {isVid && (
                      <div style={styles.playOverlay}>
                        <MdPlayArrow size={36} color="#fff" />
                      </div>
                    )}
                  </div>
                  {/* Delete */}
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                  >
                    <MdClose size={22} color="#fff" />
                  </button>
                  {/* Select checkbox */}
                  <button
                    style={styles.selectBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isVid) {
                        handleSelectVideo(fullUrl, fullThumbUrl);
                      } else {
                        handleSelectImage(fullUrl);
                      }
                    }}
                  >
                    {isSelected ? (
                      <MdCheckBox size={28} color="#1a6b3a" />
                    ) : (
                      <MdCheckBoxOutlineBlank size={28} color="#fff" />
                    )}
                  </button>
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
          {previewItem.imageURL?.match('mp4') ? (
            <video
              src={normalizeImg(previewItem.imageURL)}
              controls
              autoPlay
              style={styles.previewMedia}
            />
          ) : (
            <img
              src={normalizeImg(previewItem.imageURL)}
              alt="Preview"
              style={styles.previewMedia}
            />
          )}
          <button
            style={styles.previewDeleteBtn}
            onClick={() => { handleDelete(previewItem._id); setPreviewIndex(-1); }}
          >
            Delete
          </button>
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
  infoText: {
    textAlign: 'center',
    color: '#1a6b3a',
    fontWeight: 600,
    fontSize: 14,
    margin: '4px 0 8px',
  },
  tabs: {
    display: 'flex',
  },
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
  selectBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    background: 'none',
    border: 'none',
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
