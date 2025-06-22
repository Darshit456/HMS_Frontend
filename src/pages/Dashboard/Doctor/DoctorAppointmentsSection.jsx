import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { getDoctorAppointments, updateAppointmentStatus } from "../../../services/Doctor/doctorAppointmentApi.js";

const DoctorAppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(null);

    // Function to format date and time
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

    // Function to get status color classes
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'accepted':
                return "text-green-400";
            case 'cancelled':
            case 'canceled':
            case 'rejected':
                return "text-red-500";
            case 'pending':
                return "text-yellow-400";
            case 'completed':
                return "text-blue-400";
            case 'in-progress':
                return "text-purple-400";
            default:
                return "text-gray-400";
        }
    };

    // Function to update appointment status
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            setUpdatingStatus(appointmentId);

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
            console.error("Failed to update appointment status:", error);
            alert("Failed to update appointment status. Please try again.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Function to check if appointment is today (not past dates)
    const isToday = (appointmentDateTime) => {
        try {
            const appointmentDate = new Date(appointmentDateTime);
            const today = new Date();

            // Reset time to compare only dates
            appointmentDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            return appointmentDate.getTime() === today.getTime();
        } catch (error) {
            console.error("Date comparison error:", error);
            return false;
        }
    };

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const appointmentsData = await getDoctorAppointments();

            // Filter for TODAY ONLY and exclude pending ones
            const todaysConfirmedAppointments = appointmentsData.filter(appointment => {
                const isTodayAppointment = isToday(appointment.appointmentDateTime);
                const isPending = appointment.status?.toLowerCase() === 'pending';

                console.log(`Appointment ${appointment.appointmentID}:`, {
                    dateTime: appointment.appointmentDateTime,
                    isToday: isTodayAppointment,
                    status: appointment.status,
                    isPending: isPending,
                    included: isTodayAppointment && !isPending
                });

                return isTodayAppointment && !isPending; // Only today's confirmed appointments
            });

            // Transform the data (patient data is already enriched by API)
            const transformedAppointments = todaysConfirmedAppointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.appointmentDateTime);

                return {
                    id: appointment.appointmentID,
                    date: date,
                    time: time,
                    patientName: `${appointment.patientFirstName} ${appointment.patientLastName}`,
                    status: appointment.status,
                    reason: appointment.reason,
                    patientPhone: appointment.patientPhone,
                    patientEmail: appointment.patientEmail
                };
            });

            setAppointments(transformedAppointments);
            console.log("Today's confirmed appointments only:", transformedAppointments);

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

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAppointments();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaCalendarCheck className="text-green-500" /> Today's Appointments
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
                    <FaCalendarCheck className="text-green-500" /> Today's Appointments
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
                <FaCalendarCheck className="text-green-500" /> Today's Appointments
            </h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            No confirmed appointments today
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="border dark:border-none rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800 dark:text-white">{appt.patientName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{appt.patientPhone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-800 dark:text-white"><strong>Date:</strong> {appt.date}</p>
                                        <p className="text-sm text-gray-800 dark:text-white"><strong>Time:</strong> {appt.time}</p>
                                    </div>
                                </div>

                                <p className="text-sm mb-2 text-gray-800 dark:text-white"><strong>Reason:</strong> {appt.reason}</p>

                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold ${getStatusColor(appt.status)}`}>
                                        Status: {appt.status}
                                    </p>

                                    {/* Action Buttons - Only for Confirmed appointments */}
                                    {appt.status.toLowerCase() === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                                            disabled={updatingStatus === appt.id}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1 disabled:bg-gray-400"
                                        >
                                            <FaClock className="text-xs" />
                                            {updatingStatus === appt.id ? 'Updating...' : 'Mark Complete'}
                                        </button>
                                    )}

                                    {/* No Accept/Reject buttons here - they belong in Patient Requests section */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointmentsSection;