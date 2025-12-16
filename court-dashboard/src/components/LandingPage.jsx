import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onOpenLogin, onOpenRegister, courtServices }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

return (
  <div className="landing-app">
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo on START (left) */}
        <div className="nav-logo">
          <div className="logo-icon">⚖️</div>
          <div className="logo-text">
            <h1>Harari Court</h1>
            <p>Digital Services Portal</p>
          </div>
        </div>
        
            
        {/* Clock and buttons on END (right) */}
        <div className="nav-right">
          {/* Buttons first */}
          <div className="nav-actions">
            <button className="nav-btn login-btn" onClick={onOpenLogin}>
              <span className="btn-icon">🔐</span>
              Sign In
            </button>
            <button className="nav-btn register-btn" onClick={onOpenRegister}>
              <span className="btn-icon">🚀</span>
              Register 
            </button>
          </div>
          
          {/* Clock last (rightmost) */}
          <div className="nav-clock">
            <div className="clock-icon">🕐</div>
            <div className="clock-content">
              <div className="clock-time">{formatTime(currentTime)}</div>
              <div className="clock-date">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        
      </div>
    </nav>

      {/* Hero Section with Full Image */}
      <section className="hero-section">
        <div className="hero-image-container">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-tag">Trusted & Secure</div>
            <h1 className="hero-title">
              Harari Court
              <span className="hero-title-highlight"> Digital Services </span>
            </h1>
            <p className="hero-description">
              Access court services from anywhere. File cases, track progress, and manage legal matters 
              through our simple, secure online platform.
            </p>
            
            <div className="hero-actions">
              <button className="hero-action-btn primary-btn" onClick={onOpenRegister}>
                Register 
                <span className="btn-arrow"></span>
              </button>
              <button className="hero-action-btn secondary-btn" onClick={onOpenLogin}>
               
                Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;