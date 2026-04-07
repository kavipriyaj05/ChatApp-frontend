import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOAuth2Tokens } from '../authSlice';
import './AuthPages.css';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login', { state: { error: 'Google authentication failed. Please try again.' } });
      return;
    }

    if (token) {
      dispatch(setOAuth2Tokens({ token, refreshToken, username, email }));
      navigate('/chat');
    } else {
      navigate('/login', { state: { error: 'Authentication failed. No token received.' } });
    }
  }, [searchParams, navigate, dispatch]);

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
            <div className="callback-spinner"></div>
            <h1>Authenticating...</h1>
            <p>Please wait while we complete your sign-in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
