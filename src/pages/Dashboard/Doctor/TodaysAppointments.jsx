import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaClock } from "react-icons/fa";
import { getDoctorAppointments, updateAppointmentStatus } from "../../../services/Doctor/doctorAppointmentApi.js";

const TodaysAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);

    // Check if appointment is today
    const isToday = (dateString) => {
        try {
            const appointmentDate = new Date(dateString);
            const today = new Date();

            return appointmentDate.toDateString() === today.toDateString();
        } catch (error) {
            return false;
        }
    };

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

            // Update local state
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

    // Fetch and filter today's appointments
    const fetchTodaysAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("=== STARTING API CALL ===");
            console.log("Doctor ID from localStorage:", JSON.parse(localStorage.getItem("userDetails"))?.doctorID);

            const allAppointments = await getDoctorAppointments();
            console.log("=== API RESPONSE ===");
            console.log("Type of response:", typeof allAppointments);
            console.log("Is array:", Array.isArray(allAppointments));
            console.log("Length:", allAppointments?.length);
            console.log("Raw response:", allAppointments);

            if (!allAppointments || allAppointments.length === 0) {
                console.log("=== NO DATA FROM API ===");
                setAppointments([]);
                return;
            }

            // NO FILTERS - Show ALL appointments from API
            const allAppointmentsData = allAppointments; // No filtering at all

            // Transform to display format
            const transformedAppointments = allAppointmentsData.map(appointment => {
                console.log("Transforming appointment:", appointment);
                return {
                    id: appointment.token,
                    patientName: appointment.patientName || 'Unknown Patient',
                    time: formatTime(appointment.dateTime),
                    reason: appointment.reason || 'No reason specified',
                    status: appointment.status,
                    phone: appointment.patientPhone || 'N/A',
                    date: appointment.dateTime // Show full date for debugging
                };
            });

            console.log("Final transformed appointments:", transformedAppointments);
            setAppointments(transformedAppointments);

        } catch (err) {
            console.error("=== API ERROR ===");
            console.error("Error details:", err);
            console.error("Error message:", err.message);
            console.error("Error response:", err.response?.data);
            setError(`API Error: ${err.message}`);
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
                    <FaCalendarCheck className="text-green-500" /> ALL Appointments (No Filters)
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
                    <div className="text-red-500">{error}</div>
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
            </h2>

            <div className="overflow-y-auto flex-1 custom-scroll">
                {appointments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        No appointments found from API
                    </div>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">
                                            {appointment.patientName}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {appointment.phone}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            {appointment.time}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {appointment.date}
                                        </p>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    <strong>Reason:</strong> {appointment.reason}
                                </p>

                                {/* Show Mark Complete button for any status */}
                                <button
                                    onClick={() => markComplete(appointment.id)}
                                    disabled={updating === appointment.id}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
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