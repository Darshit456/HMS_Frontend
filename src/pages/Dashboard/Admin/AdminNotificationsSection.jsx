// File Location: src/pages/Dashboard/Admin/AdminNotificationsSection.jsx
import React, { useState, useEffect } from 'react';
import {
    getAllNotifications,
    getNotificationStats,
    sendNotification,
    updateNotification,
    deleteNotification,
    getFilteredNotifications,
    getRecipientOptions,
    getNotificationTypes,
    getPriorityLevels,
    getDeliveryMethods,
    messageTemplates
} from '../../../services/Admin/notificationsApi';

const AdminNotificationsSection = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        recipientType: "",
        status: "",
        priority: "",
        type: "",
        date: "",
        searchTerm: ""
    });

    // Form states
    const [createFormData, setCreateFormData] = useState({
        title: "",
        message: "",
        type: "",
        priority: "Medium",
        recipientType: "",
        deliveryMethod: ["Email"],
        scheduleFor: ""
    });

    const [editFormData, setEditFormData] = useState({
        id: null,
        title: "",
        message: "",
        type: "",
        priority: "",
        deliveryMethod: [],
        scheduleFor: ""
    });

    // Statistics state
    const [stats, setStats] = useState({
        total: 0,
        sent: 0,
        scheduled: 0,
        draft: 0,
        thisMonth: 0,
        thisWeek: 0,
        today: 0,
        totalRecipients: 0,
        totalReads: 0
    });

    const [formErrors, setFormErrors] = useState({});

    // Format date display
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return {
                date: date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                time: date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (error) {
            return { date: 'Invalid Date', time: 'Invalid Time' };
        }
    };

    // Get status styling
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent':
                return {
                    bg: 'bg-gradient-to-br from-green-900/20 to-emerald-900/10',
                    badge: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
                    border: 'border-green-500/30',
                    icon: '✅'
                };
            case 'scheduled':
                return {
                    bg: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/10',
                    badge: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg',
                    border: 'border-blue-500/30',
                    icon: '📅'
                };
            case 'draft':
                return {
                    bg: 'bg-gradient-to-br from-gray-900/20 to-slate-900/10',
                    badge: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg',
                    border: 'border-gray-500/30',
                    icon: '📝'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-800/50 to-gray-700/30',
                    badge: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg',
                    border: 'border-gray-500/30',
                    icon: '❓'
                };
        }
    };

    // Get priority styling
    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return { color: 'text-red-400', bg: 'bg-red-900/20', icon: '🚨' };
            case 'high':
                return { color: 'text-orange-400', bg: 'bg-orange-900/20', icon: '⚠️' };
            case 'medium':
                return { color: 'text-yellow-400', bg: 'bg-yellow-900/20', icon: '📋' };
            case 'low':
                return { color: 'text-blue-400', bg: 'bg-blue-900/20', icon: 'ℹ️' };
            default:
                return { color: 'text-gray-400', bg: 'bg-gray-900/20', icon: '📄' };
        }
    };

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Apply filters when filters or notifications change
    useEffect(() => {
        applyFilters();
    }, [notifications, filters]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError("");

            const [notificationsData, statsData] = await Promise.all([
                getAllNotifications(),
                getNotificationStats()
            ]);

            setNotifications(notificationsData);
            setStats(statsData);

        } catch (err) {
            console.error("Error loading notifications data:", err);
            setError("Failed to load notifications data");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        try {
            const filtered = await getFilteredNotifications(filters);
            setFilteredNotifications(filtered);
        } catch (error) {
            console.error("Error applying filters:", error);
            setFilteredNotifications(notifications);
        }
    };

    // Validate form data
    const validateCreateForm = () => {
        const errors = {};

        if (!createFormData.title.trim()) errors.title = "Title is required";
        if (!createFormData.message.trim()) errors.message = "Message is required";
        if (!createFormData.type) errors.type = "Notification type is required";
        if (!createFormData.recipientType) errors.recipientType = "Recipient is required";
        if (createFormData.deliveryMethod.length === 0) errors.deliveryMethod = "At least one delivery method is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle create notification
    const handleCreateNotification = async (e) => {
        e.preventDefault();
        if (!validateCreateForm()) return;

        try {
            setProcessing('create');

            const recipientOptions = getRecipientOptions();
            const selectedRecipient = recipientOptions.find(r => r.value === createFormData.recipientType);

            const notificationData = {
                title: createFormData.title,
                message: createFormData.message,
                type: createFormData.type,
                priority: createFormData.priority,
                recipient: selectedRecipient?.label || 'Unknown',
                recipientType: createFormData.recipientType,
                deliveryMethod: createFormData.deliveryMethod,
                scheduleFor: createFormData.scheduleFor || null,
                totalRecipients: selectedRecipient?.count || 1
            };

            await sendNotification(notificationData);
            alert("Notification sent successfully!");

            setShowCreateModal(false);
            setCreateFormData({
                title: "",
                message: "",
                type: "",
                priority: "Medium",
                recipientType: "",
                deliveryMethod: ["Email"],
                scheduleFor: ""
            });
            setFormErrors({});
            loadInitialData();

        } catch (error) {
            console.error("Error creating notification:", error);
            alert("Failed to send notification: " + error.message);
        } finally {
            setProcessing(null);
        }
    };

    // Handle edit notification
    const handleEditNotification = (notification) => {
        setEditFormData({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            priority: notification.priority,
            deliveryMethod: notification.deliveryMethod || [],
            scheduleFor: notification.scheduledFor ? notification.scheduledFor.slice(0, 16) : ""
        });
        setShowEditModal(true);
    };

    const handleUpdateNotification = async (e) => {
        e.preventDefault();

        try {
            setProcessing('edit');

            const updateData = {
                title: editFormData.title,
                message: editFormData.message,
                type: editFormData.type,
                priority: editFormData.priority,
                deliveryMethod: editFormData.deliveryMethod,
                scheduledFor: editFormData.scheduleFor || null
            };

            await updateNotification(editFormData.id, updateData);
            alert("Notification updated successfully!");

            setShowEditModal(false);
            setFormErrors({});
            loadInitialData();

        } catch (error) {
            console.error("Error updating notification:", error);
            alert("Failed to update notification: " + error.message);
        } finally {
            setProcessing(null);
        }
    };

    // Handle delete notification
    const handleDeleteNotification = async (notificationId, title) => {
        if (window.confirm(`Are you sure you want to delete the notification "${title}"? This action cannot be undone.`)) {
            try {
                setProcessing(notificationId);
                await deleteNotification(notificationId);

                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                alert("Notification deleted successfully!");
            } catch (error) {
                console.error("Error deleting notification:", error);
                alert("Failed to delete notification: " + error.message);
            } finally {
                setProcessing(null);
            }
        }
    };

    // Handle template selection
    const handleTemplateSelect = (template) => {
        setCreateFormData({
            ...createFormData,
            title: template.title,
            message: template.message,
            type: template.category
        });
        setShowTemplateModal(false);
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            recipientType: "",
            status: "",
            priority: "",
            type: "",
            date: "",
            searchTerm: ""
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 animate-pulse">
                        <span className="text-white text-2xl">🔔</span>
                    </div>
                    <div className="text-gray-300 text-lg animate-pulse">Loading notifications data...</div>
                    <div className="flex justify-center space-x-1 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <div className="text-red-400 text-lg mb-4">{error}</div>
                    <button
                        onClick={loadInitialData}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl">🔔</span>
                            </div>
                            Notifications Management
                        </h2>
                        <p className="text-gray-400 ml-15">Send and manage system notifications</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                            <span className="text-lg">📋</span>
                            <span className="font-medium">Templates</span>
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                            <span className="text-lg">➕</span>
                            <span className="font-medium">Send Notification</span>
                        </button>
                        <button
                            onClick={loadInitialData}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                            <span className="text-lg">🔄</span>
                            <span className="font-medium">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-9 gap-4 mt-6">
                    {[
                        { label: 'Total', value: stats.total, color: 'from-blue-600 to-cyan-600', icon: '📊' },
                        { label: 'Sent', value: stats.sent, color: 'from-green-600 to-emerald-600', icon: '✅' },
                        { label: 'Scheduled', value: stats.scheduled, color: 'from-blue-600 to-indigo-600', icon: '📅' },
                        { label: 'Drafts', value: stats.draft, color: 'from-gray-600 to-slate-600', icon: '📝' },
                        { label: 'This Month', value: stats.thisMonth, color: 'from-purple-600 to-pink-600', icon: '📈' },
                        { label: 'This Week', value: stats.thisWeek, color: 'from-amber-600 to-orange-600', icon: '📊' },
                        { label: 'Today', value: stats.today, color: 'from-emerald-600 to-teal-600', icon: '⏰' },
                        { label: 'Recipients', value: stats.totalRecipients, color: 'from-indigo-600 to-purple-600', icon: '👥' },
                        { label: 'Total Reads', value: stats.totalReads, color: 'from-rose-600 to-pink-600', icon: '👁️' }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="bg-gray-900/20 backdrop-blur-sm p-3 rounded-xl border border-gray-600 transition-all duration-300 hover:scale-105"
                        >
                            <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                                <span className="text-white text-sm">{stat.icon}</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-xs font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm">🔍</span>
                    </div>
                    Filters & Search
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Search</label>
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Recipients</label>
                        <select
                            value={filters.recipientType}
                            onChange={(e) => setFilters({...filters, recipientType: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 border-gray-600"
                        >
                            <option value="">All Recipients</option>
                            {getRecipientOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-green-500 border-gray-600"
                        >
                            <option value="">All Status</option>
                            <option value="Sent">Sent</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({...filters, priority: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-red-500 border-gray-600"
                        >
                            <option value="">All Priorities</option>
                            {getPriorityLevels().map(priority => (
                                <option key={priority.value} value={priority.value}>
                                    {priority.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Type</label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 border-gray-600"
                        >
                            <option value="">All Types</option>
                            {getNotificationTypes().map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Date</label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-4xl">🔔</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No notifications found</h3>
                        <p className="text-gray-400">
                            {filters.searchTerm || filters.recipientType || filters.status || filters.priority || filters.type || filters.date
                                ? "Try adjusting your filters"
                                : "Notifications will appear here when created"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm">📬</span>
                            </div>
                            Notifications List ({filteredNotifications.length})
                        </h3>

                        <div className="grid gap-4">
                            {filteredNotifications.map((notification, index) => {
                                const statusStyle = getStatusStyle(notification.status);
                                const priorityStyle = getPriorityStyle(notification.priority);
                                const dateTime = formatDateTime(notification.createdAt);

                                return (
                                    <div
                                        key={notification.id}
                                        className={`${statusStyle.bg} ${statusStyle.border} border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-xl">🔔</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-white text-lg">
                                                                {notification.title}
                                                            </h4>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.badge}`}>
                                                                {statusStyle.icon} {notification.status}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyle.bg} ${priorityStyle.color}`}>
                                                                {priorityStyle.icon} {notification.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-300">
                                                            To: {notification.recipient} • Type: {notification.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                                                    <div className="space-y-2">
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-blue-400">📅</span>
                                                            <span><strong>Created:</strong> {dateTime.date} at {dateTime.time}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-green-400">👥</span>
                                                            <span><strong>Recipients:</strong> {notification.totalRecipients}</span>
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-purple-400">📧</span>
                                                            <span><strong>Delivery:</strong> {notification.deliveryMethod?.join(', ') || 'Email'}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-cyan-400">👁️</span>
                                                            <span><strong>Read:</strong> {notification.readCount}/{notification.totalRecipients}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 p-3 bg-gray-900/30 rounded-lg border border-gray-600">
                                                    <p className="text-sm text-gray-300">
                                                        <strong className="text-blue-400">Message:</strong> {notification.message.slice(0, 150)}{notification.message.length > 150 ? '...' : ''}
                                                    </p>
                                                </div>

                                                {notification.scheduledFor && (
                                                    <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
                                                        <p className="text-sm text-blue-300">
                                                            <strong>Scheduled for:</strong> {formatDateTime(notification.scheduledFor).date} at {formatDateTime(notification.scheduledFor).time}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[200px]">
                                                <button
                                                    onClick={() => setSelectedNotification(notification)}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                                                >
                                                    <span>👁️</span>
                                                    View Details
                                                </button>

                                                <button
                                                    onClick={() => handleEditNotification(notification)}
                                                    className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                                                >
                                                    <span>✏️</span>
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteNotification(notification.id, notification.title)}
                                                    disabled={processing === notification.id}
                                                    className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                >
                                                    <span>🗑️</span>
                                                    {processing === notification.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateNotificationModal
                    formData={createFormData}
                    setFormData={setCreateFormData}
                    onSubmit={handleCreateNotification}
                    onClose={() => {
                        setShowCreateModal(false);
                        setCreateFormData({
                            title: "",
                            message: "",
                            type: "",
                            priority: "Medium",
                            recipientType: "",
                            deliveryMethod: ["Email"],
                            scheduleFor: ""
                        });
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    processing={processing === 'create'}
                />
            )}

            {showEditModal && (
                <EditNotificationModal
                    formData={editFormData}
                    setFormData={setEditFormData}
                    onSubmit={handleUpdateNotification}
                    onClose={() => {
                        setShowEditModal(false);
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    processing={processing === 'edit'}
                />
            )}

            {selectedNotification && (
                <NotificationDetailsModal
                    notification={selectedNotification}
                    onClose={() => setSelectedNotification(null)}
                    formatDateTime={formatDateTime}
                    getStatusStyle={getStatusStyle}
                    getPriorityStyle={getPriorityStyle}
                />
            )}

            {showTemplateModal && (
                <TemplatesModal
                    onSelectTemplate={handleTemplateSelect}
                    onClose={() => setShowTemplateModal(false)}
                />
            )}
        </div>
    );
};

// Create Notification Modal
const CreateNotificationModal = ({ formData, setFormData, onSubmit, onClose, errors, processing }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🔔</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Send Notification</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Enter notification title"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Type *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 border-gray-600"
                        >
                            <option value="">Select Type</option>
                            {getNotificationTypes().map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Recipients *</label>
                        <select
                            value={formData.recipientType}
                            onChange={(e) => setFormData({...formData, recipientType: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        >
                            <option value="">Select Recipients</option>
                            {getRecipientOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label} ({option.count} users)
                                </option>
                            ))}
                        </select>
                        {errors.recipientType && <p className="text-red-400 text-xs mt-1">{errors.recipientType}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-red-500 border-gray-600"
                        >
                            {getPriorityLevels().map(priority => (
                                <option key={priority.value} value={priority.value}>
                                    {priority.icon} {priority.value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Delivery Methods *</label>
                    <div className="flex gap-4">
                        {getDeliveryMethods().map(method => (
                            <label key={method.value} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.deliveryMethod.includes(method.value)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData({
                                                ...formData,
                                                deliveryMethod: [...formData.deliveryMethod, method.value]
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                deliveryMethod: formData.deliveryMethod.filter(m => m !== method.value)
                                            });
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-300 text-sm">{method.icon} {method.value}</span>
                            </label>
                        ))}
                    </div>
                    {errors.deliveryMethod && <p className="text-red-400 text-xs mt-1">{errors.deliveryMethod}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Message *</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows="6"
                        placeholder="Enter your notification message..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Schedule For Later (Optional)</label>
                    <input
                        type="datetime-local"
                        value={formData.scheduleFor}
                        onChange={(e) => setFormData({...formData, scheduleFor: e.target.value})}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Leave empty to send immediately</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <span>📤</span>
                                {formData.scheduleFor ? 'Schedule Notification' : 'Send Notification'}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Edit Notification Modal
const EditNotificationModal = ({ formData, setFormData, onSubmit, onClose, errors, processing }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">✏️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Edit Notification</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 border-gray-600 resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                Update Notification
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Notification Details Modal
const NotificationDetailsModal = ({ notification, onClose, formatDateTime, getStatusStyle, getPriorityStyle }) => {
    const statusStyle = getStatusStyle(notification.status);
    const priorityStyle = getPriorityStyle(notification.priority);
    const createdDateTime = formatDateTime(notification.createdAt);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl">🔔</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Notification Details</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                <span>📋</span> Notification Information
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Title</label>
                                    <p className="text-white font-semibold text-lg">{notification.title}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Type</label>
                                    <p className="text-white">{notification.type}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Status</label>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyle.badge} mt-1`}>
                                            {statusStyle.icon} {notification.status}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Priority</label>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityStyle.bg} ${priorityStyle.color} mt-1`}>
                                            {priorityStyle.icon} {notification.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                                <span>👥</span> Recipients & Delivery
                            </h4>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Recipients</label>
                                    <p className="text-white font-semibold">{notification.recipient}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Total Recipients</label>
                                    <p className="text-white">{notification.totalRecipients}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Read Count</label>
                                    <p className="text-white">{notification.readCount}/{notification.totalRecipients}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Delivery Methods</label>
                                    <div className="flex gap-2 mt-1">
                                        {(notification.deliveryMethod || ['Email']).map(method => (
                                            <span key={method} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm">
                                                {method === 'Email' ? '📧' : method === 'SMS' ? '📱' : '🔔'} {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                <span>⏰</span> Timeline
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Created</label>
                                    <p className="text-white">{createdDateTime.date} at {createdDateTime.time}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Created By</label>
                                    <p className="text-white">{notification.createdBy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h4 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                <span>📊</span> Statistics
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Read Rate:</span>
                                    <span className="text-white font-semibold">
                                        {notification.totalRecipients > 0
                                            ? Math.round((notification.readCount / notification.totalRecipients) * 100)
                                            : 0
                                        }%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${notification.totalRecipients > 0
                                                ? (notification.readCount / notification.totalRecipients) * 100
                                                : 0
                                            }%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <span>💬</span> Message Content
                        </h4>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="text-white whitespace-pre-wrap leading-relaxed">{notification.message}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Templates Modal
const TemplatesModal = ({ onSelectTemplate, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Templates</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <div className="grid gap-4">
                {messageTemplates.map((template, index) => (
                    <div
                        key={template.id}
                        className="bg-gradient-to-br from-gray-700/50 to-gray-600/30 border border-gray-600 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                        onClick={() => onSelectTemplate(template)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-white text-lg mb-1">{template.name}</h4>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300">
                                    {template.category}
                                </span>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-lg text-sm hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">
                                Use Template
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-medium text-gray-400">Title:</label>
                                <p className="text-white text-sm">{template.title}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400">Message:</label>
                                <p className="text-gray-300 text-sm">{template.message.slice(0, 150)}...</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

export default AdminNotificationsSection;