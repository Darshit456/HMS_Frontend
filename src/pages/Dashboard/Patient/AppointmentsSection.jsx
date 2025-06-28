import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUserMd, FaNotesMedical, FaEye, FaTimes } from "react-icons/fa";
import { getPatientAppointments } from "../../../services/appointmentApi.js";
import { getDoctorById } from "../../../services/doctorsApi.js";

const AppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Function to format date and time from your API response
    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
            const timeStr = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            return { date: dateStr, time: timeStr };
        } catch (error) {
            console.error("Date formatting error:", error);
            return { date: 'Invalid Date', time: 'Invalid Time' };
        }
    };

    // Function to get status color classes for all appointment statuses
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'upcoming':
            case 'scheduled':
            case 'accepted':
                return "text-green-400";
            case 'cancelled':
            case 'canceled':
            case 'rejected':
                return "text-red-400";
            case 'pending':
                return "text-yellow-400";
            case 'completed':
            case 'done':
                return "text-blue-400";
            case 'in-progress':
            case 'ongoing':
                return "text-purple-400";
            default:
                return "text-gray-400";
        }
    };

    // Function to get status badge styling
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'upcoming':
            case 'scheduled':
            case 'accepted':
                return "bg-green-500/20 text-green-300 border border-green-500/30";
            case 'cancelled':
            case 'canceled':
            case 'rejected':
                return "bg-red-500/20 text-red-300 border border-red-500/30";
            case 'pending':
                return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
            case 'completed':
            case 'done':
                return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
            case 'in-progress':
            case 'ongoing':
                return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
            default:
                return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
        }
    };

    // Function to fetch doctor name by ID
    const fetchDoctorName = async (doctorId) => {
        try {
            const doctor = await getDoctorById(doctorId);
            return `Dr. ${doctor.firstName} ${doctor.lastName}`;
        } catch (error) {
            console.error(`Failed to fetch doctor ${doctorId}:`, error);
            return "Dr. Unknown";
        }
    };

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const appointmentsData = await getPatientAppointments();

            // Transform the data and fetch doctor names
            const transformedAppointments = await Promise.all(
                appointmentsData.map(async (appointment) => {
                    const { date, time } = formatDateTime(appointment.dateTime);

                    // Fetch doctor name using doctorID
                    const doctorName = await fetchDoctorName(appointment.doctorID);

                    return {
                        id: appointment.token,
                        date: date,
                        time: time,
                        doctor: doctorName,
                        status: appointment.status,
                        reason: appointment.reason,
                        fullAppointment: appointment
                    };
                })
            );

            setAppointments(transformedAppointments);
            console.log("Transformed appointments:", transformedAppointments);

        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError("Failed to load appointments. Please try again.");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Open appointment detail modal
    const openAppointmentDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    // Close appointment detail modal
    const closeAppointmentDetail = () => {
        setSelectedAppointment(null);
        setShowDetailModal(false);
    };

    // Fetch appointments on component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Auto-refresh every 30 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAppointments();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-4 h-full border border-gray-600 flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg animate-pulse">
                        <FaCalendarAlt className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Your Appointments
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-400 animate-pulse">Loading appointments...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-4 h-full border border-gray-600 flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <FaCalendarAlt className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Your Appointments
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="text-red-400">{error}</div>
                    <button
                        onClick={fetchAppointments}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-4 h-full border border-gray-600 flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg animate-pulse">
                        <FaCalendarAlt className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Your Appointments
                    {appointments.length > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {appointments.length}
                        </span>
                    )}
                </h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <div className="text-6xl mb-4 opacity-50 animate-pulse">📅</div>
                                <h3 className="text-lg font-medium mb-2 text-gray-300">No appointments found</h3>
                                <p className="text-sm text-center">Your upcoming appointments will appear here</p>
                            </div>
                        ) : (
                            appointments.map((appt) => (
                                <div
                                    key={appt.id}
                                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4 hover:bg-gray-900/70 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                                    onClick={() => openAppointmentDetail(appt)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaCalendarAlt className="text-blue-400 text-sm" />
                                                <p className="font-medium text-white">{appt.date}</p>
                                                <FaClock className="text-green-400 text-sm ml-2" />
                                                <p className="text-green-300">{appt.time}</p>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUserMd className="text-purple-400 text-sm" />
                                                <p className="text-gray-300">{appt.doctor}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaNotesMedical className="text-yellow-400 text-sm" />
                                                <p className="text-gray-400 text-sm">{appt.reason}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(appt.status)}`}>
                                                {appt.status}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openAppointmentDetail(appt);
                                                }}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100"
                                            >
                                                <FaEye className="text-xs" />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Appointment Detail Modal */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-600 animate-scaleIn">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-2xl" />
                                    <div>
                                        <h2 className="text-xl font-bold">Appointment Details</h2>
                                        <p className="text-blue-100 text-sm">{selectedAppointment.doctor} • {selectedAppointment.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeAppointmentDetail}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                                    <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                        <FaCalendarAlt />
                                        Date & Time
                                    </h3>
                                    <p className="text-white text-lg">{selectedAppointment.date}</p>
                                    <p className="text-gray-300">{selectedAppointment.time}</p>
                                </div>

                                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                                    <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                        <FaUserMd />
                                        Doctor
                                    </h3>
                                    <p className="text-white text-lg">{selectedAppointment.doctor}</p>
                                </div>

                                <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30 md:col-span-2">
                                    <h3 className="font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                                        <FaNotesMedical />
                                        Reason for Visit
                                    </h3>
                                    <p className="text-gray-300">{selectedAppointment.reason}</p>
                                </div>

                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-500/30 md:col-span-2">
                                    <h3 className="font-semibold text-gray-300 mb-3">Status</h3>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedAppointment.status)}`}>
                                        {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-900/50 p-6 border-t border-gray-600 rounded-b-2xl">
                            <button
                                onClick={closeAppointmentDetail}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
                
                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #8b5cf6 transparent;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #a855f7);
                    border-radius: 3px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #9333ea);
                }
            `}</style>
        </>
    );
};

export default AppointmentsSection;