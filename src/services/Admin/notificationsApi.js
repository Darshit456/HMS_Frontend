// File Location: src/services/Admin/notificationsApi.js

// Dummy notification data
let notificationsData = [
    {
        id: 1,
        title: "System Maintenance Scheduled",
        message: "The hospital management system will undergo scheduled maintenance on Sunday, July 7th from 2:00 AM to 6:00 AM. Please complete all critical tasks before this time.",
        type: "System Alert",
        priority: "High",
        recipient: "All Users",
        recipientType: "all",
        deliveryMethod: ["Email", "In-app"],
        status: "Sent",
        createdAt: "2025-06-25T10:30:00Z",
        sentAt: "2025-06-25T10:35:00Z",
        scheduledFor: null,
        readCount: 45,
        totalRecipients: 67,
        createdBy: "Admin"
    },
    {
        id: 2,
        title: "New COVID-19 Safety Protocols",
        message: "Updated safety protocols are now in effect. All staff must wear N95 masks in patient areas and follow enhanced sanitization procedures.",
        type: "Medical Update",
        priority: "Urgent",
        recipient: "All Doctors",
        recipientType: "doctors",
        deliveryMethod: ["Email", "SMS", "In-app"],
        status: "Sent",
        createdAt: "2025-06-24T14:15:00Z",
        sentAt: "2025-06-24T14:20:00Z",
        scheduledFor: null,
        readCount: 23,
        totalRecipients: 25,
        createdBy: "Admin"
    },
    {
        id: 3,
        title: "Appointment Reminder System Update",
        message: "We've improved our appointment reminder system. Patients will now receive reminders 24 hours and 2 hours before their scheduled appointments.",
        type: "General Announcement",
        priority: "Medium",
        recipient: "All Staff",
        recipientType: "all",
        deliveryMethod: ["Email", "In-app"],
        status: "Sent",
        createdAt: "2025-06-23T09:45:00Z",
        sentAt: "2025-06-23T09:50:00Z",
        scheduledFor: null,
        readCount: 56,
        totalRecipients: 67,
        createdBy: "Admin"
    },
    {
        id: 4,
        title: "Emergency Contact Information Update",
        message: "Please update your emergency contact information in your profile. This is mandatory for all staff members and must be completed by July 15th, 2025.",
        type: "System Alert",
        priority: "High",
        recipient: "All Doctors",
        recipientType: "doctors",
        deliveryMethod: ["Email", "In-app"],
        status: "Scheduled",
        createdAt: "2025-06-22T16:20:00Z",
        sentAt: null,
        scheduledFor: "2025-07-01T08:00:00Z",
        readCount: 0,
        totalRecipients: 25,
        createdBy: "Admin"
    },
    {
        id: 5,
        title: "Patient Portal Maintenance",
        message: "The patient portal will be temporarily unavailable tomorrow from 12:00 AM to 3:00 AM for routine maintenance.",
        type: "System Alert",
        priority: "Medium",
        recipient: "All Patients",
        recipientType: "patients",
        deliveryMethod: ["Email", "SMS"],
        status: "Draft",
        createdAt: "2025-06-21T11:30:00Z",
        sentAt: null,
        scheduledFor: null,
        readCount: 0,
        totalRecipients: 150,
        createdBy: "Admin"
    }
];

// Message templates
export const messageTemplates = [
    {
        id: 1,
        name: "System Maintenance",
        category: "System Alert",
        title: "Scheduled System Maintenance",
        message: "The hospital management system will undergo scheduled maintenance on [DATE] from [START_TIME] to [END_TIME]. Please complete all critical tasks before this time."
    },
    {
        id: 2,
        name: "Appointment Reminder",
        category: "Appointment",
        title: "Upcoming Appointment Reminder",
        message: "This is a reminder that you have an appointment scheduled for [DATE] at [TIME] with [DOCTOR]. Please arrive 15 minutes early."
    },
    {
        id: 3,
        name: "Policy Update",
        category: "General Announcement",
        title: "Important Policy Update",
        message: "We have updated our [POLICY_NAME] policy. Please review the changes in the staff portal and acknowledge receipt by [DEADLINE]."
    },
    {
        id: 4,
        name: "Emergency Alert",
        category: "Emergency",
        title: "Emergency Notification",
        message: "ATTENTION: [EMERGENCY_TYPE] alert. Please follow emergency protocols and report to your designated stations immediately."
    }
];

// Utility function to generate IDs
const generateId = () => Math.max(...notificationsData.map(n => n.id), 0) + 1;

// Get all notifications
export const getAllNotifications = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const sortedNotifications = [...notificationsData].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        return sortedNotifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Get notification statistics
export const getNotificationStats = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const today = now.toDateString();

        const stats = {
            total: notificationsData.length,
            sent: notificationsData.filter(n => n.status === 'Sent').length,
            scheduled: notificationsData.filter(n => n.status === 'Scheduled').length,
            draft: notificationsData.filter(n => n.status === 'Draft').length,
            thisMonth: notificationsData.filter(n => {
                const nDate = new Date(n.createdAt);
                return nDate.getMonth() === thisMonth && nDate.getFullYear() === thisYear;
            }).length,
            thisWeek: notificationsData.filter(n =>
                new Date(n.createdAt) >= thisWeek
            ).length,
            today: notificationsData.filter(n =>
                new Date(n.createdAt).toDateString() === today
            ).length,
            totalRecipients: notificationsData.reduce((sum, n) => sum + (n.totalRecipients || 0), 0),
            totalReads: notificationsData.reduce((sum, n) => sum + (n.readCount || 0), 0)
        };

        return stats;
    } catch (error) {
        console.error("Error fetching notification statistics:", error);
        throw error;
    }
};

// Send notification
export const sendNotification = async (notificationData) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newNotification = {
            id: generateId(),
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            priority: notificationData.priority,
            recipient: notificationData.recipient,
            recipientType: notificationData.recipientType,
            deliveryMethod: notificationData.deliveryMethod,
            status: notificationData.scheduleFor ? 'Scheduled' : 'Sent',
            createdAt: new Date().toISOString(),
            sentAt: notificationData.scheduleFor ? null : new Date().toISOString(),
            scheduledFor: notificationData.scheduleFor || null,
            readCount: 0,
            totalRecipients: notificationData.totalRecipients || getRecipientCount(notificationData.recipientType),
            createdBy: "Admin"
        };

        notificationsData.unshift(newNotification);
        return newNotification;
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
};

// Update notification
export const updateNotification = async (notificationId, updateData) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const index = notificationsData.findIndex(n => n.id === notificationId);
        if (index === -1) {
            throw new Error("Notification not found");
        }

        notificationsData[index] = {
            ...notificationsData[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        return notificationsData[index];
    } catch (error) {
        console.error("Error updating notification:", error);
        throw error;
    }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const index = notificationsData.findIndex(n => n.id === notificationId);
        if (index === -1) {
            throw new Error("Notification not found");
        }

        const deletedNotification = notificationsData.splice(index, 1)[0];
        return deletedNotification;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};

// Get filtered notifications
export const getFilteredNotifications = async (filters = {}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...notificationsData];

        if (filters.recipientType && filters.recipientType !== 'all') {
            filtered = filtered.filter(n => n.recipientType === filters.recipientType);
        }

        if (filters.status) {
            filtered = filtered.filter(n => n.status === filters.status);
        }

        if (filters.priority) {
            filtered = filtered.filter(n => n.priority === filters.priority);
        }

        if (filters.type) {
            filtered = filtered.filter(n => n.type === filters.type);
        }

        if (filters.date) {
            filtered = filtered.filter(n => {
                const nDate = new Date(n.createdAt).toISOString().split('T')[0];
                return nDate === filters.date;
            });
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(searchLower) ||
                n.message.toLowerCase().includes(searchLower) ||
                n.recipient.toLowerCase().includes(searchLower) ||
                n.type.toLowerCase().includes(searchLower)
            );
        }

        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filtered;
    } catch (error) {
        console.error("Error fetching filtered notifications:", error);
        throw error;
    }
};

// Helper function to get recipient count
const getRecipientCount = (recipientType) => {
    switch (recipientType) {
        case 'doctors': return 25;
        case 'patients': return 150;
        case 'admins': return 5;
        case 'all': return 180;
        default: return 1;
    }
};

// Get recipient options
export const getRecipientOptions = () => {
    return [
        { value: 'all', label: 'All Users', count: 180 },
        { value: 'doctors', label: 'All Doctors', count: 25 },
        { value: 'patients', label: 'All Patients', count: 150 },
        { value: 'admins', label: 'All Administrators', count: 5 }
    ];
};

// Get notification types
export const getNotificationTypes = () => {
    return [
        'System Alert',
        'Medical Update',
        'General Announcement',
        'System Update',
        'Emergency',
        'Training',
        'Appointment',
        'Policy Update'
    ];
};

// Get priority levels
export const getPriorityLevels = () => {
    return [
        { value: 'Low', color: 'blue', icon: '📘' },
        { value: 'Medium', color: 'yellow', icon: '📙' },
        { value: 'High', color: 'orange', icon: '📒' },
        { value: 'Urgent', color: 'red', icon: '📕' }
    ];
};

// Get delivery methods
export const getDeliveryMethods = () => {
    return [
        { value: 'Email', icon: '📧' },
        { value: 'SMS', icon: '📱' },
        { value: 'In-app', icon: '🔔' }
    ];
};

export default {
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
};