import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ── Auth Pages (Karthik) ───────────────────────────────────────
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import OtpVerifyPage from './features/auth/pages/OtpVerifyPage';
import GoogleCallbackPage from './features/auth/pages/GoogleCallbackPage';

// ── Chat Page (Maha) ───────────────────────────────────────────
import ChatPage from './features/chat/pages/ChatPage';

// ── Group Page (Jeyanth) ───────────────────────────────────────
import GroupPage from './features/group/pages/GroupPage';

import './App.css';

// ── Protected Route wrapper ────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />

      {/* ── Protected routes ──────────────────────────────────── */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />

      {/* ── Default redirect ──────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}

export default App;
