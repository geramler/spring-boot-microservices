import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { createLoan } from '../services/api';

export default function LoanCreate() {
  const auth = useAuth();
  const user = auth.user;

  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await createLoan(user, mobileNumber);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>💰 Create Loan</h2>
      <p style={{ marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Apply for a new loan for an existing customer account. The customer must already have an account
        registered with the provided mobile number.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="alert alert-success">
          ✅ Loan created successfully! Status: {result.statusCode} — {result.statusMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="10-digit mobile of the account holder"
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Loan'}
          </button>
          <Link to="/loans/fetch" className="btn btn-success">
            Fetch Loan Instead →
          </Link>
        </div>
      </form>
    </div>
  );
}