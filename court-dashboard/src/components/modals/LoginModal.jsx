import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onClose, onSubmit, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData.email);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <div className="login-modal-logo">
            <div className="login-court-icon">⚖️</div>
            <div className="login-logo-text">
              <span>Harari Court</span>
              <span>Services Portal</span>
            </div>
          </div>
          <button className="login-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="login-modal-body">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to access court services</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="Enter your registered email" 
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
                placeholder="Enter your password" 
              />
              <div className="password-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button type="button" className="forgot-password">
                  Forgot Password?
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <div className="alternative-login">
            <button className="alt-login-btn">
              <span className="alt-icon">📱</span>
              Sign in with OTP
            </button>
          </div>
          
          <p className="register-link">
            Don't have an account? 
            <button type="button" onClick={onSwitchToRegister}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;