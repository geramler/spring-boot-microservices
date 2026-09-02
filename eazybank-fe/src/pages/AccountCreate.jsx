import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { createAccount } from '../services/api';

export default function AccountCreate() {
  const auth = useAuth();
  const user = auth.user;

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    accountType: 'Savings',
    branchAddress: '123 Main Street',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await createAccount(user, form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🏦 Create Account</h2>
      <p style={{ marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Creates a new customer and bank account in EazyBank.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="alert alert-success">
          ✅ Account created successfully! Status: {result.statusCode} — {result.statusMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="E.g. John Doe"
            required
            minLength={5}
            maxLength={30}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E.g. john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="10-digit mobile"
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <select name="accountType" value={form.accountType} onChange={handleChange}>
            <option>Savings</option>
            <option>Checking</option>
            <option>Fixed Deposit</option>
          </select>
        </div>

        <div className="form-group">
          <label>Branch Address</label>
          <input
            type="text"
            name="branchAddress"
            value={form.branchAddress}
            onChange={handleChange}
            placeholder="Branch address"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <Link to="/accounts/fetch" className="btn btn-success">
            Fetch Account Instead →
          </Link>
        </div>
      </form>
    </div>
  );
}