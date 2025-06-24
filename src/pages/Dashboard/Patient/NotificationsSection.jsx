// File: src/pages/Dashboard/Patient/NotificationsSection.jsx
import React, { useState } from "react";
import { FaBell, FaCheck, FaTimes, FaCalendarAlt, FaClock, FaExclamationTriangle, FaUserMd, FaFlask, FaCheckDouble, FaTrash } from "react-icons/fa";

const NotificationsSection = () => {
    // Dummy notifications data for patient
    const [notifications, setNotifications] = useState([
        {
            Id: 1,
            Title: 'Appointment Confirmed',
            Message: 'Great! Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow at 2:00 PM',
            NotificationType: 'appointment_status_change',
            Priority: 'high',
            Icon: '✅',
            IsRead: false,
            CreatedAt: new Date().toISOString(),
            DoctorName: 'Dr. Sarah Johnson'
        },
        {
            Id: 2,
            Title: 'Appointment Reminder',
            Message: 'You have an appointment with Dr. Michael Chen in 2 hours',
            NotificationType: 'appointment_reminder',
            Priority: 'normal',
            Icon: '⏰',
            IsRead: false,
            CreatedAt: new Date(Date.now() - 1800000).toISOString(),
            DoctorName: 'Dr. Michael Chen'
        },
        {
            Id: 3,
            Title: 'Prescription Ready',
            Message: 'Your prescription from Dr. Emily Brown is ready for pickup',
            NotificationType: 'prescription_ready',
            Priority: 'normal',
            Icon: '💊',
            IsRead: true,
            CreatedAt: new Date(Date.now() - 3600000).toISOString(),
            DoctorName: 'Dr. Emily Brown'
        },
        {
            Id: 4,
            Title: 'Lab Results Available',
            Message: 'Your lab results from last week are now available to view',
            NotificationType: 'lab_results',
            Priority: 'normal',
            Icon: '🧪',
            IsRead: false,
            CreatedAt: new Date(Date.now() - 7200000).toISOString(),
            DoctorName: 'Dr. David Wilson'
        },
        {
            Id: 5,
            Title: 'Appointment Request Declined',
            Message: 'Unfortunately, Dr. Lisa Anderson had to decline your appointment request due to schedule conflict',
            NotificationType: 'appointment_declined',
            Priority: 'high',
            Icon: '❌',
            IsRead: true,
            CreatedAt: new Date(Date.now() - 10800000).toISOString(),
            DoctorName: 'Dr. Lisa Anderson'
        },
        {
            Id: 6,
            Title: 'Health Checkup Reminder',
            Message: 'Time for your annual health checkup! Schedule an appointment with your primary care physician',
            NotificationType: 'health_reminder',
            Priority: 'normal',
            Icon: '🏥',
            IsRead: false,
            CreatedAt: new Date(Date.now() - 14400000).toISOString(),
            DoctorName: 'Healthcare System'
        }
    ]);

    const [connectionStatus] = useState('Connected');

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.Id === notificationId
                    ? { ...notification, IsRead: true }
                    : notification
            )
        );
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, IsRead: true }))
        );
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Send test notification
    const sendTestNotification = () => {
        const newNotification = {
            Id: Date.now(),
            Title: 'Test Notification',
            Message: '🧪 This is a test notification from Patient Dashboard!',
            NotificationType: 'test',
            Priority: 'normal',
            Icon: '🧪',
            IsRead: false,
            CreatedAt: new Date().toISOString(),
            DoctorName: 'Test Doctor'
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // Get icon component for notification type
    const getNotificationIcon = (type, icon) => {
        if (icon) return <span className="text-sm">{icon}</span>;

        switch (type) {
            case 'appointment_status_change':
                return <FaCheck className="text-green-500 text-sm" />;
            case 'appointment_reminder':
                return <FaClock className="text-orange-500 text-sm" />;
            case 'appointment_cancelled':
                return <FaTimes className="text-red-500 text-sm" />;
            case 'new_appointment':
                return <FaCalendarAlt className="text-blue-500 text-sm" />;
            case 'emergency_appointment':
                return <FaExclamationTriangle className="text-red-600 text-sm" />;
            case 'doctor_message':
                return <FaUserMd className="text-blue-500 text-sm" />;
            case 'test':
                return <span className="text-sm">🧪</span>;
            case 'general':
            default:
                return <FaBell className="text-blue-500 text-sm" />;
        }
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.IsRead).length;

    return (
        <div className="bg-slate-800 rounded-xl p-3 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FaBell className="text-yellow-500 text-sm" />
                    <h2 className="text-white text-lg font-medium">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full text-xs">
                            {unreadCount}
                        </span>
                    )}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={sendTestNotification}
                        className="text-blue-400 hover:text-blue-300 p-1.5 bg-slate-700 rounded hover:bg-slate-600 transition"
                        title="Send test notification"
                    >
                        <FaFlask className="text-xs" />
                    </button>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-green-400 hover:text-green-300 p-1.5 hover:bg-slate-700 rounded transition"
                            title="Mark all as read"
                        >
                            <FaCheckDouble className="text-xs" />
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            onClick={clearAllNotifications}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-700 rounded transition"
                            title="Clear all notifications"
                        >
                            <FaTrash className="text-xs" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 space-y-2">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-4xl mb-2 opacity-50">🏥</div>
                        <h3 className="text-sm font-medium mb-2 text-gray-300">
                            No notifications
                        </h3>
                        <p className="text-xs text-center mb-4">
                            Healthcare notifications will appear here
                        </p>
                        <button
                            onClick={sendTestNotification}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                        >
                            <FaFlask className="text-xs" /> Send Test
                        </button>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.Id}
                            className={`p-2 rounded-lg cursor-pointer transition-all hover:bg-slate-700 ${
                                !notification.IsRead
                                    ? 'bg-slate-700 border-l-2 border-blue-500'
                                    : 'bg-slate-750 border-l-2 border-gray-600'
                            }`}
                            onClick={() => markAsRead(notification.Id)}
                        >
                            <div className="flex items-start gap-2">
                                <div className="p-1 rounded flex-shrink-0">
                                    {getNotificationIcon(notification.NotificationType, notification.Icon)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm font-medium truncate ${
                                            !notification.IsRead
                                                ? 'text-white'
                                                : 'text-gray-300'
                                        }`}>
                                            {notification.Title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                {formatTime(notification.CreatedAt)}
                                            </span>
                                            {!notification.IsRead && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-1 line-clamp-2">
                                        {notification.Message}
                                    </p>

                                    {notification.DoctorName && notification.DoctorName !== 'Healthcare System' && (
                                        <span className="text-xs text-blue-400">
                                            {notification.DoctorName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsSection;