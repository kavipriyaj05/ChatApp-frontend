import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError, clearMessage } from '../authSlice';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, otpSent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (otpSent) {
      navigate('/verify-otp', { state: { email: formData.email, purpose: 'REGISTRATION' } });
    }
  }, [otpSent, navigate, formData.email]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    dispatch(registerUser(submitData));
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      {localError && <div className="auth-error">{localError}</div>}

      <div className="form-group">
        <label htmlFor="register-username">Username</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            id="register-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            minLength={3}
            maxLength={50}
            autoComplete="username"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            id="register-email"
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
        <label htmlFor="register-phone">Phone <span className="optional">(optional)</span></label>
        <div className="input-wrapper">
          <span className="input-icon">📱</span>
          <input
            type="tel"
            id="register-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            minLength={8}
            autoComplete="new-password"
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
        {formData.password && <PasswordStrengthMeter password={formData.password} />}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <button type="submit" className="auth-btn primary-btn" disabled={loading} id="register-btn">
        {loading ? <span className="btn-spinner"></span> : 'Create Account'}
      </button>

      <p className="auth-switch">
        Already have an account? <Link to="/login" id="login-link">Sign In</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
