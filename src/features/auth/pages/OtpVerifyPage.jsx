import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp, clearError, clearMessage } from '../authSlice';
import './AuthPages.css';

const OtpVerifyPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, message, isVerified } = useSelector((state) => state.auth);
  const email = location.state?.email || '';
  const purpose = location.state?.purpose || 'REGISTRATION';

  useEffect(() => {
    if (isVerified === true) {
      navigate('/login', { state: { message: 'Email verified! Please login.' } });
    }
  }, [isVerified, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const otpString = newOtp.join('');
      if (otpString.length === 6) {
        dispatch(verifyOtp({ email, otp: otpString, purpose }));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    if (pasteData.length === 6) {
      dispatch(verifyOtp({ email, otp: pasteData, purpose }));
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    dispatch(resendOtp({ email, purpose }));
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      dispatch(verifyOtp({ email, otp: otpString, purpose }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-logo">🔐</div>
            <h1>Verify Email</h1>
            <p>Enter the 6-digit code sent to</p>
            <p className="otp-email-display">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`otp-input ${digit ? 'filled' : ''}`}
                  id={`otp-input-${index}`}
                />
              ))}
            </div>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <button
              type="submit"
              className="auth-btn primary-btn"
              disabled={loading || otp.join('').length !== 6}
              id="verify-otp-btn"
            >
              {loading ? <span className="btn-spinner"></span> : 'Verify OTP'}
            </button>

            <div className="resend-section">
              {canResend ? (
                <button type="button" onClick={handleResend} className="resend-btn" id="resend-otp-btn">
                  Resend OTP
                </button>
              ) : (
                <p className="resend-timer">Resend OTP in <strong>{countdown}s</strong></p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
