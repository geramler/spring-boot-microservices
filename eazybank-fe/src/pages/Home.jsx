import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function Home() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  const isAuthenticated = auth.isAuthenticated;
  const roles = auth.user?.profile?.realm_access?.roles || [];
  const userName = auth.user?.profile?.name || auth.user?.profile?.preferred_username || 'Customer';

  return (
    <div>
      <div className="home-hero">
        <h1>Welcome to EazyBank</h1>
        <p>
          Your one-stop banking solution. Manage accounts, cards, and loans
          securely through our unified platform.
        </p>
        {!isAuthenticated && (
          <button className="btn btn-primary" onClick={() => auth.signinRedirect()}>
            Sign In to Get Started
          </button>
        )}
      </div>

      {isAuthenticated && (
        <>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Hello, <strong>{userName}</strong> — what would you like to do?
          </p>

          <div className="home-grid">
            {/* Accounts */}
            {roles.includes('ACCOUNTS') && (
              <div className="home-card">
                <h3>🏦 Accounts</h3>
                <p>Create or view your bank account details.</p>
                <Link to="/accounts/create" className="btn btn-primary">Create Account</Link>
                <Link to="/accounts/fetch" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Fetch Account</Link>
              </div>
            )}

            {/* Cards */}
            {roles.includes('CARDS') && (
              <div className="home-card">
                <h3>💳 Cards</h3>
                <p>Apply for a new card or check existing card details.</p>
                <Link to="/cards/create" className="btn btn-primary">Create Card</Link>
                <Link to="/cards/fetch" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Fetch Card</Link>
              </div>
            )}

            {/* Loans */}
            {roles.includes('LOANS') && (
              <div className="home-card">
                <h3>💰 Loans</h3>
                <p>Apply for a loan or view your loan information.</p>
                <Link to="/loans/create" className="btn btn-primary">Create Loan</Link>
                <Link to="/loans/fetch" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Fetch Loan</Link>
              </div>
            )}

            {roles.length === 0 && (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                <p style={{ color: '#c62828' }}>
                  You are authenticated but have no EazyBank roles assigned.
                  Please contact an administrator to assign roles (ACCOUNTS, CARDS, LOANS) in Keycloak.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}