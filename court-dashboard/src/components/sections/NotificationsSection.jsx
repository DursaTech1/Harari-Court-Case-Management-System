import React from 'react';
import './NotificationsSection.css';

const NotificationsSection = ({ notifications }) => {
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'hearing': return '📅';
      case 'document': return '📄';
      case 'payment': return '💳';
      case 'message': return '✉️';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-section">
      <h3>Recent Notifications</h3>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;