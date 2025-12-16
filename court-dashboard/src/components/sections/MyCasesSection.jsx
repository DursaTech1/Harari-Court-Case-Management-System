import React from 'react';
import './MyCasesSection.css';

const MyCasesSection = ({ userCases, onViewAll }) => {
  return (
    <div className="my-cases-section">
      <div className="section-header">
        <h3>My Cases</h3>
        <button 
          className="view-all-btn"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      
      <div className="cases-grid">
        {userCases.map(caseItem => (
          <div key={caseItem.id} className="case-card">
            <div className="case-header">
              <span className="case-id">{caseItem.id}</span>
              <span className={`case-status ${caseItem.status.toLowerCase()}`}>
                {caseItem.status}
              </span>
            </div>
            <h4 className="case-title">{caseItem.title}</h4>
            <div className="case-details">
              <div className="case-detail">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{caseItem.department}</span>
              </div>
              <div className="case-detail">
                <span className="detail-label">Judge:</span>
                <span className="detail-value">{caseItem.judge}</span>
              </div>
              <div className="case-detail">
                <span className="detail-label">Next Hearing:</span>
                <span className="detail-value">{caseItem.nextHearing}</span>
              </div>
            </div>
            <div className="case-actions">
              <button className="case-action-btn view-btn">View Details</button>
              <button className="case-action-btn documents-btn">Documents</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCasesSection;