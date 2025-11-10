// src/components/Notifications.tsx
import React from 'react';
import { useNotification } from '../context/NotificationContext';

export function Notifications() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`toast show align-items-center text-white bg-${notification.type} border-0`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              {notification.message}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => removeNotification(notification.id)} 
              aria-label="Close"
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}