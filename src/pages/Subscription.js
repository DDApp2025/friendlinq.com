import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { dotnetApi } from '../api/axios';
import { IS_USER_HAVE_PLAN } from '../actions/actions_types';
import { MdArrowBack, MdCheckCircle, MdCheck } from 'react-icons/md';

const STRIPE_PK = 'pk_live_51OeCKVBOfCO7ilUowmFYObsnX52EkteSKbVLUWMFjgJ8wvo6ms40V6g0nScFJGHthYO55j1GDPl34h9OfBFLJZzs00BUHY3Xyo';

function CheckoutForm({ selectedPlan, email, onSuccess, onCancel, stripeReady }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((s) => s.authReducer.login_access_token);
  const cardRef = React.useRef(null);
  const stripeRef = React.useRef(null);

  useEffect(() => {
    if (!stripeReady) return;
    let mounted = true;
    (async () => {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(STRIPE_PK);
        if (!mounted || !stripe) return;
        stripeRef.current = stripe;
        const elements = stripe.elements();
        const card = elements.create('card', {
          style: {
            base: { fontSize: '16px', color: '#333', '::placeholder': { color: '#aab7c4' } },
            invalid: { color: '#e74c3c' },
          },
        });
        card.mount('#stripe-card-element');
        cardRef.current = card;
      } catch (err) {
        console.error('Stripe init failed', err);
        if (mounted) setError('Failed to load payment form. Please try again.');
      }
    })();
    return () => { mounted = false; };
  }, [stripeReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stripe = stripeRef.current;
    const card = cardRef.current;
    if (!stripe || !card) return;

    setProcessing(true);
    setError('');

    try {
      const { token: stripeToken, error: stripeError } = await stripe.createToken(card);

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      const order = {
        authorization: token,
        packageId: selectedPlan.id,
        charges: parseFloat(selectedPlan.price),
        stripeToken: stripeToken.id,
        stripeEmail: email,
      };

      const res = await dotnetApi.post('/ProcessPayment', order);
      if (res.data?.StatusCode === 200) {
        onSuccess(res.data?.Data?.Message || 'Payment successful!');
      } else {
        const msg = res.data?.Message;
        if (msg === 'Forbidden') {
          setError('Unfortunately, your payment did not go through. Please verify your card information or try using a different payment method.');
        } else {
          setError(msg || 'Payment failed');
        }
      }
    } catch (err) {
      setError('Payment processing error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.checkoutForm}>
      <h3 style={styles.checkoutTitle}>Enter Card Details</h3>
      <p style={styles.checkoutPlan}>
        {selectedPlan.label} - ${selectedPlan.price}
      </p>
      <div style={styles.cardElementWrapper}>
        <div id="stripe-card-element" />
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
      <div style={styles.checkoutButtons}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelBtn}
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={styles.payBtn}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

export default function Subscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.authReducer.login_access_token);
  const email = useSelector((s) => s.authReducer.email);
  const isBack = location.state?.isBack ?? true;

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchActivePlan();
    fetchBalance();
  }, []);

  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, [plans]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await dotnetApi.post('/Plan/GetPlans', {});
      if (res.data?.StatusCode === 200) {
        const mapped = (res.data?.data || []).map((e) => ({
          label: e?.Name,
          value: e?.Name,
          price: e?.Price,
          description: e?.Description,
          id: e?._id,
          planType: e?.Plantype,
        }));
        setPlans(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch plans', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePlan = async () => {
    try {
      const res = await dotnetApi.post('/Customer/GetActivePlan', {
        authorization: token,
      });
      if (res.data?.StatusCode === 200) {
        setActivePlan(res.data.Data);
        dispatch({ type: IS_USER_HAVE_PLAN, havePlan: res.data.Data });
      }
    } catch (err) {
      console.error('Failed to fetch active plan', err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await dotnetApi.post('/GetBalance', {
        authorization: token,
      });
      if (res.data?.StatusCode === 200) {
        setBalance(res.data.Data);
      }
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  };

  const handlePaymentSuccess = (message) => {
    setShowCheckout(false);
    fetchActivePlan();
    alert(message);
  };

  const features = [
    'Download, Copy & Share any post image or video.',
    'Unlimited live Video Calls between Android & iPhone.',
    'Customize your profile with: Banners, Top-Friends, Videos & Photos.',
    'Unlimited chats, group calls and Friendlinqs.',
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      {isBack && (
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <MdArrowBack size={24} />
          </button>
          <h2 style={styles.headerTitle}>Plans</h2>
        </div>
      )}

      <div style={styles.scrollContent}>
        {loading && <div style={styles.loader}>Loading plans...</div>}

        {/* Active Plan Info */}
        {activePlan && (
          <div style={styles.activePlanCard}>
            <MdCheckCircle size={22} color="#1a6b3a" />
            <div style={{ marginLeft: 12 }}>
              <p style={styles.activePlanLabel}>Active Plan</p>
              <p style={styles.activePlanName}>
                {activePlan.PlanName || activePlan.Name || 'Subscribed'}
              </p>
            </div>
          </div>
        )}

        {/* Balance */}
        {balance !== null && (
          <div style={styles.balanceCard}>
            <p style={styles.balanceLabel}>Wallet Balance</p>
            <p style={styles.balanceValue}>${typeof balance === 'object' ? balance.Balance || 0 : balance}</p>
          </div>
        )}

        <h3 style={styles.sectionTitle}>Flirting/Dating Social Media Plan</h3>
        <p style={styles.subtitle}>The most popular Friendlinq plan</p>

        {/* Plan Selection */}
        <div style={styles.planRadioGroup}>
          {plans.map((plan) => (
            <label key={plan.id} style={styles.planRadio}>
              <input
                type="radio"
                name="plan"
                checked={selectedPlan?.id === plan.id}
                onChange={() => setSelectedPlan(plan)}
                style={styles.radioInput}
              />
              <span style={styles.radioLabel}>{plan.label}</span>
            </label>
          ))}
        </div>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <div style={styles.planCard}>
            <div style={styles.planCardBody}>
              <p style={styles.planDescription}>{selectedPlan.description}</p>
            </div>
            <div style={styles.planCardFooter}>
              <MdCheckCircle size={20} color="#1a6b3a" />
              <span style={styles.freeTrialText}>Free trial</span>
            </div>
          </div>
        )}

        {/* Features */}
        <h4 style={styles.featuresTitle}>Main Features</h4>
        {features.map((item, idx) => (
          <div key={idx} style={styles.featureRow}>
            <MdCheck size={20} color="#1a6b3a" />
            <span style={styles.featureText}>{item}</span>
          </div>
        ))}

        {/* Purchase Button */}
        {!showCheckout && (
          <button
            onClick={() => {
              if (!selectedPlan) return;
              setShowCheckout(true);
            }}
            style={styles.purchaseBtn}
            disabled={!selectedPlan}
          >
            Complete Purchase
          </button>
        )}

        {/* Stripe Checkout */}
        {showCheckout && selectedPlan && (
          <div style={styles.checkoutOverlay}>
            <CheckoutForm
              selectedPlan={selectedPlan}
              email={email}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowCheckout(false)}
              stripeReady={showCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #1a6b3a',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1a6b3a',
    padding: 4,
  },
  headerTitle: {
    color: '#1a6b3a',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 0,
  },
  scrollContent: {
    padding: '20px 20px 40px',
  },
  loader: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },
  activePlanCard: {
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 16,
  },
  activePlanLabel: {
    fontSize: 12,
    color: '#666',
    margin: 0,
  },
  activePlanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a6b3a',
    margin: 0,
  },
  balanceCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    margin: '0 0 20px',
  },
  planRadioGroup: {
    display: 'flex',
    gap: 20,
    marginBottom: 20,
  },
  planRadio: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 15,
  },
  radioInput: {
    marginRight: 8,
    accentColor: '#000',
  },
  radioLabel: {
    color: '#555',
  },
  planCard: {
    borderRadius: 5,
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  planCardBody: {
    padding: 20,
  },
  planDescription: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1a6b3a',
    margin: 0,
  },
  planCardFooter: {
    padding: '12px 20px',
    backgroundColor: 'rgba(26,107,58,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  freeTrialText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1a6b3a',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    margin: '0 0 12px',
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '5px 0',
  },
  featureText: {
    fontSize: 15,
    color: '#777',
  },
  purchaseBtn: {
    display: 'block',
    width: '80%',
    margin: '30px auto 0',
    padding: '14px 0',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 40,
    cursor: 'pointer',
    textAlign: 'center',
  },
  checkoutOverlay: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    border: '1px solid #ddd',
  },
  checkoutForm: {},
  checkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    margin: '0 0 8px',
  },
  checkoutPlan: {
    fontSize: 14,
    color: '#666',
    margin: '0 0 16px',
  },
  cardElementWrapper: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    margin: '0 0 12px',
  },
  checkoutButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 15,
  },
  payBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: '600',
  },
};
