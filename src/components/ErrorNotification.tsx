import React from 'react';

interface ErrorNotificationProps {
  message: string; // The error message to be displayed in the notification.
}

/**
 * ErrorNotification Component
 * 
 * The ErrorNotification component is designed to display error messages
 * to the user. It provides visual feedback when an operation fails, 
 * enhancing user experience and debugging.
 * 
 * @component
 * @param {ErrorNotificationProps} props - The component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} The rendered ErrorNotification component.
 */
const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return (
    <div className="error-notification">
      <p>Error: {message}</p>
    </div>
  );
};

export default ErrorNotification;
