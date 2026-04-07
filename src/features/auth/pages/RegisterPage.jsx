import React from 'react';
import RegisterForm from '../components/RegisterForm';
import './AuthPages.css';

const RegisterPage = () => {
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
            <h1>Create Account</h1>
            <p>Join LiveChat and start messaging</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
