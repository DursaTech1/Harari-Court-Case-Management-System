import React from 'react';
import './ServicesSidebar.css';

const ServicesSidebar = ({ courtServices, selectedService, onServiceSelect, quickStats }) => {
  return (
    <aside className="services-sidebar">
      <h2 className="sidebar-title">Court Services</h2>
      <div className="services-list">
        {courtServices.map(service => (
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