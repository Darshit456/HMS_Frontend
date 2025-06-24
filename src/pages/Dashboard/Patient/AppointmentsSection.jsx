import React, { useState, useEffect } from "react";
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
                    reason: appointment.reason // Should now come from your updated backend
                };
            });

            setAppointments(transformedAppointments);
            console.log("Transformed appointments:", transformedAppointments);

        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError("Failed to load appointments. Please try again.");
            // Fallback to empty array to prevent crashes
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

    // Keep the exact same UI as your original component
    if (loading) {
        return (
            <div className=" dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
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
            <div className=" dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-red-500">{error}</div>
                        <button
                            onClick={fetchAppointments}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            No appointments found
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="border dark:border-none rounded-lg p-4 bg-white dark:bg-gray-700">
                                <p><strong>Date:</strong> {appt.date}</p>
                                <p><strong>Time:</strong> {appt.time}</p>
                                <p><strong>Doctor:</strong> {appt.doctor}</p>
                                <p><strong>Reason:</strong> {appt.reason}</p>
                                <p className={`font-semibold ${getStatusColor(appt.status)}`}>
                                    {appt.status}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsSection;