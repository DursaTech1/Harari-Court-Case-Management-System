import React, { useState, useEffect } from 'react';
import './ServicesSidebar.css';
import { fetchCourtServices } from '../../api/api';

const ServicesSidebar = ({ selectedService, onServiceSelect }) => {
  const [services, setServices] = useState([
    { id: 1, name: 'Document Submission', icon: '📄' },
    { id: 2, name: 'Arbitration Fee',     icon: '💰' },
    { id: 3, name: 'Search Document',     icon: '🔍' },
    { id: 4, name: 'Daily Appointment',   icon: '📅' },
    { id: 5, name: 'Complaint Form',      icon: '📝' },
    { id: 6, name: 'FeedBack',            icon: '💬' },
  ]);

  useEffect(() => {
    fetchCourtServices()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => { /* keep the hardcoded fallback */ });
  }, []);

  return (
    <aside className="services-sidebar">
      <h2 className="sidebar-title">Court Services</h2>
      <div className="services-list">
        {services.map(service => (
          <button
            key={service.id}
            className={`service-item ${selectedService?.id === service.id ? 'active' : ''}`}
            onClick={() => onServiceSelect(service)}
          >
            <span className="service-item-icon">{service.icon}</span>
            <span className="service-item-name">{service.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ServicesSidebar;