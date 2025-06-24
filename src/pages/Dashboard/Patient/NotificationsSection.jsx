// File: src/pages/Dashboard/Patient/NotificationsSection.jsx
import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { IoMdDocument } from "react-icons/io";

// Safe notification API - will work even if backend services aren't available
const safeNotificationApi = {
    async getMyNotifications() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found, returning empty notifications");
                return [];
            }

            const response = await fetch('https://localhost:7195/api/Notification/my-notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log("API not available or error, returning empty notifications");
                return [];
            }

            const data = await response.json();
            console.log("Successfully fetched notifications:", data);
            return data || [];
        } catch (error) {
            console.log("Error fetching notifications, returning empty array:", error.message);
            return [];
        }
    }
};

const NotificationsSection = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notifications safely
    const fetchNotifications = async () => {
        try {
            console.log("=== FETCHING PATIENT NOTIFICATIONS (SAFE MODE) ===");
            await safeNotificationApi.getMyNotifications();
            setError(null);
        } catch (error) {
            console.error("Error in fetchNotifications:", error);
            setError("Unable to load notifications");
        }
    };

    // Initialize notifications
    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                setLoading(true);
                await fetchNotifications();
            } catch (error) {
                console.error("Error initializing notifications:", error);
                setError("Failed to initialize notifications");
            } finally {
                setLoading(false);
            }
        };

        initializeNotifications();

        // Auto-refresh every 2 minutes
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <FaBell className="text-blue-600 dark:text-blue-300" />
                        </div>
                        Notifications
                    </h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <FaBell className="text-blue-600 dark:text-blue-300" />
                        </div>
                        Notifications
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mb-2">
                        <FaTimes className="text-lg text-red-500 dark:text-red-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Connection Error</p>
                    <button
                        onClick={fetchNotifications}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <FaBell className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Notifications
                </h2>
            </div>

            {/* Empty State */}
            <div className="overflow-y-auto flex-1 custom-scroll group-hover:scroll-visible pr-2">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-3">
                        <IoMdDocument className="text-xl text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        No Notifications
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                        You're all caught up! New notifications will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSection;