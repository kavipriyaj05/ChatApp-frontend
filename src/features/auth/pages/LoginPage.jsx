import React from 'react';
import LoginForm from '../components/LoginForm';
import './AuthPages.css';

const LoginPage = () => {
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
            <div className="auth-logo">💬</div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to LiveChat</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
