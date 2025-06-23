// File: src/pages/dashboard/Doctor/NotificationItem.jsx
import React from "react";
import { FaBell, FaCalendarAlt, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaTools } from "react-icons/fa";

const NotificationItem = ({ notification, onMarkAsRead }) => {
    // Get icon component for notification type
    const getNotificationIcon = (type, icon) => {
        if (icon) return <span className="text-lg">{icon}</span>;

        switch (type) {
            case 'new_appointment':
                return <FaCalendarAlt className="text-blue-500" />;
            case 'appointment_status_change':
                return <FaCheck className="text-green-500" />;
            case 'appointment_cancelled':
                return <FaTimes className="text-red-500" />;
            case 'appointment_reminder':
                return <FaClock className="text-orange-500" />;
            case 'emergency_appointment':
                return <FaExclamationTriangle className="text-red-600" />;
            case 'system_update':
                return <FaTools className="text-purple-500" />;
            case 'test':
                return <span className="text-lg">🧪</span>;
            default:
                return <FaBell className="text-gray-500" />;
        }
    };

    // Get priority styling
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'border-l-red-600 bg-red-50 dark:bg-red-900/20';
            case 'high':
                return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'normal':
            default:
                return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <div
            className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md border-l-4 ${
                !notification.IsRead
                    ? getPriorityStyle(notification.Priority)
                    : 'bg-gray-50 dark:bg-gray-700 border-l-gray-300'
            }`}
            onClick={() => onMarkAsRead(notification.Id)}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                    !notification.IsRead ? 'bg-white/50' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                    {getNotificationIcon(notification.NotificationType, notification.Icon)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                            !notification.IsRead
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                        }`}>
                            {notification.Title || 'Notification'}
                        </h4>
                        {!notification.IsRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.Message}
                    </p>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTime(notification.CreatedAt)}
                        </p>

                        {notification.Priority && notification.Priority !== 'normal' && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.Priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                    notification.Priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                        'bg-gray-100 text-gray-600'
                            }`}>
                                {notification.Priority}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;