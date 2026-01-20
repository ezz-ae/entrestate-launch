import React, { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="toast-container">
      <div className="toast">
        <span style={{ marginRight: '8px' }}>✅</span>
        {message}
      </div>
    </div>
  );
};

export default ToastNotification;