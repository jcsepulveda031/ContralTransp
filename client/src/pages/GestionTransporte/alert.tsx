import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  toast?: boolean;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, toast, className }) => {
  const alertClasses = `alert alert-${type} ${toast ? 'alert-toast' : ''} ${className || ''}`;
  
  return (
    <div className={alertClasses}>
      <span className="alert-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </span>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Cerrar alerta">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;