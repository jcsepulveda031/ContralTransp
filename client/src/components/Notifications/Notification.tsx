import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Notification.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'error':
        return <FaExclamationCircle className="notification-icon error" />;
      case 'warning':
        return <FaExclamationCircle className="notification-icon warning" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      default:
        return null;
    }
  };

  return (
    <div className={`notification ${type} ${position}`}>
      <div className="notification-content">
        {getIcon()}
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        <FaTimes />
      </button>
      <div className="notification-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

export default Notification; 