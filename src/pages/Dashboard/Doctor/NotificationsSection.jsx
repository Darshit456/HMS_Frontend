// File: src/pages/dashboard/Doctor/NotificationsSection.jsx
import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTimes, FaCalendarAlt, FaUserMd, FaExclamationTriangle, FaClock, FaTools } from "react-icons/fa";
import { notificationApi } from "../../../services/Doctor/notificationApi";
import { signalRService } from "../../../services/Doctor/signalRService";

const NotificationsSection = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getMyNotifications();
            console.log("Fetched notifications:", data);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Initialize SignalR and fetch notifications
    const initializeNotifications = async () => {
        try {
            setLoading(true);

            // Fetch existing notifications
            await fetchNotifications();

            // Initialize SignalR connection
            const connected = await signalRService.initialize();

            if (connected) {
                // Subscribe to connection status changes
                signalRService.onConnectionStatusChange((status) => {
                    setConnectionStatus(status);
                });

                // Subscribe to new notifications
                signalRService.onNotification((notification) => {
                    setNotifications(prev => [notification, ...prev]);
                });

                setConnectionStatus('Connected');
            }
        } catch (error) {
            console.error("Error initializing notifications:", error);
            setConnectionStatus('Error');
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await notificationApi.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.Id === notificationId
                        ? { ...notification, IsRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, IsRead: true }))
            );
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    // Clear all notifications
    const clearAllNotifications = async () => {
        try {
            await notificationApi.clearAllNotifications();
            setNotifications([]);
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    // Send test notification
    const sendTestNotification = async () => {
        try {
            await notificationApi.sendTestNotification("🧪 Test notification from Doctor Dashboard!");
            console.log("✅ Test notification sent!");
        } catch (error) {
            console.error("❌ Error sending test notification:", error);
            alert("Error sending test notification: " + error.message);
        }
    };

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

    // Initialize on component mount
    useEffect(() => {
        initializeNotifications();

        // Cleanup on unmount
        return () => {
            signalRService.stop();
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.IsRead).length;

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaBell className="text-yellow-500" /> Notifications
                </h2>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        Connecting to notifications...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                        <FaBell className="text-yellow-500" /> Notifications
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </h2>

                    {/* Connection Status */}
                    <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'Connected' ? 'bg-green-500' :
                            connectionStatus === 'Reconnecting' ? 'bg-yellow-500 animate-pulse' :
                                'bg-red-500'
                    }`} title={`SignalR: ${connectionStatus}`}></div>
                </div>

                <div className="flex gap-2">
                    {/* Test Notification Button */}
                    <button
                        onClick={sendTestNotification}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded"
                        title="Send test notification"
                    >
                        🧪 Test
                    </button>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            Mark all read
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            onClick={clearAllNotifications}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 custom-scroll">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4 opacity-50">
                            {connectionStatus === 'Connected' ? '🔔' : '📡'}
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">
                            {connectionStatus === 'Connected' ? 'No notifications' : 'Connection issue'}
                        </h3>
                        <p className="text-sm text-center mb-4">
                            {connectionStatus === 'Connected'
                                ? 'Real-time notifications will appear here'
                                : `Status: ${connectionStatus}`
                            }
                        </p>
                        {connectionStatus === 'Connected' && (
                            <button
                                onClick={sendTestNotification}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                🧪 Send Test Notification
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.Id}
                                className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md border-l-4 ${
                                    !notification.IsRead
                                        ? getPriorityStyle(notification.Priority)
                                        : 'bg-gray-50 dark:bg-gray-700 border-l-gray-300'
                                }`}
                                onClick={() => markAsRead(notification.Id)}
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

                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {formatTime(notification.CreatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Connection Status Footer */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Real-time notifications</span>
                    <span className={`${
                        connectionStatus === 'Connected' ? 'text-green-600' :
                            connectionStatus === 'Reconnecting' ? 'text-yellow-600' :
                                'text-red-600'
                    }`}>
                        {connectionStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSection;