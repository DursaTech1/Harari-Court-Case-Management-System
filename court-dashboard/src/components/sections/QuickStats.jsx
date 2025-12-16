import React from 'react';

const QuickStats = ({ stats }) => {
  return (
    <div className="quick-stats">
      <h3 className="stats-title">Quick Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{stats.activeCases}</span>
          <span className="stat-label">Active Cases</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.pendingPayments}</span>
          <span className="stat-label">Pending Payments</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.upcomingHearings}</span>
          <span className="stat-label">Upcoming Hearings</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.unreadMessages}</span>
          <span className="stat-label">Unread Messages</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;