// File: src/services/Patient/signalRService.js
import * as signalR from "@microsoft/signalr";

class PatientSignalRService {
    constructor() {
        this.connection = null;
        this.connectionStatus = 'Disconnected';
        this.statusCallbacks = [];
        this.notificationCallbacks = [];
    }

    // Get patient user details from localStorage
    getUserDetails() {
        try {
            const userDetails = localStorage.getItem("userDetails");
            const token = localStorage.getItem("token");

            if (!userDetails || !token) {
                return null;
            }

            const userData = JSON.parse(userDetails);
            return {
                userId: userData.userID,
                userRole: 'Patient', // Fixed role for patient
                patientId: userData.patientID || userData.PatientID,
                token: token,
                userData: userData
            };
        } catch (error) {
            console.error("Error getting patient user details:", error);
            return null;
        }
    }

    // Initialize SignalR connection for patient
    async initialize() {
        const userInfo = this.getUserDetails();

        if (!userInfo) {
            console.error("No patient information available for SignalR connection");
            return false;
        }

        try {
            console.log("=== INITIALIZING PATIENT SIGNALR CONNECTION ===");
            console.log("Patient User ID:", userInfo.userId);
            console.log("Patient ID:", userInfo.patientId);
            console.log("Patient Name:", userInfo.userData.firstName, userInfo.userData.lastName);

            // Create SignalR connection
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7195/notificationHub", {
                    accessTokenFactory: () => userInfo.token
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Set up event handlers
            this.setupEventHandlers();

            // Start connection
            await this.connection.start();
            console.log("🚀 Patient SignalR connection started successfully");

            // Join user group (will be patient_<userId>)
            await this.connection.invoke("JoinUserGroup");

            this.updateConnectionStatus('Connected');
            return true;

        } catch (error) {
            console.error("❌ Error starting patient SignalR connection:", error);
            this.updateConnectionStatus('Error');
            return false;
        }
    }

    // Setup event handlers
    setupEventHandlers() {
        if (!this.connection) return;

        // Connection events
        this.connection.on("JoinedGroup", (groupName) => {
            console.log("✅ Patient joined SignalR group:", groupName);
            this.updateConnectionStatus('Connected');
        });

        this.connection.on("Error", (error) => {
            console.error("❌ Patient SignalR error:", error);
            this.updateConnectionStatus('Error');
        });

        this.connection.onreconnecting(() => {
            console.log("🔄 Patient SignalR reconnecting...");
            this.updateConnectionStatus('Reconnecting');
        });

        this.connection.onreconnected(() => {
            console.log("✅ Patient SignalR reconnected");
            this.updateConnectionStatus('Connected');
        });

        this.connection.onclose((error) => {
            console.log("❌ Patient SignalR connection closed:", error);
            this.updateConnectionStatus('Disconnected');
        });

        // Notification events
        this.connection.on("ReceiveNotification", (notification) => {
            console.log("🔔 Patient notification received:", notification);
            this.handleNotification(notification);
        });
    }

    // Handle incoming notifications for patient
    handleNotification(notification) {
        // Show browser notification if permission granted
        this.showBrowserNotification(notification);

        // Play notification sound based on priority
        this.playNotificationSound(notification.Priority);

        // Transform notification for patient UI
        const transformedNotification = {
            Id: notification.Id,
            Title: notification.Title,
            Message: notification.Message,
            Icon: notification.Icon,
            Priority: notification.Priority,
            NotificationType: notification.Type,
            CreatedAt: notification.Time,
            IsRead: !notification.Unread,
            TimeAgo: this.getTimeAgo(new Date(notification.Time)),
            AppointmentToken: notification.Data?.AppointmentToken
        };

        // Notify all callbacks
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(transformedNotification);
            } catch (error) {
                console.error("Error in patient notification callback:", error);
            }
        });
    }

    // Show browser notification for patient
    showBrowserNotification(notification) {
        if (Notification.permission === "granted") {
            const title = notification.Title || "New Notification";
            const options = {
                body: notification.Message,
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                tag: `patient-notification-${notification.Id}`,
                requireInteraction: notification.Priority === 'urgent' || notification.Priority === 'high'
            };

            const browserNotification = new Notification(title, options);

            // Auto close after 5 seconds for normal notifications
            if (notification.Priority === 'normal') {
                setTimeout(() => browserNotification.close(), 5000);
            }

            // Handle click to focus window
            browserNotification.onclick = () => {
                window.focus();
                browserNotification.close();
            };
        } else if (Notification.permission === "default") {
            // Request permission if not already requested
            Notification.requestPermission();
        }
    }

    // Play notification sound based on priority
    playNotificationSound(priority = 'normal') {
        try {
            const audio = new Audio();

            switch (priority) {
                case 'urgent':
                    // Urgent - multiple beeps
                    audio.src = 'data:audio/wav;base64,UklGRnICAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU4CAABBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBTuS1/3YfCwELNzWzQpVmLyJ3Wy6dMqVjO9k';
                    audio.volume = 0.5;
                    break;
                case 'high':
                    // High priority - double beep
                    audio.src = 'data:audio/wav;base64,UklGRuACAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4';
                    audio.volume = 0.4;
                    break;
                default:
                    // Normal priority - single soft beep
                    audio.src = 'data:audio/wav;base64,UklGRuACAABXQVZFZm30IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAABBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBTuS1/3YfCwELNzWzQpVmLyJ3Wy6dMqVjO9k';
                    audio.volume = 0.3;
                    break;
            }

            audio.play().catch(e => console.log("Could not play patient notification sound:", e));
        } catch (error) {
            console.log("Error playing patient notification sound:", error);
        }
    }

    // Get time ago helper
    getTimeAgo(dateTime) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - dateTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return dateTime.toLocaleDateString();
    }

    // Update connection status
    updateConnectionStatus(status) {
        this.connectionStatus = status;
        console.log(`Patient SignalR status: ${status}`);

        this.statusCallbacks.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error("Error in patient status callback:", error);
            }
        });
    }

    // Subscribe to connection status changes
    onConnectionStatusChange(callback) {
        this.statusCallbacks.push(callback);
        // Return unsubscribe function
        return () => {
            const index = this.statusCallbacks.indexOf(callback);
            if (index > -1) {
                this.statusCallbacks.splice(index, 1);
            }
        };
    }

    // Subscribe to notifications
    onNotification(callback) {
        this.notificationCallbacks.push(callback);
        // Return unsubscribe function
        return () => {
            const index = this.notificationCallbacks.indexOf(callback);
            if (index > -1) {
                this.notificationCallbacks.splice(index, 1);
            }
        };
    }

    // Send test message
    async sendTestMessage(message) {
        if (!this.connection || this.connectionStatus !== 'Connected') {
            throw new Error('Patient SignalR connection not available');
        }

        try {
            await this.connection.invoke("SendTestMessage", `Patient: ${message}`);
        } catch (error) {
            console.error("Error sending test message:", error);
            throw error;
        }
    }

    // Get current connection status
    getConnectionStatus() {
        return this.connectionStatus;
    }

    // Stop connection
    async stop() {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log("Patient SignalR connection stopped");
            } catch (error) {
                console.error("Error stopping patient SignalR connection:", error);
            }
        }
    }

    // Check if connected
    isConnected() {
        return this.connectionStatus === 'Connected';
    }
}

// Create singleton instance for patient
const patientSignalRService = new PatientSignalRService();

// Request notification permission on load
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
        console.log("🔔 Patient notification permission:", permission);
    });
}

export { patientSignalRService };
export default patientSignalRService;