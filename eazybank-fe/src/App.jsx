import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AccountCreate from './pages/AccountCreate';
import AccountFetch from './pages/AccountFetch';
import CardCreate from './pages/CardCreate';
import CardFetch from './pages/CardFetch';
import LoanCreate from './pages/LoanCreate';
import LoanFetch from './pages/LoanFetch';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Accounts */}
          <Route
            path="/accounts/create"
            element={
              <ProtectedRoute role="ACCOUNTS">
                <AccountCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/fetch"
            element={
              <ProtectedRoute role="ACCOUNTS">
                <AccountFetch />
              </ProtectedRoute>
            }
          />

          {/* Cards */}
          <Route
            path="/cards/create"
            element={
              <ProtectedRoute role="CARDS">
                <CardCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards/fetch"
            element={
              <ProtectedRoute role="CARDS">
                <CardFetch />
              </ProtectedRoute>
            }
          />

          {/* Loans */}
          <Route
            path="/loans/create"
            element={
              <ProtectedRoute role="LOANS">
                <LoanCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans/fetch"
            element={
              <ProtectedRoute role="LOANS">
                <LoanFetch />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}