// File: src/services/Doctor/notificationApi.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7195/api/Notification';

// Get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Get user info
const getUserInfo = () => {
    try {
        const userDetails = localStorage.getItem("userDetails");
        if (!userDetails) return null;

        const userData = JSON.parse(userDetails);
        return {
            userId: userData.userID,
            userRole: userData.role || userData.Role,
            userData: userData
        };
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
};

// API Functions
export const notificationApi = {
    // Get user's notifications
    async getMyNotifications(filters = {}) {
        try {
            const response = await axios.get(`${API_BASE_URL}/my-notifications`, {
                headers: getAuthHeaders(),
                params: {
                    page: filters.page || 1,
                    pageSize: filters.pageSize || 50,
                    isRead: filters.isRead,
                    fromDate: filters.fromDate,
                    toDate: filters.toDate
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Send test notification
    async sendTestNotification(message = "Test notification from dashboard!") {
        try {
            const userInfo = getUserInfo();
            if (!userInfo) throw new Error("User not found");

            const response = await axios.post(`${API_BASE_URL}/test`, {
                userID: userInfo.userId,
                message: `🧪 ${message}`
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error sending test notification:', error);
            throw error;
        }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/mark-read`, {
                id: notificationId
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    async markAllAsRead() {
        try {
            const response = await axios.post(`${API_BASE_URL}/mark-all-read`, {}, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    // Clear all notifications
    async clearAllNotifications() {
        try {
            const response = await axios.delete(`${API_BASE_URL}/clear-all`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error clearing notifications:', error);
            throw error;
        }
    },

    // Send appointment notification (for testing)
    async sendAppointmentNotification(appointmentId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/send-appointment-notification`,
                appointmentId,
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending appointment notification:', error);
            throw error;
        }
    },

    // Send status change notification (for testing)
    async sendStatusChangeNotification(appointmentId, newStatus, oldStatus) {
        try {
            const response = await axios.post(`${API_BASE_URL}/send-status-change`, {
                appointmentId,
                newStatus,
                oldStatus
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error sending status change notification:', error);
            throw error;
        }
    }
};

export default notificationApi;