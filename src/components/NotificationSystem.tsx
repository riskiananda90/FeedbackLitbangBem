
import React from 'react';
import { Toaster } from 'sonner';

interface NotificationSystemProps {
  notifications: any[];
  isDarkMode: boolean;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  isDarkMode
}) => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      theme={isDarkMode ? 'dark' : 'light'}
      closeButton
      toastOptions={{
        style: {
          background: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: isDarkMode ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        },
        className: 'notification-toast',
        duration: 5000,
      }}
    />
  );
};
