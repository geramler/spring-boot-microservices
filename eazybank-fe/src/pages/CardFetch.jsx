import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { fetchCard, deleteCard } from '../services/api';

export default function CardFetch() {
  const auth = useAuth();
  const user = auth.user;

  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCard(null);

    try {
      const data = await fetchCard(user, mobileNumber);
      setCard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    setLoading(true);
    setError(null);
    try {
      const data = await deleteCard(user, mobileNumber);
      setCard(null);
      alert(`Deleted: ${data.statusMsg}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔍 Fetch Card Details</h2>
      <p style={{ marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Look up card details associated with a mobile number.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleFetch} style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="10-digit mobile number"
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Card'}
          </button>
          <Link to="/cards/create" className="btn btn-success">
            Create Card Instead →
          </Link>
        </div>
      </form>

      {card && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#2e7d32' }}>Card Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Mobile Number</span>
              <div className="value">{card.mobileNumber || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Card Number</span>
              <div className="value">{card.cardNumber || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Card Type</span>
              <div className="value">{card.cardType || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Total Limit</span>
              <div className="value">{card.totalLimit ?? '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Amount Used</span>
              <div className="value">{card.amountUsed ?? '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Available Amount</span>
              <div className="value">{card.availableAmount ?? '—'}</div>
            </div>
          </div>
          <button className="btn btn-danger" style={{ marginTop: '1rem' }} onClick={handleDelete}>
            Delete Card
          </button>
        </div>
      )}
    </div>
  );
}