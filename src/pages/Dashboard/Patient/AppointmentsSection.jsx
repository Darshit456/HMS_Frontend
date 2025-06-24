// File: src/pages/Dashboard/Patient/AppointmentsSection.jsx
import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { getPatientAppointments } from "../../../services/appointmentApi.js";

const AppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                return "text-red-500";
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

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const appointmentsData = await getPatientAppointments();

            // Transform the data to match your existing UI structure
            const transformedAppointments = appointmentsData.map(appointment => {
                const { date, time } = formatDateTime(appointment.dateTime);

                return {
                    id: appointment.token,
                    date: date,
                    time: time,
                    doctor: appointment.doctorName,
                    status: appointment.status,
                    reason: appointment.reason
                };
            });

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
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                        <FaCalendarCheck className="text-green-600 dark:text-green-300" />
                    </div>
                    Your Appointments
                </h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500 dark:text-gray-400">Loading appointments...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <FaCalendarCheck className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Your Appointments
                </h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-red-500">{error}</div>
                        <button
                            onClick={fetchAppointments}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                    <FaCalendarCheck className="text-green-600 dark:text-green-300" />
                </div>
                Your Appointments
                {appointments.length > 0 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {appointments.length}
                    </span>
                )}
            </h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <div className="text-6xl mb-4 opacity-50">
                                📅
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">No Appointments Found</h3>
                            <p className="text-sm text-center">
                                Your upcoming appointments will appear here
                            </p>
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="border dark:border-none rounded-lg p-4 bg-white dark:bg-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            <strong>Date:</strong> {appt.date}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            <strong>Time:</strong> {appt.time}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            <strong>Doctor:</strong> {appt.doctor}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(appt.status)}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reason:</strong> {appt.reason}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsSection;