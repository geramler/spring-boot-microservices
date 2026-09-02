import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { fetchAccount, deleteAccount } from '../services/api';

export default function AccountFetch() {
  const auth = useAuth();
  const user = auth.user;

  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAccount(null);

    try {
      const data = await fetchAccount(user, mobileNumber);
      setAccount(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    setLoading(true);
    setError(null);
    try {
      const data = await deleteAccount(user, mobileNumber);
      setAccount(null);
      setError(null);
      alert(`Deleted: ${data.statusMsg}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔍 Fetch Account Details</h2>
      <p style={{ marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Look up your customer and account details by mobile number.
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
            {loading ? 'Fetching...' : 'Fetch Account'}
          </button>
          <Link to="/accounts/create" className="btn btn-success">
            Create Account Instead →
          </Link>
        </div>
      </form>

      {account && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#2e7d32' }}>Account Details</h3>

          {/* Customer Info */}
          <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>Customer</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Name</span>
              <div className="value">{account.name || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Email</span>
              <div className="value">{account.email || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Mobile</span>
              <div className="value">{account.mobileNumber || '—'}</div>
            </div>
          </div>

          {/* Account Info */}
          {account.accountsDto && (
            <>
              <h4 style={{ margin: '1rem 0 0.5rem', color: '#555' }}>Account</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Account Number</span>
                  <div className="value">{account.accountsDto.accountNumber || '—'}</div>
                </div>
                <div className="detail-item">
                  <span className="label">Account Type</span>
                  <div className="value">{account.accountsDto.accountType || '—'}</div>
                </div>
                <div className="detail-item">
                  <span className="label">Branch Address</span>
                  <div className="value">{account.accountsDto.branchAddress || '—'}</div>
                </div>
              </div>
            </>
          )}

          <button className="btn btn-danger" style={{ marginTop: '1rem' }} onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}