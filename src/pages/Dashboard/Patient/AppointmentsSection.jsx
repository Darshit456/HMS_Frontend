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

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const appointmentsData = await getPatientAppointments();

            // Debug: Let's see the actual structure
            console.log("Raw appointment data from API:", appointmentsData);
            if (appointmentsData.length > 0) {
                console.log("First appointment object:", appointmentsData[0]);
                console.log("Available fields:", Object.keys(appointmentsData[0]));
            }

            // Transform the data to match your existing UI structure
            const transformedAppointments = appointmentsData.map(appointment => {
                const { date, time } = formatDateTime(appointment.dateTime); // Note: API uses 'dateTime' not 'appointmentDateTime'

                console.log("Appointment reason field:", appointment.reason); // Debug reason field

                return {
                    id: appointment.token, // API uses 'token' field as appointment ID
                    date: date,
                    time: time,
                    doctor: appointment.doctorName, // API returns doctorName directly
                    status: appointment.status,
                    reason: appointment.reason // Get reason directly from database - no fallback
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
                                <p className={`font-semibold ${
                                    appt.status === "Upcoming"
                                        ? "text-green-400"
                                        : appt.status === "Cancelled"
                                            ? "text-red-500"
                                            : "text-yellow-400"
                                }`}>
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