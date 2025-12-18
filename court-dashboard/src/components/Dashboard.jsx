import React, { useState, useEffect } from 'react';
import ServicesSidebar from './sections/ServicesSidebar';
import ServiceDetails from './sections/ServiceDetails';
import CaseAnalytics from './sections/CaseAnalytics';
import './Dashboard.css';

const Dashboard = ({ userData, onLogout, courtServices, userCases }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = {
    activeCases: userCases?.length || 0,
    pendingPayments: 1,
    upcomingHearings: 2,
    unreadMessages: 1
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
            <span>{currentTime.toLocaleDateString()}</span>
            <strong>{currentTime.toLocaleTimeString()}</strong>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <strong>{userData?.fullName}</strong>
            <span>ID: {userData?.userId}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        <ServicesSidebar
          courtServices={courtServices}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
          quickStats={quickStats}
        />

        <section className="dashboard-content">
          {selectedService ? (
            <ServiceDetails
              service={selectedService}
              onStartService={() =>
                alert(`Starting ${selectedService.name} process...`)
              }
            />
          ) : (
            <WelcomeSection
              userData={userData}
              courtServices={courtServices}
              onServiceSelect={setSelectedService}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 Harari Region Supreme Court — User: {userData?.userId}</p>
      </footer>
    </div>
  );
};

const WelcomeSection = ({ userData, courtServices, onServiceSelect }) => (
  <div className="welcome-card">
    <h1>Welcome, {userData?.fullName}</h1>
    <p>Select a service below to get started.</p>

    <div className="services-grid">
      {courtServices?.map(service => (
        <div
          key={service.id}
          className="service-card"
          onClick={() => onServiceSelect(service)}
        >
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
    
  </div>
);

export default Dashboard;
