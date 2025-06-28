// File Location: src/pages/Dashboard/Admin/AdminAppointmentsSection.jsx
import React, { useState, useEffect } from 'react';
import {
    getAllAppointments,
    getFilteredAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    getDoctorName,
    getPatientName
} from '../../../services/Admin/adminAppointmentApi';
import { getAllDoctors, getAllPatients } from '../../../services/Admin/adminUsersApi';

const AdminAppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        doctorId: "",
        patientId: "",
        status: "",
        date: "",
        searchTerm: ""
    });

    // Status options
    const statusOptions = ["", "Pending", "Accepted", "Completed", "Rejected"];

    // Format date and time
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

    // Get status styling consistent with app theme
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return {
                    bg: 'bg-gradient-to-br from-yellow-900/20 to-amber-900/10 dark:from-yellow-900/30 dark:to-amber-900/20',
                    text: 'text-yellow-600 dark:text-yellow-400',
                    badge: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/25',
                    border: 'border-yellow-500/30 dark:border-yellow-400/30',
                    icon: '⏳',
                    glow: 'hover:shadow-yellow-500/20'
                };
            case 'accepted':
                return {
                    bg: 'bg-gradient-to-br from-emerald-900/20 to-green-900/10 dark:from-emerald-900/30 dark:to-green-900/20',
                    text: 'text-emerald-600 dark:text-emerald-400',
                    badge: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25',
                    border: 'border-emerald-500/30 dark:border-emerald-400/30',
                    icon: '✅',
                    glow: 'hover:shadow-emerald-500/20'
                };
            case 'completed':
                return {
                    bg: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/10 dark:from-blue-900/30 dark:to-indigo-900/20',
                    text: 'text-blue-600 dark:text-blue-400',
                    badge: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
                    border: 'border-blue-500/30 dark:border-blue-400/30',
                    icon: '✔️',
                    glow: 'hover:shadow-blue-500/20'
                };
            case 'rejected':
                return {
                    bg: 'bg-gradient-to-br from-red-900/20 to-rose-900/10 dark:from-red-900/30 dark:to-rose-900/20',
                    text: 'text-red-600 dark:text-red-400',
                    badge: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25',
                    border: 'border-red-500/30 dark:border-red-400/30',
                    icon: '❌',
                    glow: 'hover:shadow-red-500/20'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-800/50 to-gray-700/30',
                    text: 'text-gray-600 dark:text-gray-400',
                    badge: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25',
                    border: 'border-gray-500/30 dark:border-gray-400/30',
                    icon: '❓',
                    glow: 'hover:shadow-gray-500/20'
                };
        }
    };

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Apply filters when filters change
    useEffect(() => {
        applyFilters();
    }, [appointments, filters]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError("");

            // Load appointments, doctors, and patients
            const [appointmentsData, doctorsData, patientsData] = await Promise.all([
                getAllAppointments(),
                getAllDoctors(),
                getAllPatients()
            ]);

            // Enhance appointments with doctor and patient names
            const enhancedAppointments = await Promise.all(
                appointmentsData.map(async (appointment) => {
                    try {
                        const [doctorName, patientName] = await Promise.all([
                            getDoctorName(appointment.doctorID),
                            getPatientName(appointment.patientID)
                        ]);

                        return {
                            ...appointment,
                            doctorName,
                            patientName,
                            id: appointment.token
                        };
                    } catch (error) {
                        console.error("Error enhancing appointment:", error);
                        return {
                            ...appointment,
                            doctorName: "Unknown Doctor",
                            patientName: "Unknown Patient",
                            id: appointment.token
                        };
                    }
                })
            );

            setAppointments(enhancedAppointments);
            setDoctors(doctorsData);
            setPatients(patientsData);

        } catch (err) {
            console.error("Error loading initial data:", err);
            setError("Failed to load appointments data");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...appointments];

        // Filter by doctor
        if (filters.doctorId) {
            filtered = filtered.filter(apt => apt.doctorID.toString() === filters.doctorId);
        }

        // Filter by patient
        if (filters.patientId) {
            filtered = filtered.filter(apt => apt.patientID.toString() === filters.patientId);
        }

        // Filter by status
        if (filters.status) {
            filtered = filtered.filter(apt =>
                apt.status?.toLowerCase() === filters.status.toLowerCase()
            );
        }

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(apt => {
                const appointmentDate = new Date(apt.dateTime).toISOString().split('T')[0];
                return appointmentDate === filters.date;
            });
        }

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(apt =>
                apt.patientName?.toLowerCase().includes(searchLower) ||
                apt.doctorName?.toLowerCase().includes(searchLower) ||
                apt.reason?.toLowerCase().includes(searchLower) ||
                apt.patientEmail?.toLowerCase().includes(searchLower) ||
                apt.patientPhone?.toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        setFilteredAppointments(filtered);
    };

    // Handle status update
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            setProcessing(appointmentId);
            await updateAppointmentStatus(appointmentId, newStatus);

            // Update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId
                        ? { ...apt, status: newStatus }
                        : apt
                )
            );

            alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
        } catch (error) {
            console.error("Error updating appointment status:", error);
            alert("Failed to update appointment status. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    // Handle appointment deletion
    const handleDeleteAppointment = async (appointmentId, patientName) => {
        if (window.confirm(`Are you sure you want to delete ${patientName}'s appointment? This action cannot be undone.`)) {
            try {
                setProcessing(appointmentId);
                await deleteAppointment(appointmentId);

                // Remove from local state
                setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));

                alert("Appointment deleted successfully!");
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Failed to delete appointment. Please try again.");
            } finally {
                setProcessing(null);
            }
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            doctorId: "",
            patientId: "",
            status: "",
            date: "",
            searchTerm: ""
        });
    };

    // Get statistics
    const getStats = () => {
        return {
            total: filteredAppointments.length,
            pending: filteredAppointments.filter(apt => apt.status?.toLowerCase() === 'pending').length,
            accepted: filteredAppointments.filter(apt => apt.status?.toLowerCase() === 'accepted').length,
            completed: filteredAppointments.filter(apt => apt.status?.toLowerCase() === 'completed').length,
            rejected: filteredAppointments.filter(apt => apt.status?.toLowerCase() === 'rejected').length
        };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 animate-pulse">
                        <span className="text-white text-2xl">📅</span>
                    </div>
                    <div className="text-gray-300 text-lg animate-pulse">Loading appointments data...</div>
                    <div className="flex justify-center space-x-1 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

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
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-slideIn { animation: slideIn 0.6s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.6s ease-out; }
                .animate-pulse-hover:hover { animation: pulse 0.3s ease-in-out; }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-hover">
                                <span className="text-white text-2xl">📅</span>
                            </div>
                            Appointments Management
                        </h2>
                        <p className="text-gray-400 ml-15">Manage all system appointments efficiently</p>
                    </div>

                    <div className="flex gap-3">
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
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                    {[
                        { label: 'Total', value: stats.total, color: 'from-blue-600 to-cyan-600', icon: '📊', bg: 'bg-blue-900/20' },
                        { label: 'Pending', value: stats.pending, color: 'from-yellow-600 to-amber-600', icon: '⏳', bg: 'bg-yellow-900/20' },
                        { label: 'Accepted', value: stats.accepted, color: 'from-emerald-600 to-green-600', icon: '✅', bg: 'bg-emerald-900/20' },
                        { label: 'Completed', value: stats.completed, color: 'from-blue-600 to-indigo-600', icon: '✔️', bg: 'bg-blue-900/20' },
                        { label: 'Rejected', value: stats.rejected, color: 'from-red-600 to-rose-600', icon: '❌', bg: 'bg-red-900/20' }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`${stat.bg} backdrop-blur-sm p-4 rounded-xl border border-gray-600 transition-all duration-300 hover:scale-105 hover:border-gray-500 animate-scaleIn`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse-hover`}>
                                <span className="text-white text-lg">{stat.icon}</span>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600 animate-slideIn">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm">🔍</span>
                    </div>
                    Filters & Search
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Search</label>
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Doctor</label>
                        <select
                            value={filters.doctorId}
                            onChange={(e) => setFilters({...filters, doctorId: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map(doctor => (
                                <option key={doctor.doctorID} value={doctor.doctorID}>
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Patient</label>
                        <select
                            value={filters.patientId}
                            onChange={(e) => setFilters({...filters, patientId: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">All Patients</option>
                            {patients.map(patient => (
                                <option key={patient.patientID} value={patient.patientID}>
                                    {patient.firstName} {patient.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">All Status</option>
                            {statusOptions.slice(1).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Date</label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600 transition-all duration-300"
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

            {/* Appointments List */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-hover">
                            <span className="text-white text-4xl">📅</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No appointments found</h3>
                        <p className="text-gray-400">
                            {filters.searchTerm || filters.doctorId || filters.patientId || filters.status || filters.date
                                ? "Try adjusting your filters"
                                : "Appointments will appear here"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm">📋</span>
                            </div>
                            Appointments List ({filteredAppointments.length})
                        </h3>

                        <div className="grid gap-4">
                            {filteredAppointments.map((appointment, index) => {
                                const statusStyle = getStatusStyle(appointment.status);
                                const dateTime = formatDateTime(appointment.dateTime);

                                return (
                                    <div
                                        key={appointment.id}
                                        className={`${statusStyle.bg} ${statusStyle.border} border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] ${statusStyle.glow} animate-fadeIn`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-xl">👤</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 dark:text-white text-lg">
                                                            {appointment.patientName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            with {appointment.doctorName}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle.badge}`}>
                                                        {statusStyle.icon} {appointment.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                                    <div className="space-y-2">
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-blue-500">🕒</span>
                                                            <span><strong>Date & Time:</strong> {dateTime.date} at {dateTime.time}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-green-500">📞</span>
                                                            <span><strong>Phone:</strong> {appointment.patientPhone || 'Not available'}</span>
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-indigo-500">📧</span>
                                                            <span><strong>Email:</strong> {appointment.patientEmail || 'Not available'}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-purple-500">🆔</span>
                                                            <span><strong>ID:</strong> {appointment.id}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 p-3 bg-gray-900/30 rounded-lg border border-gray-600">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        <strong className="text-purple-400">Reason:</strong> {appointment.reason}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[200px]">
                                                {appointment.status?.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'Accepted')}
                                                            disabled={processing === appointment.id}
                                                            className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                        >
                                                            <span>✅</span>
                                                            {processing === appointment.id ? 'Accepting...' : 'Accept'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'Rejected')}
                                                            disabled={processing === appointment.id}
                                                            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                        >
                                                            <span>❌</span>
                                                            {processing === appointment.id ? 'Rejecting...' : 'Reject'}
                                                        </button>
                                                    </>
                                                )}

                                                {appointment.status?.toLowerCase() === 'accepted' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
                                                        disabled={processing === appointment.id}
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                    >
                                                        <span>✔️</span>
                                                        {processing === appointment.id ? 'Completing...' : 'Mark Completed'}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setSelectedAppointment(appointment)}
                                                    className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                                                >
                                                    <span>👁️</span>
                                                    View Details
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteAppointment(appointment.id, appointment.patientName)}
                                                    disabled={processing === appointment.id}
                                                    className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                >
                                                    <span>🗑️</span>
                                                    Delete
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

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-xl">📋</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white">Appointment Details</h3>
                            </div>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                                    <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                        <span>👤</span> Patient Information
                                    </h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Name</label>
                                            <p className="text-white font-semibold">{selectedAppointment.patientName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Phone</label>
                                            <p className="text-white">{selectedAppointment.patientPhone || 'Not available'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Email</label>
                                            <p className="text-white">{selectedAppointment.patientEmail || 'Not available'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                                    <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                                        <span>👨‍⚕️</span> Doctor Information
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Doctor</label>
                                        <p className="text-white font-semibold">{selectedAppointment.doctorName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                                    <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                        <span>📅</span> Appointment Details
                                    </h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Date & Time</label>
                                            <p className="text-white font-semibold">
                                                {formatDateTime(selectedAppointment.dateTime).date} at {formatDateTime(selectedAppointment.dateTime).time}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Status</label>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(selectedAppointment.status).badge}`}>
                                                {getStatusStyle(selectedAppointment.status).icon} {selectedAppointment.status}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Appointment ID</label>
                                            <p className="text-gray-300 font-mono text-sm bg-gray-800 px-2 py-1 rounded">
                                                {selectedAppointment.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                                    <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                        <span>📝</span> Visit Reason
                                    </h4>
                                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <p className="text-white italic">"{selectedAppointment.reason}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointmentsSection;