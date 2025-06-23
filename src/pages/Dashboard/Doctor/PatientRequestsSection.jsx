import React, { useState, useEffect } from "react";
import { FaUserClock, FaCheck, FaTimes, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { getDoctorAppointments } from "../../../services/Doctor/doctorAppointmentApi.js";
import { updateAppointmentStatus } from "../../../services/Doctor/patientRequestsApi.js";

const PatientRequestsSection = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(null);
    const [rejectionPopup, setRejectionPopup] = useState({ show: false, appointmentId: null });
    const [rejectionReason, setRejectionReason] = useState("");

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

    // Format date display
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Accept appointment
    const acceptAppointment = async (appointmentId) => {
        try {
            setProcessing(appointmentId);
            await updateAppointmentStatus(appointmentId, 'Accepted');

            setPendingRequests(prev =>
                prev.filter(req => req.id !== appointmentId)
            );

            alert("Appointment accepted successfully!");
        } catch (error) {
            alert("Failed to accept appointment. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    // Reject appointment
    const rejectAppointment = async () => {
        try {
            setProcessing(rejectionPopup.appointmentId);
            await updateAppointmentStatus(rejectionPopup.appointmentId, 'Rejected');

            setPendingRequests(prev =>
                prev.filter(req => req.id !== rejectionPopup.appointmentId)
            );

            setRejectionPopup({ show: false, appointmentId: null });
            setRejectionReason("");

            alert("Appointment rejected successfully!");
        } catch (error) {
            alert("Failed to reject appointment. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    // Open rejection popup
    const openRejectionPopup = (appointmentId) => {
        setRejectionPopup({ show: true, appointmentId });
        setRejectionReason("");
    };

    // Close rejection popup
    const closeRejectionPopup = () => {
        setRejectionPopup({ show: false, appointmentId: null });
        setRejectionReason("");
    };

    // Fetch pending appointment requests
    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("=== FETCHING PENDING REQUESTS ===");

            // Get all appointments and filter for pending ones
            const allAppointments = await getDoctorAppointments();
            console.log("All appointments:", allAppointments);

            // Filter for pending appointments only
            const pendingAppointments = allAppointments.filter(appointment =>
                appointment.status && appointment.status.toLowerCase() === 'pending'
            );

            console.log("Pending appointments:", pendingAppointments);

            // Transform to display format
            const transformedRequests = pendingAppointments.map((appointment, index) => ({
                id: appointment.token || index, // Keep this for UI
                appointmentId: appointment.token, // Use token as the appointmentId for API calls
                patientName: appointment.patientName || 'Unknown Patient',
                phone: appointment.patientPhone || 'Phone not available',
                email: appointment.patientEmail || 'Email not available',
                date: formatDate(appointment.dateTime),
                time: formatTime(appointment.dateTime),
                reason: appointment.reason || 'No reason specified',
                dateTime: appointment.dateTime
            }));

            console.log("Transformed pending requests:", transformedRequests);
            setPendingRequests(transformedRequests);

        } catch (err) {
            console.error("Error fetching pending requests:", err);
            setError(`Error loading requests: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaUserClock className="text-orange-500" /> Patient Requests
                </h2>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">Loading requests...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaUserClock className="text-orange-500" /> Patient Requests
                </h2>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-red-500 text-center">{error}</div>
                    <button
                        onClick={fetchPendingRequests}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
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
                <FaUserClock className="text-orange-500" /> Patient Requests
                {pendingRequests.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {pendingRequests.length}
                    </span>
                )}
            </h2>

            <div className="overflow-y-auto flex-1 custom-scroll">
                {pendingRequests.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        No pending requests
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                                            {request.patientName}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaPhone className="text-green-500 text-xs" />
                                                {request.phone}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaEnvelope className="text-blue-500 text-xs" />
                                                {request.email}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaClock className="text-orange-500 text-xs" />
                                                {request.date} at {request.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
                                            📋 Pending Request
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reason for Visit:</strong> {request.reason}
                                    </p>
                                </div>

                                {/* Accept/Reject Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => acceptAppointment(request.id)}
                                        disabled={processing === request.id}
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-semibold"
                                    >
                                        <FaCheck className="text-sm" />
                                        {processing === request.id ? 'Accepting...' : 'Accept Request'}
                                    </button>
                                    <button
                                        onClick={() => openRejectionPopup(request.id)}
                                        disabled={processing === request.id}
                                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-semibold"
                                    >
                                        <FaTimes className="text-sm" />
                                        {processing === request.id ? 'Rejecting...' : 'Reject Request'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rejection Reason Popup */}
            {rejectionPopup.show && (
                <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Reject Appointment
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Please provide a reason for rejecting this appointment (optional):
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason (e.g., Doctor not available, Schedule conflict, etc.)"
                            rows="4"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={rejectAppointment}
                                disabled={processing === rejectionPopup.appointmentId}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                            >
                                {processing === rejectionPopup.appointmentId ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                            <button
                                onClick={closeRejectionPopup}
                                disabled={processing === rejectionPopup.appointmentId}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRequestsSection;