import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { fetchLoan, deleteLoan } from '../services/api';

export default function LoanFetch() {
  const auth = useAuth();
  const user = auth.user;

  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoan(null);

    try {
      const data = await fetchLoan(user, mobileNumber);
      setLoan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this loan?')) return;
    setLoading(true);
    setError(null);
    try {
      const data = await deleteLoan(user, mobileNumber);
      setLoan(null);
      alert(`Deleted: ${data.statusMsg}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔍 Fetch Loan Details</h2>
      <p style={{ marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Look up loan details associated with a mobile number.
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
            {loading ? 'Fetching...' : 'Fetch Loan'}
          </button>
          <Link to="/loans/create" className="btn btn-success">
            Create Loan Instead →
          </Link>
        </div>
      </form>

      {loan && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#2e7d32' }}>Loan Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Mobile Number</span>
              <div className="value">{loan.mobileNumber || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Loan Number</span>
              <div className="value">{loan.loanNumber || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Loan Type</span>
              <div className="value">{loan.loanType || '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Total Loan</span>
              <div className="value">{loan.totalLoan ?? '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid</span>
              <div className="value">{loan.amountPaid ?? '—'}</div>
            </div>
            <div className="detail-item">
              <span className="label">Outstanding</span>
              <div className="value">{loan.outstandingAmount ?? '—'}</div>
            </div>
          </div>
          <button className="btn btn-danger" style={{ marginTop: '1rem' }} onClick={handleDelete}>
            Delete Loan
          </button>
        </div>
      )}
    </div>
  );
}