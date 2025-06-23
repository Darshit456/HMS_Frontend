import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaClock, FaPhone, FaEnvelope } from "react-icons/fa";
import { getDoctorAppointments, updateAppointmentStatus } from "../../../services/Doctor/doctorAppointmentApi.js";

const TodaysAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);

    // Format time display
    const formatTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return 'Invalid Time';
        }
    };

    // Mark appointment as complete
    const markComplete = async (appointmentId) => {
        try {
            setUpdating(appointmentId);
            await updateAppointmentStatus(appointmentId, 'Completed');

            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId
                        ? { ...apt, status: 'Completed' }
                        : apt
                )
            );

            alert("Appointment marked as completed!");
        } catch (error) {
            alert("Failed to update appointment status");
        } finally {
            setUpdating(null);
        }
    };

    // Fetch and filter today's ACCEPTED appointments only
    const fetchTodaysAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("=== FETCHING TODAY'S ACCEPTED APPOINTMENTS ===");

            const allAppointments = await getDoctorAppointments();
            console.log("API Response:", allAppointments);

            if (!allAppointments || allAppointments.length === 0) {
                setAppointments([]);
                return;
            }

            // Get today's date
            const today = new Date();
            console.log("Today's date:", today.toDateString());

            // Filter for today's appointments that are ACCEPTED only
            const todaysAcceptedAppointments = allAppointments.filter(appointment => {
                try {
                    const appointmentDate = new Date(appointment.dateTime);
                    const isTodayAppointment = appointmentDate.toDateString() === today.toDateString();
                    const isAccepted = appointment.status && appointment.status.toLowerCase() === 'accepted';

                    console.log(`Appointment ${appointment.token}:`, {
                        date: appointmentDate.toDateString(),
                        isToday: isTodayAppointment,
                        status: appointment.status,
                        isAccepted: isAccepted,
                        shouldInclude: isTodayAppointment && isAccepted
                    });

                    return isTodayAppointment && isAccepted;
                } catch (error) {
                    console.error("Error processing appointment:", appointment, error);
                    return false;
                }
            });

            console.log("Filtered today's accepted appointments:", todaysAcceptedAppointments);

            // Transform to display format
            const transformedAppointments = todaysAcceptedAppointments.map((appointment, index) => ({
                id: appointment.token || index,
                patientName: appointment.patientName || 'Unknown Patient',
                time: formatTime(appointment.dateTime),
                reason: appointment.reason || 'No reason specified',
                status: appointment.status || 'Unknown',
                phone: appointment.patientPhone || 'Phone not available',
                email: appointment.patientEmail || 'Email not available'
            }));

            console.log("Final transformed appointments:", transformedAppointments);
            setAppointments(transformedAppointments);

        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError(`Error loading appointments: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodaysAppointments();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaCalendarCheck className="text-green-500" /> Today's Appointments
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
                    <FaCalendarCheck className="text-green-500" /> Today's Appointments
                </h2>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-red-500 text-center">{error}</div>
                    <button
                        onClick={fetchTodaysAppointments}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <FaCalendarCheck className="text-green-500" /> Today's Appointments
                {appointments.length > 0 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {appointments.length}
                    </span>
                )}
            </h2>

            <div className="overflow-y-auto flex-1 custom-scroll">
                {appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4 opacity-50">📅</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">No Accepted Appointments Today</h3>
                        <p className="text-sm text-center">
                            Accepted appointments for today will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                                            {appointment.patientName}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaPhone className="text-green-500 text-xs" />
                                                {appointment.phone}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaEnvelope className="text-blue-500 text-xs" />
                                                {appointment.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                                            {appointment.time}
                                        </p>
                                        <span className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                            ✅ Accepted
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reason for Visit:</strong> {appointment.reason}
                                    </p>
                                </div>

                                {/* Mark Complete Button */}
                                <button
                                    onClick={() => markComplete(appointment.id)}
                                    disabled={updating === appointment.id}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-semibold"
                                >
                                    <FaClock className="text-sm" />
                                    {updating === appointment.id ? 'Marking Complete...' : 'Mark as Complete'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodaysAppointments;