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
                return <FaCheck className="text-green-400 text-sm" />;
            case 'appointment_reminder':
                return <FaClock className="text-orange-400 text-sm" />;
            case 'appointment_cancelled':
                return <FaTimes className="text-red-400 text-sm" />;
            case 'new_appointment':
                return <FaCalendarAlt className="text-blue-400 text-sm" />;
            case 'emergency_appointment':
                return <FaExclamationTriangle className="text-red-500 text-sm" />;
            case 'doctor_message':
                return <FaUserMd className="text-blue-400 text-sm" />;
            case 'test':
                return <span className="text-sm">🧪</span>;
            case 'general':
            default:
                return <FaBell className="text-blue-400 text-sm" />;
        }
    };

    // Get priority styling
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-l-4 border-red-500 bg-red-500/10';
            case 'normal':
                return 'border-l-4 border-blue-500 bg-blue-500/10';
            default:
                return 'border-l-4 border-gray-500 bg-gray-500/10';
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
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-3 h-full border border-gray-600 flex flex-col">
            <style jsx>{`
                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #8b5cf6 transparent;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #a855f7);
                    border-radius: 3px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #9333ea);
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideIn { animation: slideIn 0.3s ease-out; }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg animate-pulse">
                        <FaBell className="text-yellow-600 dark:text-yellow-300 text-sm" />
                    </div>
                    <h2 className="text-white text-lg font-medium">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={sendTestNotification}
                        className="text-blue-400 hover:text-blue-300 p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                        title="Send test notification"
                    >
                        <FaFlask className="text-xs" />
                    </button>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-green-400 hover:text-green-300 p-1.5 hover:bg-gray-700 rounded transition-all duration-300 transform hover:scale-110"
                            title="Mark all as read"
                        >
                            <FaCheckDouble className="text-xs" />
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            onClick={clearAllNotifications}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-gray-700 rounded transition-all duration-300 transform hover:scale-110"
                            title="Clear all notifications"
                        >
                            <FaTrash className="text-xs" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 space-y-2 custom-scroll">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-6xl mb-4 opacity-50 animate-pulse">🔔</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-300">
                            No notifications
                        </h3>
                        <p className="text-sm text-center mb-4">
                            Healthcare notifications will appear here
                        </p>
                        <button
                            onClick={sendTestNotification}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm flex items-center gap-1"
                        >
                            <FaFlask className="text-xs" /> Send Test
                        </button>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <div
                            key={notification.Id}
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:scale-[1.02] hover:shadow-lg animate-slideIn ${
                                !notification.IsRead
                                    ? 'bg-gray-700/70 border-l-2 border-blue-500'
                                    : 'bg-gray-700/30 border-l-2 border-gray-600'
                            } ${getPriorityStyle(notification.Priority)}`}
                            onClick={() => markAsRead(notification.Id)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start gap-2">
                                <div className="p-1 rounded flex-shrink-0 bg-gray-800/50">
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
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-1 line-clamp-2">
                                        {notification.Message}
                                    </p>

                                    {notification.DoctorName && notification.DoctorName !== 'Healthcare System' && (
                                        <div className="flex items-center gap-1">
                                            <FaUserMd className="text-blue-400 text-xs" />
                                            <span className="text-xs text-blue-400">
                                                {notification.DoctorName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Status */}
            <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Notification status</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">{connectionStatus}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSection;