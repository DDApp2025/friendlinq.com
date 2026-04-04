import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { dotnetApi } from '../api/axios';

const POST_FEEDBACK = '/Feedback/PostFeedback';

function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const store = useSelector((s) => s);
  const token = store.authReducer.login_access_token;

  const sendFeedback = async () => {
    if (!name || !email || !phone || !feedbackMessage) {
      alert('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await dotnetApi.post(POST_FEEDBACK, {
        authorization: token,
        name: name,
        email: email,
        phoneNumber: phone,
        feedback: feedbackMessage,
      });
      if (res.data?.StatusCode === 200) {
        setName('');
        setEmail('');
        setPhone('');
        setFeedbackMessage('');
        setSuccessMsg(res.data.Message || 'Feedback sent successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      console.error('sendFeedback error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Friendlinq Support</h1>

        {successMsg && <div style={styles.successMsg}>{successMsg}</div>}

        {/* FAQ Section */}
        <div style={styles.faqSection}>
          <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQ}>How do I add friends?</h4>
            <p style={styles.faqA}>
              Go to the Add Friend page from the sidebar or navigation bar. Search for users by name and send a friend request.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQ}>How do I create a group?</h4>
            <p style={styles.faqA}>
              Navigate to the Groups page and click "Create Group". Enter a group name and description to get started.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQ}>How do I change my profile picture?</h4>
            <p style={styles.faqA}>
              Go to your Profile page and click the camera icon on your profile photo to upload a new picture.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQ}>How do I manage my subscription?</h4>
            <p style={styles.faqA}>
              Visit Settings &gt; Plans to view and manage your current subscription plan.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQ}>How do I delete my account?</h4>
            <p style={styles.faqA}>
              Go to Settings and click "Delete Account". This will suspend your account and log you out.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <h2 style={{ ...styles.faqTitle, marginTop: 32 }}>Contact Us</h2>

        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <textarea
            placeholder="Message"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            style={styles.textarea}
            rows={4}
          />
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            style={styles.sendBtn}
            onClick={sendFeedback}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 16,
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#1a6b3a',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 16px',
  },
  successMsg: {
    backgroundColor: '#e8f5e9',
    color: '#1a6b3a',
    padding: '10px 16px',
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    width: '80%',
  },
  faqSection: {
    width: '90%',
    marginBottom: 16,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 12,
    padding: '10px 12px',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeft: '3px solid #1a6b3a',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 4px',
  },
  faqA: {
    fontSize: 13,
    color: '#666',
    margin: 0,
    lineHeight: 1.4,
  },
  inputGroup: {
    width: '80%',
    marginTop: 16,
  },
  input: {
    width: '100%',
    height: 40,
    fontSize: 16,
    color: '#333',
    borderColor: '#999',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingLeft: 14,
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    fontSize: 16,
    color: '#333',
    borderColor: '#999',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingLeft: 14,
    paddingTop: 10,
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
  },
  buttonRow: {
    display: 'flex',
    gap: 15,
    marginTop: 32,
  },
  cancelBtn: {
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    padding: '14px 35px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  sendBtn: {
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    padding: '14px 40px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Support;
