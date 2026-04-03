import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { dotnetApi } from '../api/axios';
import normalizeImg from '../utils/normalizeImg';
import { MdSearch, MdStorefront } from 'react-icons/md';

export default function Marketplace() {
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.login_access_token);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.get('/Client/Post/GetMarketplace', {
        params: { authorization: token },
      });
      if (res.data?.StatusCode === 200) {
        setItems(res.data.Data || []);
      } else {
        // Try without /Client prefix
        const res2 = await dotnetApi.get('/Post/GetMarketplace', {
          params: { authorization: token },
        });
        if (res2.data?.StatusCode === 200) {
          setItems(res2.data.Data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch marketplace', err);
      // Try alternate path on error
      try {
        const res2 = await dotnetApi.get('/Post/GetMarketplace', {
          params: { authorization: token },
        });
        if (res2.data?.StatusCode === 200) {
          setItems(res2.data.Data || []);
        }
      } catch (err2) {
        console.error('Marketplace fallback also failed', err2);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = searchText
    ? items.filter((item) =>
        (item.ad_title || '').toLowerCase().includes(searchText.toLowerCase())
      )
    : items;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Marketplace</h2>
          <div style={styles.searchWrap}>
            <MdSearch size={20} color="#999" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Items */}
        {loading ? (
          <div style={styles.loadingText}>Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <MdStorefront size={48} color="#ccc" />
            <p>No items found.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredItems.map((item, index) => {
              const imgSrc = item.ad_img && item.ad_img.length > 0
                ? (item.ad_img[1] || item.ad_img[0])
                : '';
              return (
                <div
                  key={item._id || index}
                  style={styles.itemCard}
                  onClick={() => navigate('/marketplace/' + (item._id || index), { state: { item } })}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.ad_title || 'Item'}
                      style={styles.itemImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={styles.itemImgPlaceholder}>
                      <MdStorefront size={40} color="#ccc" />
                    </div>
                  )}
                  <div style={styles.itemInfo}>
                    {item.ad_title && (
                      <p style={styles.itemTitle}>{item.ad_title}</p>
                    )}
                    {item.amount && (
                      <p style={styles.itemPrice}>{item.amount}</p>
                    )}
                  </div>
                </div>
              );
            })}
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
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  title: {
    margin: '0 0 10px',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a6b3a',
    textAlign: 'center',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: '8px 14px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
    fontSize: 15,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    padding: 12,
  },
  itemCard: {
    cursor: 'pointer',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #eee',
    transition: 'box-shadow 0.2s',
  },
  itemImg: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    display: 'block',
  },
  itemImgPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    padding: '8px 10px',
  },
  itemTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemPrice: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#666',
  },
};
