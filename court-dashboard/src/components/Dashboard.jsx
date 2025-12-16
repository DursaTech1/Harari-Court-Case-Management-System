import React, { useState, useEffect } from 'react';
import ServicesSidebar from './sections/ServicesSidebar';
import ServiceDetails from './sections/ServiceDetails';
import MyCasesSection from './sections/MyCasesSection';
import NotificationsSection from './sections/NotificationsSection';
import './Dashboard.css';

const Dashboard = ({ userData, onLogout, courtServices, userCases, notifications }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleServiceAction = (action) => {
    alert(`Starting ${action} process... Please follow the instructions.`);
  };

  const quickStats = {
    activeCases: 2,
    pendingPayments: 1,
    upcomingHearings: 2,
    unreadMessages: 1
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="dashboard-app">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-logo">
            <div className="dashboard-court-icon">⚖️</div>
            <div className="dashboard-logo-text">
              <span className="dashboard-logo-main">Harari Court</span>
              <span className="dashboard-logo-sub">Services Portal</span>
            </div>
          </div>
          <div className="dashboard-time">
            <span className="date">{currentTime.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span className="time">{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="dashboard-header-center">
          <h1>Court Services Dashboard</h1>
          <p className="welcome-msg">Welcome, {userData?.fullName}!</p>
        </div>

        <div className="dashboard-header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{userData?.fullName}</span>
              <span className="user-id">ID: {userData?.userId}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <ServicesSidebar 
          courtServices={courtServices}
          selectedService={selectedService}
          onServiceSelect={handleServiceSelect}
          quickStats={quickStats}
        />

        <div className="dashboard-content">
          {selectedService ? (
            <ServiceDetails 
              service={selectedService}
              onStartService={handleServiceAction}
            />
          ) : (
            <WelcomeSection 
              courtServices={courtServices}
              onServiceSelect={handleServiceSelect}
            />
          )}

          <MyCasesSection 
            userCases={userCases}
            onViewAll={() => handleServiceSelect(courtServices[1])}
          />

          <NotificationsSection notifications={notifications} />
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Support</h4>
            <p>Help Center</p>
            <p>Contact Support</p>
            <p>FAQ</p>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Court Rules</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@hararicourt.gov.et</p>
            <p>Phone: +251-25-666-1000</p>
            <p>Emergency: +251-911-123456</p>
          </div>
          <div className="footer-section">
            <h4>System Status</h4>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Harari Region Supreme Court Services Portal | User: {userData?.userId}</p>
        </div>
      </footer>
    </div>
  );
};

const WelcomeSection = ({ courtServices, onServiceSelect }) => (
  <div className="welcome-section">
    <h2>Welcome to Your Dashboard</h2>
    <p className="welcome-text">
      Select a service from the sidebar to get started. You can file new cases, 
      check case status, submit documents, make payments, and access other 
      court services.
    </p>
    
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="quick-actions-grid">
        <button 
          className="quick-action-btn"
          onClick={() => onServiceSelect(courtServices[0])}
        >
          <span>📄</span>
          File New Case
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => onServiceSelect(courtServices[1])}
        >
          <span>📊</span>
          Check Case Status
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => onServiceSelect(courtServices[3])}
        >
          <span>💳</span>
          Make Payment
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => onServiceSelect(courtServices[4])}
        >
          <span>📅</span>
          View Schedule
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;