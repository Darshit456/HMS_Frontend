// File Location: src/pages/Dashboard/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import UsersManagementSection from './UsersManagementSection';
import { getAllDoctors, getAllPatients } from '../../../services/Admin/adminUsersApi';
import { getAdminProfile } from '../../../services/Admin/adminApi';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [adminData, setAdminData] = useState({
        username: "Administrator",
        email: "",
        userId: "",
        loginTime: new Date().toLocaleTimeString(),
        loginDate: new Date().toLocaleDateString()
    });
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalAdmins: 0,
        loading: true
    });

    useEffect(() => {
        // Load admin data
        loadAdminData();

        // Load system statistics
        loadSystemStats();
    }, []);

    const loadAdminData = async () => {
        try {
            // Try to get from localStorage first (following pattern of doctor/patient)
            const response = await getAdminProfile();
            if (response.data) {
                setAdminData({
                    username: response.data.username || response.data.Username || "Administrator",
                    email: response.data.email || response.data.Email || "admin@hospital.com",
                    userId: response.data.userID || response.data.UserID || "ADM001",
                    loginTime: new Date().toLocaleTimeString(),
                    loginDate: new Date().toLocaleDateString()
                });
            }
        } catch (error) {
            console.error("Error loading admin data:", error);
            // Fallback to basic admin info
            setAdminData({
                username: "Administrator",
                email: "admin@hospital.com",
                userId: "ADM001",
                loginTime: new Date().toLocaleTimeString(),
                loginDate: new Date().toLocaleDateString()
            });
        }
    };

    const loadSystemStats = async () => {
        try {
            const [doctorsData, patientsData] = await Promise.all([
                getAllDoctors(),
                getAllPatients()
            ]);

            // Count admins from users (assuming all non-doctor, non-patient users are admins)
            const totalAdmins = 1; // For now, we'll update this when we have an API to get all admins

            setSystemStats({
                totalDoctors: doctorsData.length || 0,
                totalPatients: patientsData.length || 0,
                totalUsers: (doctorsData.length || 0) + (patientsData.length || 0) + totalAdmins,
                totalAppointments: 0, // Will be loaded when appointment API is implemented
                totalAdmins: totalAdmins,
                loading: false
            });
        } catch (error) {
            console.error("Error loading system stats:", error);
            setSystemStats(prev => ({ ...prev, loading: false }));
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("userDetails");
                localStorage.removeItem("userRole");
                sessionStorage.clear();
                window.location.href = "/";
            } catch (error) {
                console.error("Logout error:", error);
                window.location.href = "/";
            }
        }
    };

    const handleQuickAction = (section) => {
        setActiveSection(section);
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'users':
                return <UsersManagementSection />;
            case 'appointments':
                return (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Appointments Management - Coming Soon
                        </h2>
                    </div>
                );
            case 'medical-records':
                return (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Medical Records Management - Coming Soon
                        </h2>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Notifications Management - Coming Soon
                        </h2>
                    </div>
                );
            default:
                return <DashboardOverview onQuickAction={handleQuickAction} systemStats={systemStats} />;
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-2 sm:p-4 flex flex-col">
            {/* Add custom animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-slideIn { animation: slideIn 0.5s ease-out; }
                .animate-pulse-hover:hover { animation: pulse 0.3s ease-in-out; }
            `}</style>

            {/* Header */}
            <div className="text-center mb-4 animate-fadeIn">
                <h5 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    Welcome Admin! 👨‍💼
                </h5>
                <p className="text-sm text-gray-400">
                    Hospital Management System - Control Center
                </p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
                {/* Left Side - Admin Profile Box */}
                <div className="w-full lg:w-80 flex-shrink-0 animate-slideIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-4 sm:p-6 h-full border border-gray-700">
                        {/* Profile Header */}
                        <div className="text-center mb-4">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-hover mx-auto mb-3">
                                    <span className="text-white text-3xl">👨‍💼</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-white">{adminData.username}</h4>
                            <p className="text-sm text-purple-400">System Administrator</p>
                        </div>

                        {/* Admin Details */}
                        <div className="space-y-3 mb-4">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-300 mb-1">
                                    <span className="text-purple-400">📧</span>
                                    <span className="text-sm truncate">{adminData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-blue-400">🆔</span>
                                    <span className="text-sm">ID: {adminData.userId}</span>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-300 mb-1">
                                    <span className="text-green-400">🛡️</span>
                                    <span className="text-sm">Full System Access</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="text-sm">Super Admin Privileges</span>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-1">Last Login</div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-cyan-400">🕐</span>
                                    <span className="text-sm">{adminData.loginTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-cyan-400">📅</span>
                                    <span className="text-sm">{adminData.loginDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-blue-900/30 rounded-lg p-2 text-center">
                                <div className="text-blue-400 text-sm">Active</div>
                                <div className="text-white font-bold">24/7</div>
                            </div>
                            <div className="bg-purple-900/30 rounded-lg p-2 text-center">
                                <div className="text-purple-400 text-sm">Session</div>
                                <div className="text-white font-bold">Secure</div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </div>

                {/* Right Side - Main Content */}
                <div className="flex-1 min-h-0 overflow-auto">
                    {activeSection === 'dashboard' ? (
                        <DashboardOverview
                            onQuickAction={handleQuickAction}
                            systemStats={systemStats}
                        />
                    ) : (
                        <div className="flex-1 min-h-0 overflow-auto">
                            <button
                                onClick={() => setActiveSection('dashboard')}
                                className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
                            >
                                ← Back to Dashboard
                            </button>
                            {renderActiveSection()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ onQuickAction, systemStats }) => {
    const statsCards = [
        {
            title: "Total Users",
            value: systemStats.totalUsers,
            icon: "👥",
            color: "from-blue-500 to-cyan-600",
            bgColor: "from-blue-500/20 to-cyan-600/20",
            shadowColor: "shadow-blue-500/25"
        },
        {
            title: "Active Doctors",
            value: systemStats.totalDoctors,
            icon: "👨‍⚕️",
            color: "from-emerald-500 to-teal-600",
            bgColor: "from-emerald-500/20 to-teal-600/20",
            shadowColor: "shadow-emerald-500/25"
        },
        {
            title: "Total Patients",
            value: systemStats.totalPatients,
            icon: "🏥",
            color: "from-purple-500 to-pink-600",
            bgColor: "from-purple-500/20 to-pink-600/20",
            shadowColor: "shadow-purple-500/25"
        },
        {
            title: "Appointments",
            value: systemStats.totalAppointments,
            icon: "📅",
            color: "from-amber-500 to-orange-600",
            bgColor: "from-amber-500/20 to-orange-600/20",
            shadowColor: "shadow-amber-500/25"
        },
        {
            title: "System Admins",
            value: systemStats.totalAdmins,
            icon: "🛡️",
            color: "from-rose-500 to-red-600",
            bgColor: "from-rose-500/20 to-red-600/20",
            shadowColor: "shadow-rose-500/25"
        }
    ];

    const quickActions = [
        {
            id: 'users',
            title: 'Manage Users',
            description: 'View and manage doctors, patients, and admins',
            icon: '👥',
            color: 'from-blue-500 to-cyan-600',
            hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
            shadowColor: 'hover:shadow-blue-500/50'
        },
        {
            id: 'appointments',
            title: 'View Appointments',
            description: 'Manage all system appointments',
            icon: '📅',
            color: 'from-emerald-500 to-teal-600',
            hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
            shadowColor: 'hover:shadow-emerald-500/50'
        },
        {
            id: 'medical-records',
            title: 'Medical Records',
            description: 'Access and manage patient records',
            icon: '📋',
            color: 'from-purple-500 to-pink-600',
            hoverColor: 'hover:from-purple-600 hover:to-pink-700',
            shadowColor: 'hover:shadow-purple-500/50'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Send and manage system notifications',
            icon: '🔔',
            color: 'from-amber-500 to-orange-600',
            hoverColor: 'hover:from-amber-600 hover:to-orange-700',
            shadowColor: 'hover:shadow-amber-500/50'
        }
    ];

    return (
        <div className="space-y-4">
            {/* Hospital Logo and Title */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm shadow-xl rounded-2xl p-4 border border-gray-700 animate-fadeIn">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <span className="text-3xl">🏥</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Hospital Management System
                        </h1>
                        <p className="text-gray-400 text-sm">Administrative Control Center</p>
                    </div>
                </div>
            </div>

            {/* System Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-700 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-white text-sm">📊</span>
                    </div>
                    System Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    {statsCards.map((stat, index) => (
                        <div
                            key={stat.title}
                            className={`relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fadeIn overflow-hidden group`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background decoration */}
                            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs sm:text-sm font-medium">{stat.title}</p>
                                    {systemStats.loading ? (
                                        <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mt-1"></div>
                                    ) : (
                                        <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                    )}
                                </div>
                                <div className={`text-2xl sm:text-3xl bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white shadow-lg ${stat.shadowColor}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-700 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="text-white text-sm">⚡</span>
                    </div>
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                        <button
                            key={action.id}
                            onClick={() => onQuickAction(action.id)}
                            className={`relative bg-gradient-to-r ${action.color} ${action.hoverColor} text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${action.shadowColor} text-left flex items-start gap-3 animate-fadeIn overflow-hidden group`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background animation */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                            <span className="text-2xl relative z-10">{action.icon}</span>
                            <div className="relative z-10">
                                <div className="font-semibold">{action.title}</div>
                                <div className="text-sm opacity-90">{action.description}</div>
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <span className="text-xl">→</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-700 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <span className="text-white text-sm">🕐</span>
                    </div>
                    Recent System Activity
                </h3>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl"></div>
                    <div className="relative text-center py-8">
                        <div className="text-gray-500 text-6xl mb-4 animate-pulse">📊</div>
                        <p className="text-gray-400">Activity logs will appear here</p>
                        <p className="text-gray-500 text-sm mt-2">System monitoring active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;