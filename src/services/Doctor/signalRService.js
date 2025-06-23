// File: src/services/Doctor/signalRService.js
import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = null;
        this.connectionStatus = 'Disconnected';
        this.statusCallbacks = [];
        this.notificationCallbacks = [];
    }

    // Get user details from localStorage
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
                userRole: userData.role || userData.Role,
                token: token,
                userData: userData
            };
        } catch (error) {
            console.error("Error getting user details:", error);
            return null;
        }
    }

    // Initialize SignalR connection
    async initialize() {
        const userInfo = this.getUserDetails();

        if (!userInfo) {
            console.error("No user information available for SignalR connection");
            return false;
        }

        try {
            // Create SignalR connection
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7195/notificationHub", {
                    accessTokenFactory: () => userInfo.token
                    // Removed skipNegotiation - let SignalR negotiate the best transport
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Set up event handlers
            this.setupEventHandlers();

            // Start connection
            await this.connection.start();
            console.log("🚀 SignalR connection started successfully");

            // Join user group
            await this.connection.invoke("JoinUserGroup");

            this.updateConnectionStatus('Connected');
            return true;

        } catch (error) {
            console.error("❌ Error starting SignalR connection:", error);
            this.updateConnectionStatus('Error');
            return false;
        }
    }

    // Setup event handlers
    setupEventHandlers() {
        if (!this.connection) return;

        // Connection events
        this.connection.on("JoinedGroup", (groupName) => {
            console.log("✅ Joined SignalR group:", groupName);
            this.updateConnectionStatus('Connected');
        });

        this.connection.on("Error", (error) => {
            console.error("❌ SignalR error:", error);
            this.updateConnectionStatus('Error');
        });

        this.connection.onreconnecting(() => {
            console.log("🔄 SignalR reconnecting...");
            this.updateConnectionStatus('Reconnecting');
        });

        this.connection.onreconnected(() => {
            console.log("✅ SignalR reconnected");
            this.updateConnectionStatus('Connected');
        });

        this.connection.onclose((error) => {
            console.log("❌ SignalR connection closed:", error);
            this.updateConnectionStatus('Disconnected');
        });

        // Notification events
        this.connection.on("ReceiveNotification", (notification) => {
            console.log("🔔 New notification received:", notification);
            this.handleNotification(notification);
        });
    }

    // Handle incoming notifications
    handleNotification(notification) {
        // Show browser notification if permission granted
        this.showBrowserNotification(notification);

        // Play notification sound
        this.playNotificationSound(notification.Priority);

        // Notify all callbacks
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(notification);
            } catch (error) {
                console.error("Error in notification callback:", error);
            }
        });
    }

    // Show browser notification
    showBrowserNotification(notification) {
        if (Notification.permission === "granted") {
            new Notification(notification.Title || "New Notification", {
                body: notification.Message,
                icon: "/favicon.ico",
                badge: "/favicon.ico"
            });
        } else if (Notification.permission === "default") {
            // Request permission if not already requested
            Notification.requestPermission();
        }
    }

    // Play notification sound
    playNotificationSound(priority = 'normal') {
        try {
            const audio = new Audio();

            switch (priority) {
                case 'urgent':
                case 'high':
                    // High priority sound
                    audio.src = 'data:audio/wav;base64,UklGRuACAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4';
                    break;
                default:
                    // Normal priority sound
                    audio.src = 'data:audio/wav;base64,UklGRuACAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4';
                    break;
            }

            audio.volume = 0.3;
            audio.play().catch(e => console.log("Could not play notification sound:", e));
        } catch (error) {
            console.log("Error playing notification sound:", error);
        }
    }

    // Update connection status
    updateConnectionStatus(status) {
        this.connectionStatus = status;
        this.statusCallbacks.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error("Error in status callback:", error);
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
            throw new Error('SignalR connection not available');
        }

        try {
            await this.connection.invoke("SendTestMessage", message);
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
                console.log("SignalR connection stopped");
            } catch (error) {
                console.error("Error stopping SignalR connection:", error);
            }
        }
    }

    // Check if connected
    isConnected() {
        return this.connectionStatus === 'Connected';
    }
}

// Create singleton instance
const signalRService = new SignalRService();

// Request notification permission on load
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
        console.log("🔔 Notification permission:", permission);
    });
}

export { signalRService };
export default signalRService;