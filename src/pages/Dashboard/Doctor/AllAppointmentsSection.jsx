import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaClock, FaSearch, FaFilter, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { getDoctorAppointments } from "../../../services/Doctor/doctorAppointmentApi.js";
import { updateAppointmentStatus } from "../../../services/Doctor/patientRequestsApi.js";

const AllAppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [processing, setProcessing] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Status options for filtering
    const statusOptions = ["All", "Pending", "Accepted", "Completed", "Rejected"];

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

    // Get status styling
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return {
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    text: 'text-yellow-800 dark:text-yellow-300',
                    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                    icon: '⏳'
                };
            case 'accepted':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    text: 'text-green-800 dark:text-green-300',
                    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                    icon: '✅'
                };
            case 'completed':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-800 dark:text-blue-300',
                    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                    icon: '✔️'
                };
            case 'rejected':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    text: 'text-red-800 dark:text-red-300',
                    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    icon: '❌'
                };
            default:
                return {
                    bg: 'bg-gray-50 dark:bg-gray-900/20',
                    text: 'text-gray-800 dark:text-gray-300',
                    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
                    icon: '❓'
                };
        }
    };

    // Update appointment status
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

    // Filter and search appointments
    useEffect(() => {
        let filtered = appointments;

        // Filter by status
        if (filterStatus !== "All") {
            filtered = filtered.filter(apt =>
                apt.status?.toLowerCase() === filterStatus.toLowerCase()
            );
        }

        // Search by patient name, email, or reason
        if (searchTerm) {
            filtered = filtered.filter(apt =>
                apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        setFilteredAppointments(filtered);
    }, [appointments, filterStatus, searchTerm]);

    // Fetch all appointments
    const fetchAllAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("=== FETCHING ALL DOCTOR APPOINTMENTS ===");

            const allAppointments = await getDoctorAppointments();
            console.log("All appointments response:", allAppointments);

            // Transform appointments for display
            const transformedAppointments = allAppointments.map((appointment, index) => ({
                id: appointment.token || index,
                appointmentId: appointment.token,
                patientName: appointment.patientName || 'Unknown Patient',
                patientPhone: appointment.patientPhone || 'Phone not available',
                patientEmail: appointment.patientEmail || 'Email not available',
                dateTime: appointment.dateTime,
                reason: appointment.reason || 'No reason specified',
                status: appointment.status || 'Unknown',
                patientID: appointment.patientID
            }));

            console.log("Transformed appointments:", transformedAppointments);
            setAppointments(transformedAppointments);

        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError(`Error loading appointments: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAppointments();
    }, []);

    // Get appointment count by status
    const getStatusCounts = () => {
        const counts = {
            total: appointments.length,
            pending: appointments.filter(apt => apt.status?.toLowerCase() === 'pending').length,
            accepted: appointments.filter(apt => apt.status?.toLowerCase() === 'accepted').length,
            completed: appointments.filter(apt => apt.status?.toLowerCase() === 'completed').length,
            rejected: appointments.filter(apt => apt.status?.toLowerCase() === 'rejected').length
        };
        return counts;
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaCalendarAlt className="text-blue-500" /> All Appointments
                </h2>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">Loading appointments...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaCalendarAlt className="text-blue-500" /> All Appointments
                </h2>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-red-500 text-center">{error}</div>
                    <button
                        onClick={fetchAllAppointments}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
            {/* Header with Stats */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                        <FaCalendarAlt className="text-blue-500" /> All Appointments
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {statusCounts.total}
                        </span>
                    </h2>
                    <button
                        onClick={fetchAllAppointments}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {statusCounts.pending}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {statusCounts.accepted}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Accepted</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {statusCounts.completed}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {statusCounts.rejected}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Rejected</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-8 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="flex-1 overflow-y-auto custom-scroll">
                {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4 opacity-50">📅</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">
                            {searchTerm || filterStatus !== "All" ? "No appointments found" : "No appointments yet"}
                        </h3>
                        <p className="text-sm text-center">
                            {searchTerm || filterStatus !== "All"
                                ? "Try adjusting your search or filter criteria"
                                : "Appointments will appear here when patients book with you"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAppointments.map((appointment) => {
                            const statusStyle = getStatusStyle(appointment.status);
                            const dateTime = formatDateTime(appointment.dateTime);

                            return (
                                <div
                                    key={appointment.id}
                                    className={`${statusStyle.bg} rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md`}
                                >
                                    {/* Appointment Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUser className="text-gray-500 text-sm" />
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {appointment.patientName}
                                                </h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${statusStyle.badge}`}>
                                                    {statusStyle.icon} {appointment.status}
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-sm">
                                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <FaClock className="text-blue-500 text-xs" />
                                                    {dateTime.date} at {dateTime.time}
                                                </p>
                                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <FaPhone className="text-green-500 text-xs" />
                                                    {appointment.patientPhone}
                                                </p>
                                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <FaEnvelope className="text-blue-500 text-xs" />
                                                    {appointment.patientEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Reason:</strong> {appointment.reason}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {appointment.status?.toLowerCase() === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'Accepted')}
                                                    disabled={processing === appointment.id}
                                                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <FaCheck className="text-xs" />
                                                    {processing === appointment.id ? 'Accepting...' : 'Accept'}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'Rejected')}
                                                    disabled={processing === appointment.id}
                                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <FaTimes className="text-xs" />
                                                    {processing === appointment.id ? 'Rejecting...' : 'Reject'}
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => setSelectedAppointment(appointment)}
                                            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                                        >
                                            <FaEye className="text-xs" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Appointment Details
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Patient Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-semibold">
                                        {selectedAppointment.patientName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusStyle(selectedAppointment.status).badge}`}>
                                        {getStatusStyle(selectedAppointment.status).icon} {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date & Time
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        {formatDateTime(selectedAppointment.dateTime).date} at {formatDateTime(selectedAppointment.dateTime).time}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        {selectedAppointment.patientPhone}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {selectedAppointment.patientEmail}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reason for Visit
                                </label>
                                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    {selectedAppointment.reason}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Appointment ID
                                </label>
                                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                                    {selectedAppointment.appointmentId}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
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

export default AllAppointmentsSection;