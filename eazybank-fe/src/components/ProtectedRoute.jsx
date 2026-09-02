import { useAuth } from 'react-oidc-context';

/**
 * Wraps children so they are only rendered when the user is authenticated
 * AND possesses the required Keycloak realm role.
 *
 * The gateway maps Keycloak realm roles ("ACCOUNTS", "CARDS", "LOANS")
 * to Spring Security roles ("ROLE_ACCOUNTS", etc.) via KeycloakRoleConverter.
 *
 * In the JWT, roles live under: realm_access.roles[ ]
 *
 * @param {{ role: string, children: React.ReactNode }} props
 */
export default function ProtectedRoute({ role, children }) {
  const auth = useAuth();

  // ── Still loading OIDC ───────────────────────────────
  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  // ── Not authenticated ────────────────────────────────
  if (!auth.isAuthenticated) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p style={{ marginBottom: '1.5rem', color: '#555' }}>
          You need to sign in to access this page.
        </p>
        <button className="btn btn-primary" onClick={() => auth.signinRedirect()}>
          Login with Keycloak
        </button>
      </div>
    );
  }

  // ── Check role (from realm_access.roles in JWT) ─────
  const roles = auth.user?.profile?.realm_access?.roles || [];

  if (!roles.includes(role)) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: '#c62828', marginBottom: '1rem' }}>
          You do not have the required <strong>{role}</strong> role to access this page.
        </p>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Your roles: {roles.length > 0 ? roles.join(', ') : 'none'}
        </p>
      </div>
    );
  }

  return children;
}