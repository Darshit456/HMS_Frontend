// File Location: src/pages/Dashboard/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import UsersManagementSection from './UsersManagementSection';
import AdminAppointmentsSection from './AdminAppointmentsSection';
import AdminMedicalRecordsSection from './AdminMedicalRecordsSection';
import AdminNotificationsSection from './AdminNotificationsSection';
import {getAllAdmins, getAllDoctors, getAllPatients} from '../../../services/Admin/adminUsersApi';
import { getAdminProfile } from '../../../services/Admin/adminApi';
import { getAppointmentStats } from '../../../services/Admin/adminAppointmentApi';

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
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: "",
        email: ""
    });
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

    useEffect(() => {
        loadAdminData();
        loadSystemStats();
    }, []);

    const loadAdminData = async () => {
        try {
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
            const [doctorsData, patientsData, adminData, appointmentStats] = await Promise.all([
                getAllDoctors(),
                getAllPatients(),
                getAllAdmins(),
                getAppointmentStats()
            ]);

            setSystemStats({
                totalDoctors: doctorsData.length || 0,
                totalPatients: patientsData.length || 0,
                totalUsers: (doctorsData.length || 0) + (patientsData.length || 0) + (adminData.length || 0),
                totalAppointments: appointmentStats.total || 0,
                totalAdmins: adminData.length || 0,
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

    const handleEditProfile = () => {
        setEditFormData({
            username: adminData.username,
            email: adminData.email
        });
        setShowEditProfile(true);
    };

    const handleSaveProfile = async () => {
        try {
            setProfileUpdateLoading(true);

            const updatedData = {
                ...adminData,
                username: editFormData.username,
                email: editFormData.email
            };

            localStorage.setItem("userDetails", JSON.stringify(updatedData));
            setAdminData(updatedData);
            setShowEditProfile(false);

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setProfileUpdateLoading(false);
        }
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'users':
                return <UsersManagementSection />;
            case 'appointments':
                return <AdminAppointmentsSection />;
            case 'medical-records':
                return <AdminMedicalRecordsSection />;
            case 'notifications':
                return <AdminNotificationsSection />;
            default:
                return <DashboardOverview onQuickAction={handleQuickAction} systemStats={systemStats} />;
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-2 sm:p-4 flex flex-col relative">
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

            {/* Logout Button in Corner */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                    title="Logout"
                >
                    <span>🚪</span> Logout
                </button>
            </div>

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
                <div className="w-full lg:w-72 flex-shrink-0 animate-slideIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-4 h-full border border-gray-700 flex flex-col">
                        {/* Profile Header */}
                        <div className="text-center mb-4">
                            <div className="relative inline-block">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-hover mx-auto mb-3">
                                    <span className="text-white text-2xl">👨‍💼</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-white">{adminData.username}</h4>
                            <p className="text-sm text-purple-400">System Administrator</p>
                        </div>

                        {/* Admin Details - Flexible content area */}
                        <div className="flex-1 space-y-3 mb-4">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <span className="text-purple-400">📧</span>
                                    <span className="truncate">{adminData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                                    <span className="text-blue-400">🆔</span>
                                    <span>ID: {adminData.userId}</span>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <span className="text-green-400">🛡️</span>
                                    <span>Full System Access</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                                    <span className="text-yellow-400">⭐</span>
                                    <span>Super Admin Privileges</span>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-2">Last Login</div>
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <span className="text-cyan-400">🕐</span>
                                    <span>{adminData.loginTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                                    <span className="text-cyan-400">📅</span>
                                    <span>{adminData.loginDate}</span>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-900/30 rounded-lg p-3 text-center">
                                    <div className="text-blue-400 text-sm">Active</div>
                                    <div className="text-white font-bold">24/7</div>
                                </div>
                                <div className="bg-purple-900/30 rounded-lg p-3 text-center">
                                    <div className="text-purple-400 text-sm">Session</div>
                                    <div className="text-white font-bold">Secure</div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Actions - Only Edit Profile */}
                        <div className="space-y-3">
                            <button
                                onClick={handleEditProfile}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg font-medium"
                            >
                                <span>✏️</span> Edit Profile
                            </button>
                        </div>
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

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-600">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">✏️</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                            </div>
                            <button
                                onClick={() => setShowEditProfile(false)}
                                className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={editFormData.username}
                                    onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={profileUpdateLoading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {profileUpdateLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditProfile(false)}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
            description: 'Access and manage patient medical records',
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
            {/* Enhanced Hospital Logo and Title */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-700 animate-fadeIn relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-cyan-500/50">
                            <span className="text-4xl animate-pulse">🏥</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <span className="text-xs text-white font-bold">✓</span>
                        </div>
                    </div>

                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                            Hospital Management System
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <p className="text-lg text-gray-300 font-medium">Administrative Control Center</p>
                            <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-300 text-sm font-medium">Online</span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="text-cyan-400">🔧</span>
                                <span>Version 2.0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-indigo-400">⚡</span>
                                <span>High Performance</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-blue-400">🛡️</span>
                                <span>Secure Platform</span>
                            </div>
                        </div>
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
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                            <span className="text-2xl relative z-10">{action.icon}</span>
                            <div className="relative z-10">
                                <div className="font-semibold">{action.title}</div>
                                <div className="text-sm opacity-90">{action.description}</div>
                            </div>

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <span className="text-xl">→</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;