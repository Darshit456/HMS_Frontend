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

    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            const dateStr = date.toLocaleDateString('en-CA');
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
            default:
                return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
        }
    };

    const fetchDoctorName = async (doctorId) => {
        try {
            const doctor = await getDoctorById(doctorId);
            return `Dr. ${doctor.firstName} ${doctor.lastName}`;
        } catch (error) {
            console.error(`Failed to fetch doctor ${doctorId}:`, error);
            return "Dr. Unknown";
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const appointmentsData = await getPatientAppointments();

            const transformedAppointments = await Promise.all(
                appointmentsData.map(async (appointment) => {
                    const { date, time } = formatDateTime(appointment.dateTime);
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
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError("Failed to load appointments. Please try again.");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const openAppointmentDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    const closeAppointmentDetail = () => {
        setSelectedAppointment(null);
        setShowDetailModal(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchAppointments();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600" />
                    Your Appointments
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading appointments...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600" />
                    Your Appointments
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="text-red-500 text-center">{error}</div>
                    <button
                        onClick={fetchAppointments}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600" />
                    Your Appointments
                    {appointments.length > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {appointments.length}
                        </span>
                    )}
                </h2>
                <div className="overflow-y-auto flex-1 custom-scroll">
                    <div className="space-y-3">
                        {appointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                <div className="text-6xl mb-4 opacity-50 animate-pulse">📅</div>
                                <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">No appointments found</h3>
                                <p className="text-sm text-center">Your upcoming appointments will appear here</p>
                            </div>
                        ) : (
                            appointments.slice(0, 4).map((appt) => (
                                <div
                                    key={appt.id}
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                                    onClick={() => openAppointmentDetail(appt)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUserMd className="text-purple-500 text-sm" />
                                                <p className="font-medium text-gray-800 dark:text-white">{appt.doctor}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-blue-500 text-xs" />
                                                    {appt.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="text-green-500 text-xs" />
                                                    {appt.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{appt.reason}</p>
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
                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
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
                {appointments.length > 4 && (
                    <button className="mt-3 text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All Appointments ({appointments.length})
                    </button>
                )}
            </div>

            {/* Appointment Detail Modal */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">
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

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                        <FaCalendarAlt />
                                        Date & Time
                                    </h3>
                                    <p className="text-gray-800 dark:text-white text-lg">{selectedAppointment.date}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{selectedAppointment.time}</p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                                        <FaUserMd />
                                        Doctor
                                    </h3>
                                    <p className="text-gray-800 dark:text-white text-lg">{selectedAppointment.doctor}</p>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl md:col-span-2">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                                        <FaNotesMedical />
                                        Reason for Visit
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">{selectedAppointment.reason}</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl md:col-span-2">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Status</h3>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedAppointment.status)}`}>
                                        {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl">
                            <button
                                onClick={closeAppointmentDetail}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default AppointmentsSection;