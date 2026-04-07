import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser, clearError, clearMessage } from '../authSlice';
import authApi from '../authApi';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, isVerified, message: authMessage } = useSelector(
    (state) => state.auth
  );

  const locationMessage = location.state?.message;
  const locationError = location.state?.error;

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigate('/chat');
    }
    if (isVerified === false) {
      navigate('/verify-otp', { state: { email: formData.email, purpose: 'REGISTRATION' } });
    }
  }, [isAuthenticated, isVerified, navigate, formData.email]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleGoogleLogin = () => {
    authApi.googleLogin();
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {locationMessage && <div className="auth-success">{locationMessage}</div>}
      {locationError && <div className="auth-error">{locationError}</div>}
      {error && <div className="auth-error">{error}</div>}
      {authMessage && <div className="auth-info">{authMessage}</div>}

      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="form-actions-row">
        <Link to="/forgot-password" className="forgot-link" id="forgot-password-link">
          Forgot Password?
        </Link>
      </div>

      <button type="submit" className="auth-btn primary-btn" disabled={loading} id="login-btn">
        {loading ? <span className="btn-spinner"></span> : 'Sign In'}
      </button>

      <div className="divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="auth-btn google-btn"
        onClick={handleGoogleLogin}
        id="google-login-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className="auth-switch">
        Don't have an account? <Link to="/register" id="register-link">Sign Up</Link>
      </p>
    </form>
  );
};

export default LoginForm;
