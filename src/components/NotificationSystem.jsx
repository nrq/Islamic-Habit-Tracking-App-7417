import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiInfo, FiAlertTriangle, FiX } = FiIcons;

function NotificationSystem({ notifications, removeNotification }) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.id) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return FiCheck;
      case 'info':
        return FiInfo;
      case 'warning':
        return FiAlertTriangle;
      default:
        return FiInfo;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                <SafeIcon 
                  icon={getNotificationIcon(notification.type)} 
                  className="text-white text-sm" 
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-xs mt-1">
                  {notification.message}
                </p>
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-sm" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationSystem;