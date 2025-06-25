// File Location: src/pages/Dashboard/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import UsersManagementSection from './UsersManagementSection';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
            const userData = JSON.parse(userDetails);
            setAdminName(userData.Username || "Administrator");
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                // Clear all stored data (following your exact pattern)
                localStorage.removeItem("token");
                localStorage.removeItem("userDetails");
                localStorage.removeItem("userRole");
                sessionStorage.clear();

                // Redirect to login page
                window.location.href = "/";
            } catch (error) {
                console.error("Logout error:", error);
                window.location.href = "/";
            }
        }
    };

    const renderActiveSection = () => {
        switch (activeTab) {
            case 'users':
                return <UsersManagementSection />;
            case 'appointments':
                return <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6"><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Appointments Management - Coming Soon</h2></div>;
            case 'medical-records':
                return <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6"><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Medical Records Management - Coming Soon</h2></div>;
            case 'notifications':
                return <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6"><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Notifications Management - Coming Soon</h2></div>;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 flex flex-col">
            {/* Header following your Patient/Doctor pattern */}
            <div className="text-center mb-4">
                <h5 className="text-2xl font-bold text-gray-800 dark:text-cyan-300 mb-1">
                    Welcome Admin, {adminName}! 👨‍💼
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hospital Management System - Administrative Control Panel
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'users', label: '👥 Users' },
                        { id: 'appointments', label: '📅 Appointments' },
                        { id: 'medical-records', label: '📋 Records' },
                        { id: 'notifications', label: '🔔 Notifications' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area - Following your grid pattern */}
            <div className="flex-1 min-h-0">
                {renderActiveSection()}
            </div>
        </div>
    );
};

// Dashboard Overview Component - No dummy data
const DashboardOverview = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 h-full min-h-0">
            {/* Quick Stats Cards */}
            <div className="lg:col-span-8 min-h-0">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">System Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* System stats will be populated from real API calls */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</p>
                                </div>
                                <div className="text-blue-600 dark:text-blue-400 text-2xl">👥</div>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Active Doctors</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</p>
                                </div>
                                <div className="text-green-600 dark:text-green-400 text-2xl">👨‍⚕️</div>
                            </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Patients</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</p>
                                </div>
                                <div className="text-purple-600 dark:text-purple-400 text-2xl">🏥</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 min-h-0">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 h-full">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors text-left">
                            <span className="text-lg mr-2">👥</span>
                            Manage Users
                        </button>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors text-left">
                            <span className="text-lg mr-2">📅</span>
                            View Appointments
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors text-left">
                            <span className="text-lg mr-2">📋</span>
                            Medical Records
                        </button>
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors text-left">
                            <span className="text-lg mr-2">🔔</span>
                            Notifications
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-12 min-h-0">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 h-full">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent System Activity</h3>
                    <div className="text-gray-600 dark:text-gray-400">
                        <p>Recent notifications and system updates will appear here...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;