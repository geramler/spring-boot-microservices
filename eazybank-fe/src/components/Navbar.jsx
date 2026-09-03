import {Link} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

export default function Navbar() {
    const auth = useAuth();

    const handleLogin = () => auth.signinRedirect();
    const handleLogout = () => auth.signoutRedirect();

    if (auth.isLoading) {
        return (
            <nav className="navbar">
                <Link to="/" className="navbar-brand">EazyBank</Link>
                <div className="navbar-links">
                    <span className="navbar-user">Loading...</span>
                </div>
            </nav>
        );
    }

    if (auth.error) {
        return (
            <nav className="navbar">
                <Link to="/" className="navbar-brand">EazyBank</Link>
                <div className="navbar-links">
                    <span className="navbar-user">Auth Error</span>
                    <button onClick={handleLogin}>Retry Login</button>
                </div>
            </nav>
        );
    }

    const isAuthenticated = auth.isAuthenticated;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">EazyBank</Link>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <Link to="/accounts/create">Account</Link>
                        <Link to="/accounts/fetchCustomerDetails">Customer Details</Link>
                        <Link to="/cards/create">Card</Link>
                        <Link to="/loans/create">Loan</Link>
                        <span className="navbar-user">
              {auth.user?.profile?.name || auth.user?.profile?.preferred_username || 'User'}
            </span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : null}
            </div>
        </nav>
    );
}