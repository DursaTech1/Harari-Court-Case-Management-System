import React, { useState } from 'react';
import './CaseAnalytics.css';

const CaseAnalytics = ({ userCases, quickStats, userData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Simple case stats
  const caseStats = [
    { name: 'Active Cases', count: quickStats.activeCases, color: '#4299e1', icon: '📋' },
    { name: 'Pending', count: 2, color: '#ed8936', icon: '⏳' },
    { name: 'Closed', count: 5, color: '#48bb78', icon: '✅' },
    { name: 'On Hold', count: 1, color: '#a0aec0', icon: '⏸️' }
  ];

  // Simple upcoming hearings
  const upcomingHearings = [
    { case: 'Smith vs. Johnson', date: 'Dec 15', time: '10:00 AM', courtroom: '3' },
    { case: 'State vs. Anderson', date: 'Dec 20', time: '2:00 PM', courtroom: '5' }
  ];

  // Simple case types
  const caseTypes = [
    { type: 'Civil', cases: 8, color: '#4299e1' },
    { type: 'Criminal', cases: 6, color: '#ed8936' },
    { type: 'Family', cases: 4, color: '#9f7aea' },
    { type: 'Commercial', cases: 2, color: '#38b2ac' }
  ];

  // Simple recent activity
  const recentActivity = [
    { action: 'Case filed', case: 'Smith vs. Johnson', date: '2 days ago' },
    { action: 'Document submitted', case: 'State vs. Anderson', date: '1 day ago' },
    { action: 'Hearing scheduled', case: 'Doe Estate', date: 'Today' }
  ];

  return (
    <div className="simple-analytics">
      {/* Header */}
      <div className="analytics-header">
        <h1>Case Overview</h1>
        <div className="period-selector">
          <button 
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button 
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button 
            className={selectedPeriod === 'year' ? 'active' : ''}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {caseStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '20' }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.count}</h3>
              <p>{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column */}
        <div className="content-left">
          {/* Case Types */}
          <div className="card">
            <h2>Case Types</h2>
            <div className="case-types">
              {caseTypes.map((item, index) => (
                <div key={index} className="case-type-item">
                  <div className="type-info">
                    <span 
                      className="type-dot" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="type-name">{item.type}</span>
                  </div>
                  <div className="type-count">{item.cases} cases</div>
                </div>
              ))}
            </div>
          </div>

          
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Upcoming Hearings */}
          <div className="card">
            <h2>Upcoming Hearings</h2>
            <div className="hearings-list">
              {upcomingHearings.map((hearing, index) => (
                <div key={index} className="hearing-item">
                  <div className="hearing-date">
                    <strong>{hearing.date}</strong>
                    <span>{hearing.time}</span>
                  </div>
                  <div className="hearing-details">
                    <p>{hearing.case}</p>
                    <span className="courtroom">Courtroom {hearing.courtroom}</span>
                  </div>
                  <button className="reminder-btn">Set Reminder</button>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <div className="summary-item">
          <h3>Total Cases</h3>
          <p>{caseStats.reduce((sum, stat) => sum + stat.count, 0)}</p>
        </div>
        <div className="summary-item">
          <h3>Success Rate</h3>
          <p>78%</p>
        </div>
        <div className="summary-item">
          <h3>Avg. Resolution Time</h3>
          <p>45 days</p>
        </div>
        <div className="summary-item">
          <h3>Next Hearing</h3>
          <p>Dec 15, 10:00 AM</p>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalytics;