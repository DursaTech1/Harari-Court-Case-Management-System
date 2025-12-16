import React from 'react';
import './ServiceDetails.css';

const ServiceDetails = ({ service, onStartService }) => {
  return (
    <div className="service-details">
      <div className="service-details-header">
        <div className="service-title-section">
          <span className="service-details-icon">{service.icon}</span>
          <div>
            <h2>{service.name}</h2>
            <p className="service-description">{service.description}</p>
          </div>
        </div>
        <button 
          className="start-service-btn"
          onClick={() => onStartService(service.name)}
        >
          Start {service.name}
        </button>
      </div>

      <div className="service-requirements">
        <h3>Requirements</h3>
        <ul>
          {service.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="service-instructions">
        <h3>How to Proceed</h3>
        <ol>
          <li>Prepare all required documents</li>
          <li>Ensure you have your case number (if applicable)</li>
          <li>Click "Start {service.name}" to begin the process</li>
          <li>Follow the step-by-step instructions</li>
          <li>Submit your request for processing</li>
        </ol>
      </div>
    </div>
  );
};

export default ServiceDetails;