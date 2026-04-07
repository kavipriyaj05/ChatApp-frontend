import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from './features/chat/pages/ChatPage';

/**
 * App.jsx — Route declarations for LiveChat.
 *
 * Shared file — each module adds their own routes here.
 * Module 2 (Maha) owns: /chat, /chat/:chatId
 *
 * Placeholders for other modules:
 *   /login, /register, /verify-otp  → Karthik (Module 1)
 *   /groups, /groups/:groupId        → Jeyanth (Module 3)
 *   /notifications                   → Kavi (Module 4)
 */

// Simple auth guard — checks for token in localStorage.
// Will be replaced by Karthik's ProtectedRoute when Module 1 is integrated.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Placeholder login page until Karthik's LoginPage is merged
const LoginPlaceholder = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh',
    background: '#0f1117', color: '#e8eaf0', gap: '16px'
  }}>
    <h1 style={{ fontSize: '2rem' }}>💬 LiveChat</h1>
    <p style={{ color: '#8b93a8' }}>Authentication module (Karthik) not yet integrated.</p>
    <button
      style={{
        padding: '10px 28px', background: '#4f46e5', border: 'none',
        borderRadius: '24px', color: '#fff', cursor: 'pointer', fontSize: '15px'
      }}
      onClick={() => {
        // DEMO: set mock token so chat page is accessible
        localStorage.setItem('token', 'mock-dev-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'maha' }));
        window.location.href = '/chat';
      }}
    >
      Enter Demo Mode
    </button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth Routes — owned by Karthik ── */}
        <Route path="/login" element={<LoginPlaceholder />} />
        <Route path="/register" element={<LoginPlaceholder />} />

        {/* ── Chat Routes — owned by Maha ── */}
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

        {/* ── Default redirect ── */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
