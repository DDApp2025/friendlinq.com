import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import normalizeImg from '../utils/normalizeImg';
import { MdArrowBack, MdEmail, MdPhone, MdLanguage, MdBusiness, MdClose } from 'react-icons/md';
import { AiOutlinePlayCircle } from 'react-icons/ai';

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!item) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.emptyText}>Item not found.</p>
          <button style={styles.backLink} onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const videoThumbUrl = item.videoThumbnailUrl?.original
    ? normalizeImg(item.videoThumbnailUrl.original)
    : '';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={styles.title}>Details</h2>
        </div>

        {/* Video */}
        {item.ad_video && !videoPlaying && (
          <div style={styles.videoThumbWrap} onClick={() => setVideoPlaying(true)}>
            {videoThumbUrl ? (
              <img src={videoThumbUrl} alt="Video thumbnail" style={styles.videoThumb} />
            ) : (
              <div style={styles.videoThumbPlaceholder} />
            )}
            <div style={styles.playIcon}>
              <AiOutlinePlayCircle size={48} color="#fff" />
            </div>
          </div>
        )}

        {item.ad_video && videoPlaying && (
          <div style={styles.videoWrap}>
            <video
              src={item.ad_video}
              controls
              autoPlay
              style={styles.video}
            />
            <button style={styles.closeVideoBtn} onClick={() => setVideoPlaying(false)}>
              <MdClose size={24} color="#fff" />
            </button>
          </div>
        )}

        {/* Image carousel */}
        {!item.ad_video && item.ad_img && item.ad_img.length > 0 && (
          <div>
            <div style={styles.carouselWrap}>
              <img
                src={item.ad_img[activeImgIndex]}
                alt="Item"
                style={styles.carouselImg}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            {item.ad_img.length > 1 && (
              <div style={styles.dots}>
                {item.ad_img.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    style={{
                      ...styles.dot,
                      backgroundColor: i === activeImgIndex ? '#333' : '#ccc',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Item info */}
        <div style={styles.infoSection}>
          {item.ad_title && (
            <h3 style={styles.itemTitle}>{item.ad_title}</h3>
          )}
          {item.amount && (
            <p style={styles.itemAmount}>Amount: {item.amount}</p>
          )}
        </div>

        {/* Seller info */}
        {(item.ad_email || item.ad_contact) && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Seller Information</h4>
            {item.ad_email && (
              <div style={styles.infoRow}>
                <MdEmail size={18} color="#666" />
                <span style={styles.infoText}>Email: {item.ad_email}</span>
              </div>
            )}
            {item.ad_contact && (
              <div style={styles.infoRow}>
                <MdPhone size={18} color="#666" />
                <span style={styles.infoText}>Contact: {item.ad_contact}</span>
              </div>
            )}
          </div>
        )}

        {/* Other info */}
        {(item.ad_web_url || item.ad_company) && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Other Information</h4>
            {item.ad_web_url && (
              <div style={styles.infoRow}>
                <MdLanguage size={18} color="#666" />
                <span style={styles.infoText}>Website: {item.ad_web_url}</span>
              </div>
            )}
            {item.ad_company && (
              <div style={styles.infoRow}>
                <MdBusiness size={18} color="#666" />
                <span style={styles.infoText}>Company: {item.ad_company}</span>
              </div>
            )}
          </div>
        )}
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
    maxWidth: 700,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    paddingBottom: 20,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
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
    color: '#1a6b3a',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a6b3a',
  },
  emptyText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    color: '#1a6b3a',
    background: 'none',
    border: 'none',
    fontSize: 15,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  videoThumbWrap: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    cursor: 'pointer',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  videoThumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  videoWrap: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    maxHeight: 400,
  },
  closeVideoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  carouselWrap: {
    width: '100%',
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  carouselImg: {
    maxWidth: '100%',
    maxHeight: 300,
    objectFit: 'contain',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 0',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  infoSection: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  itemTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemAmount: {
    margin: '4px 0 0',
    fontSize: 15,
    color: '#555',
  },
  section: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
  },
};
