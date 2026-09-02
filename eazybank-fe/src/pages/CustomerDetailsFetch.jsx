import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {fetchCustomerDetails} from '../services/api';

export default function CustomerDetailsFetch() {
    const auth = useAuth();
    const user = auth.user;

    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);

    const handleFetch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setCustomer(null);

        try {
            const data = await fetchCustomerDetails(user, mobileNumber);
            setCustomer(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>🔍 Fetch Customer Details</h2>
            <p style={{marginBottom: '1.25rem', color: '#666', fontSize: '0.9rem'}}>
                Look up complete customer information including account, cards, and loans by mobile number.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleFetch} style={{marginBottom: '1.5rem'}}>
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
                <div style={{display: 'flex', gap: '0.75rem'}}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Fetching...' : 'Fetch Customer Details'}
                    </button>
                    <Link to="/accounts/fetch" className="btn btn-success">
                        Fetch Account Instead →
                    </Link>
                </div>
            </form>

            {customer && (
                <div>
                    <h3 style={{marginBottom: '1rem', color: '#2e7d32'}}>Customer Details</h3>

                    {/* Personal Info */}
                    <h4 style={{marginBottom: '0.5rem', color: '#555'}}>Personal Information</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="label">Name</span>
                            <div className="value">{customer.name || '—'}</div>
                        </div>
                        <div className="detail-item">
                            <span className="label">Email</span>
                            <div className="value">{customer.email || '—'}</div>
                        </div>
                        <div className="detail-item">
                            <span className="label">Mobile</span>
                            <div className="value">{customer.mobileNumber || '—'}</div>
                        </div>
                    </div>

                    {/* Account Info */}
                    {customer.accountsDto && (
                        <>
                            <h4 style={{margin: '1rem 0 0.5rem', color: '#555'}}>🏦 Account</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Account Number</span>
                                    <div className="value">{customer.accountsDto.accountNumber || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Account Type</span>
                                    <div className="value">{customer.accountsDto.accountType || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Branch Address</span>
                                    <div className="value">{customer.accountsDto.branchAddress || '—'}</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cards Info */}
                    {customer.cardsDto && (
                        <>
                            <h4 style={{margin: '1rem 0 0.5rem', color: '#555'}}>💳 Card</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Card Number</span>
                                    <div className="value">{customer.cardsDto.cardNumber || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Card Type</span>
                                    <div className="value">{customer.cardsDto.cardType || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Total Limit</span>
                                    <div className="value">{customer.cardsDto.totalLimit || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Amount Used</span>
                                    <div className="value">{customer.cardsDto.amountUsed || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Available Amount</span>
                                    <div className="value">{customer.cardsDto.availableAmount || '—'}</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Loans Info */}
                    {customer.loansDto && (
                        <>
                            <h4 style={{margin: '1rem 0 0.5rem', color: '#555'}}>🏠 Loan</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Loan Number</span>
                                    <div className="value">{customer.loansDto.loanNumber || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Loan Type</span>
                                    <div className="value">{customer.loansDto.loanType || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Total Loan</span>
                                    <div className="value">{customer.loansDto.totalLoan || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Amount Paid</span>
                                    <div className="value">{customer.loansDto.amountPaid || '—'}</div>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Outstanding Amount</span>
                                    <div className="value">{customer.loansDto.outstandingAmount || '—'}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}