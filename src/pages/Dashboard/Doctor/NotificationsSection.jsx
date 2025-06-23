import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTimes, FaCalendarAlt, FaUserMd, FaExclamationTriangle } from "react-icons/fa";

const NotificationsSection = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate notifications based on common healthcare scenarios
    useEffect(() => {
        const generateNotifications = () => {
            const mockNotifications = [
                {
                    id: 1,
                    type: 'appointment',
                    title: 'New Appointment Request',
                    message: 'Sarah Williams requested an appointment for tomorrow at 2:00 PM',
                    time: '5 minutes ago',
                    icon: FaCalendarAlt,
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                    unread: true
                },
                {
                    id: 2,
                    type: 'urgent',
                    title: 'Urgent: Lab Results',
                    message: 'Critical lab results available for Patient ID #127',
                    time: '15 minutes ago',
                    icon: FaExclamationTriangle,
                    color: 'text-red-500',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    unread: true
                },
                {
                    id: 3,
                    type: 'system',
                    title: 'System Update',
                    message: 'Patient management system will be updated tonight at 11 PM',
                    time: '1 hour ago',
                    icon: FaUserMd,
                    color: 'text-green-500',
                    bgColor: 'bg-green-50 dark:bg-green-900/20',
                    unread: false
                },
                {
                    id: 4,
                    type: 'appointment',
                    title: 'Appointment Cancelled',
                    message: 'Michael Brown cancelled his appointment for today at 3:30 PM',
                    time: '2 hours ago',
                    icon: FaTimes,
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                    unread: false
                },
                {
                    id: 5,
                    type: 'confirmation',
                    title: 'Appointment Confirmed',
                    message: 'Emily Clark confirmed her appointment for today at 4:00 PM',
                    time: '3 hours ago',
                    icon: FaCheck,
                    color: 'text-green-500',
                    bgColor: 'bg-green-50 dark:bg-green-900/20',
                    unread: false
                }
            ];

            setNotifications(mockNotifications);
            setLoading(false);
        };

        // Simulate loading delay
        setTimeout(generateNotifications, 1000);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, unread: false }))
        );
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaBell className="text-yellow-500" /> Notifications
                </h2>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">Loading notifications...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaBell className="text-yellow-500" /> Notifications
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h2>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex-1 custom-scroll">
                {notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        No notifications
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => {
                            const IconComponent = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                        notification.unread
                                            ? `${notification.bgColor} border-l-4 border-l-blue-500`
                                            : 'bg-gray-50 dark:bg-gray-700'
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${notification.bgColor}`}>
                                            <IconComponent className={`text-sm ${notification.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-medium ${
                                                    notification.unread
                                                        ? 'text-gray-900 dark:text-white'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {notification.title}
                                                </h4>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsSection;