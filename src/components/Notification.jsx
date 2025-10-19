import React, { useState, useEffect } from 'react';


const Notification = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show notification immediately
    setIsVisible(true);

    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getNotificationStyles = () => {
    const baseStyles = "max-w-sm w-full transform transition-all duration-300 ease-out";
    
    if (isExiting) {
      return `${baseStyles} translate-x-full opacity-0 scale-95`;
    }
    
    if (isVisible) {
      return `${baseStyles} translate-x-0 opacity-100 scale-100`;
    }
    
    return `${baseStyles} translate-x-full opacity-0 scale-95`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
          shadowColor: 'shadow-green-100',
          accentColor: 'bg-green-500'
        };
      case 'error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          shadowColor: 'shadow-red-100',
          accentColor: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          shadowColor: 'shadow-yellow-100',
          accentColor: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          shadowColor: 'shadow-blue-100',
          accentColor: 'bg-blue-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className={getNotificationStyles()}>
      <div className={`
        relative overflow-hidden
        bg-white backdrop-blur-sm
        border border-gray-200
        rounded-xl shadow-xl
        ${typeStyles.shadowColor}
        ring-1 ring-black ring-opacity-5
        transform transition-all duration-300 ease-out
        hover:shadow-2xl hover:scale-105
      `}>
        {/* Accent line */}
        <div className={`absolute top-0 left-0 w-1 h-full ${typeStyles.accentColor}`}></div>
        
        {/* Background gradient */}
        <div className={`absolute inset-0 ${typeStyles.bgColor} opacity-50`}></div>
        
        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`
              flex-shrink-0
              p-2 rounded-full
              ${typeStyles.iconColor} bg-white
              shadow-sm ring-1 ring-gray-200
              transform transition-all duration-300
              hover:scale-110 hover:shadow-md
            `}>
              {typeStyles.icon}
            </div>
            
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className={`
                text-sm font-medium leading-5
                ${typeStyles.textColor}
                transform transition-all duration-300
              `}>
                {message}
              </p>
            </div>
            
            {/* Close button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleClose}
                className={`
                  inline-flex items-center justify-center
                  p-1.5 rounded-full
                  ${typeStyles.textColor} hover:${typeStyles.textColor}
                  hover:bg-gray-100
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-${typeStyles.iconColor.split('-')[1]}-500
                  transform transition-all duration-200
                  hover:scale-110 active:scale-95
                `}
              >
                <span className="sr-only">Đóng</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200">
          <div 
            className={`h-full ${typeStyles.accentColor} transition-all duration-300 ease-linear`}
            style={{
              width: isExiting ? '0%' : '100%',
              transition: isExiting ? 'width 0.3s ease-out' : `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
