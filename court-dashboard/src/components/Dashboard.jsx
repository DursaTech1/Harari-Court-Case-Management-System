import React, { useState, useEffect } from 'react';
import ServicesSidebar from './sections/ServicesSidebar';
import ServiceDetails from './sections/ServiceDetails';
import CaseAnalytics from './sections/CaseAnalytics';
import './Dashboard.css';

const Dashboard = ({ userData, onLogout, courtServices, userCases }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'analytics', 'profile'

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = {
    activeCases: userCases?.length || 0,
    pendingPayments: 1,
    upcomingHearings: 2,
    unreadMessages: 1,
    completedServices: 3
  };

  return (
    <div className="dashboard-app">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="icon">⚖️</span>
            <div>
              <h2>Harari Court</h2>
              <span>Services Portal</span>
            </div>
          </div>
          <div className="time-box">
            <span>{currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <strong>{currentTime.toLocaleTimeString()}</strong>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {userData?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <strong>{userData?.fullName}</strong>
              <span>ID: {userData?.userId}</span>
              <small>{userData?.userType || 'Citizen'}</small>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn notification-btn">
              🔔
              {quickStats.unreadMessages > 0 && (
                <span className="notification-badge">{quickStats.unreadMessages}</span>
              )}
            </button>
            <button className="header-btn" onClick={() => setViewMode('analytics')}>
              📊 Analytics
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        <ServicesSidebar
          courtServices={courtServices}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
          quickStats={quickStats}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <section className="dashboard-content">
          {viewMode === 'analytics' ? (
            <CaseAnalytics 
              userCases={userCases}
              quickStats={quickStats}
              userData={userData}
            />
          ) : selectedService ? (
            <ServiceDetails
              service={selectedService}
              onStartService={() =>
                alert(`Starting ${selectedService.name} process...`)
              }
              onBack={() => setSelectedService(null)}
            />
          ) : (
            <WelcomeSection
              userData={userData}
              courtServices={courtServices}
              onServiceSelect={setSelectedService}
              quickStats={quickStats}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>© 2024 Harari Region Supreme Court — User: {userData?.userId}</p>
          <div className="footer-links">
            <a href="#help">Help Center</a>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#contact">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const WelcomeSection = ({ userData, courtServices, onServiceSelect, quickStats }) => (
  <div className="welcome-container">
    <div className="welcome-header">
      <h1>Welcome back, {userData?.fullName}!</h1>
      <p className="subtitle">Access court services, track cases, and manage your legal matters</p>
    </div>

    {/* Quick Stats Overview */}
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📋</div>
        <div className="stat-info">
          <h3>{quickStats.activeCases}</h3>
          <p>Active Cases</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <h3>{quickStats.pendingPayments}</h3>
          <p>Pending Payments</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-info">
          <h3>{quickStats.upcomingHearings}</h3>
          <p>Upcoming Hearings</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-info">
          <h3>{quickStats.completedServices}</h3>
          <p>Completed Services</p>
        </div>
      </div>
    </div>

    {/* Services Grid */}
    <div className="services-section">
      <h2>Available Services</h2>
      <p className="section-description">Select a service to begin or learn more</p>
      
      <div className="services-grid">
        {courtServices?.map(service => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => onServiceSelect(service)}
          >
            <div className="service-icon">{service.icon || '⚖️'}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-tags">
              {service.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="service-footer">
              <span className="service-duration">⏱️ {service.duration || '15-30 mins'}</span>
              <button className="service-select-btn">Select →</button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Activity */}
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        <div className="activity-item">
          <div className="activity-icon">📄</div>
          <div className="activity-details">
            <p><strong>Case filed:</strong> Smith vs. Johnson</p>
            <small>Yesterday at 2:30 PM</small>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">✅</div>
          <div className="activity-details">
            <p><strong>Payment completed:</strong> Filing Fee</p>
            <small>2 days ago</small>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">📅</div>
          <div className="activity-details">
            <p><strong>Hearing scheduled:</strong> Dec 15, 2024</p>
            <small>Courtroom 3, 10:00 AM</small>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;