import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages (Karthik's module)
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import OtpVerifyPage from './features/auth/pages/OtpVerifyPage';
import GoogleCallbackPage from './features/auth/pages/GoogleCallbackPage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Placeholder for chat page (Maha/Jeyanth will build this)
const ChatPlaceholder = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a1a',
    color: '#f0f0ff',
    fontFamily: "'Inter', sans-serif",
    gap: '16px',
  }}>
    <div style={{ fontSize: '64px' }}>💬</div>
    <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>LiveChat</h1>
    <p style={{ color: '#8888aa', fontSize: '16px' }}>
      Welcome! Chat module is being built by your teammates.
    </p>
    <button
      onClick={() => {
        localStorage.clear();
        window.location.href = '/login';
      }}
      style={{
        marginTop: '16px',
        padding: '12px 32px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        theme="dark"
        toastStyle={{
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
        }}
      />
      <Routes>
        {/* Auth Routes (Public) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        {/* Protected Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPlaceholder />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
