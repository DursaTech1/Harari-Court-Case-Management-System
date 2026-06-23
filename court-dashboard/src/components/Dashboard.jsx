import React, { useState, useEffect } from 'react';
import ServicesSidebar from './sections/ServicesSidebar';
import ServiceDetails from './sections/ServiceDetails';
import CaseAnalytics from './sections/CaseAnalytics';
import './Dashboard.css';
import { fetchDashboardData, fetchMyRequests } from '../api/api';

const Dashboard = ({ userData, onLogout, userCases }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'analytics', 'profile'
  const [dashboardData, setDashboardData] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = {
  activeCases: dashboardData?.active_cases ?? userCases?.length ?? 0,
  pendingPayments: dashboardData?.pending_payments ?? 0,
  upcomingHearings: dashboardData?.upcoming_hearings ?? 0,
  unreadMessages: dashboardData?.unread_messages ?? 0,
  completedServices: dashboardData?.completed_services ?? 0
};
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const [data, requests] = await Promise.all([
        fetchDashboardData(),
        fetchMyRequests(),
      ]);
      setDashboardData(data);
      setMyRequests(requests);
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
  };

  loadDashboard();
}, []);


  // Define services here for the WelcomeSection grid
  const allServices = [
    { 
      id: 1, 
      name: 'Document Submission', 
      icon: '📄',
      description: 'Submit legal documents electronically',
      tags: ['Digital', 'Official'],
      duration: '15-30 mins'
    },
    { 
      id: 2, 
      name: 'Arbitration Fee', 
      icon: '💰',
      description: 'Pay arbitration and court fees online',
      tags: ['Payment', 'Required'],
      duration: '10-15 mins'
    },
    { 
      id: 3, 
      name: 'Search Document', 
      icon: '🔍',
      description: 'Search and retrieve court documents',
      tags: ['Search', 'Records'],
      duration: '5-20 mins'
    },
    { 
      id: 4, 
      name: 'Daily Appointment', 
      icon: '📅',
      description: 'Schedule appointments with court officials',
      tags: ['Booking', 'Schedule'],
      duration: '10-20 mins'
    },
    { 
      id: 5, 
      name: 'Complaint Form', 
      icon: '📝',
      description: 'File official complaints or grievances',
      tags: ['Form', 'Legal'],
      duration: '20-40 mins'
    },
    { 
      id: 6, 
      name: 'FeedBack', 
      icon: '💬',
      description: 'Provide feedback on court services',
      tags: ['Feedback', 'Review'],
      duration: '5-15 mins'
    }
  ];

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
           <button
            className="logout-btn"
            onClick={onLogout}  // Changed from window.location to use the prop
          >
                Logout
          </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        <ServicesSidebar
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
        />

        <section className="dashboard-content">
          {viewMode === 'analytics' ? (
            <CaseAnalytics 
              userCases={dashboardData?.cases || userCases}
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
              allServices={allServices}
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

const WelcomeSection = ({ userData, allServices, onServiceSelect, quickStats }) => (
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
        {allServices?.map(service => (
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
              <button className="service-select-btn">Select </button>
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