// File: src/services/Patient/notificationApi.js
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

// Get user info for patient
const getUserInfo = () => {
    try {
        const userDetails = localStorage.getItem("userDetails");
        if (!userDetails) return null;

        const userData = JSON.parse(userDetails);
        return {
            userId: userData.userID,
            userRole: 'Patient', // Fixed role for patient
            patientId: userData.patientID || userData.PatientID,
            userData: userData
        };
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
};

// Patient Notification API Functions
export const patientNotificationApi = {
    // Get patient's notifications with real appointment data
    async getMyNotifications(filters = {}) {
        try {
            console.log("=== FETCHING PATIENT NOTIFICATIONS ===");

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

            console.log("Raw patient notifications response:", response.data);

            // Process and enhance notification data
            const enhancedNotifications = response.data.map(notification => {
                try {
                    // Parse structured notification data from Message field
                    const structuredData = JSON.parse(notification.Message);

                    // Extract appointment and doctor information
                    const additionalData = structuredData.AdditionalData || {};

                    return {
                        ...notification,
                        // Add parsed structured data
                        NotificationType: structuredData.Type || 'general',
                        Title: structuredData.Title || 'Notification',
                        Icon: structuredData.Icon || '📢',
                        Priority: structuredData.Priority || 'normal',
                        AppointmentToken: structuredData.AppointmentToken,
                        // Enhanced display information
                        DoctorName: additionalData.DoctorName || null,
                        PatientName: additionalData.PatientName || null,
                        AppointmentDateTime: additionalData.AppointmentDateTime || null,
                        NewStatus: additionalData.NewStatus || null,
                        OldStatus: additionalData.OldStatus || null,
                        Reason: additionalData.Reason || null,
                        // Keep structured data for detailed view
                        StructuredData: structuredData
                    };
                } catch (parseError) {
                    console.log("Non-JSON notification, treating as plain text:", notification.Message);
                    // Handle non-JSON notifications (legacy or simple notifications)
                    return {
                        ...notification,
                        NotificationType: 'general',
                        Title: 'Healthcare Notification',
                        Icon: '📢',
                        Priority: 'normal',
                        StructuredData: { Message: notification.Message, Type: 'general' }
                    };
                }
            });

            console.log("Enhanced patient notifications:", enhancedNotifications);
            return enhancedNotifications;
        } catch (error) {
            console.error('Error fetching patient notifications:', error);
            throw error;
        }
    },

    // Send test notification for patient
    async sendTestNotification(message = "Test notification from patient dashboard!") {
        try {
            const userInfo = getUserInfo();
            if (!userInfo) throw new Error("Patient user not found");

            console.log("Sending test notification for patient:", userInfo.userId);

            const response = await axios.post(`${API_BASE_URL}/test`, {
                userID: userInfo.userId,
                message: `🧪 ${message} (Patient: ${userInfo.userData.firstName})`
            }, {
                headers: getAuthHeaders()
            });

            console.log("Test notification sent successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending test notification:', error);
            throw error;
        }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            console.log("Marking notification as read:", notificationId);

            const response = await axios.post(`${API_BASE_URL}/mark-read`, {
                id: notificationId
            }, {
                headers: getAuthHeaders()
            });

            console.log("Notification marked as read:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    async markAllAsRead() {
        try {
            console.log("Marking all patient notifications as read");

            const response = await axios.post(`${API_BASE_URL}/mark-all-read`, {}, {
                headers: getAuthHeaders()
            });

            console.log("All notifications marked as read:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    // Clear all notifications
    async clearAllNotifications() {
        try {
            console.log("Clearing all patient notifications");

            const response = await axios.delete(`${API_BASE_URL}/clear-all`, {
                headers: getAuthHeaders()
            });

            console.log("All notifications cleared:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error clearing notifications:', error);
            throw error;
        }
    }
};

export default patientNotificationApi;