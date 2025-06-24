// File: src/pages/Dashboard/Doctor/TodaysAppointments.jsx
import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaClock, FaPhone, FaEnvelope, FaNotesMedical } from "react-icons/fa";
import { getDoctorAppointments } from "../../../services/Doctor/doctorAppointmentApi.js";
import { markAppointmentComplete } from "../../../services/Doctor/completeAppointmentApi.js";
import { createMedicalRecord, validateMedicalRecordData } from "../../../services/Doctor/createMedicalRecordApi.js";
import MedicalRecordForm from "./MedicalRecordForm.jsx";

const TodaysAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);

    // Medical Record Form States
    const [medicalRecordForm, setMedicalRecordForm] = useState({
        show: false,
        appointment: null,
        loading: false
    });

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

    // Quick completion (without medical record)
    const quickMarkComplete = async (appointmentId) => {
        try {
            setUpdating(appointmentId);

            console.log("Quick completing appointment:", appointmentId);
            await markAppointmentComplete(appointmentId);

            // Update local state: change status to completed instead of removing
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId
                        ? { ...apt, status: 'Completed', isCompleted: true }
                        : apt
                )
            );

            alert("Appointment marked as completed successfully!");
        } catch (error) {
            console.error("Failed to mark appointment as complete:", error);
            alert("Failed to mark appointment as complete. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    // Complete with medical record
    const completeWithMedicalRecord = (appointment) => {
        // Get user details for doctorID
        const userDetails = localStorage.getItem("userDetails");
        let doctorID = null;

        if (userDetails) {
            const userData = JSON.parse(userDetails);
            doctorID = userData.doctorID;
        }

        // Prepare appointment data for medical record form
        const appointmentData = {
            appointmentId: appointment.id,
            patientID: appointment.patientID,
            doctorID: doctorID,
            patientName: appointment.patientName,
            date: new Date().toLocaleDateString(),
            time: appointment.time,
            reason: appointment.reason
        };

        console.log("Opening medical record form for appointment:", appointmentData);

        setMedicalRecordForm({
            show: true,
            appointment: appointmentData,
            loading: false
        });
    };

    // Handle medical record submission
    const handleMedicalRecordSubmit = async (medicalRecordData) => {
        try {
            setMedicalRecordForm(prev => ({ ...prev, loading: true }));

            // Validate the medical record data
            const validation = validateMedicalRecordData(medicalRecordData);
            if (!validation.isValid) {
                alert("Validation errors:\n" + validation.errors.join("\n"));
                return;
            }

            console.log("Creating medical record:", medicalRecordData);

            // Create the medical record
            const medicalRecord = await createMedicalRecord(medicalRecordData);
            console.log("Medical record created:", medicalRecord);

            // Mark appointment as completed
            await markAppointmentComplete(medicalRecordForm.appointment.appointmentId);

            // Update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === medicalRecordForm.appointment.appointmentId
                        ? { ...apt, status: 'Completed', isCompleted: true }
                        : apt
                )
            );

            // Close the form
            setMedicalRecordForm({ show: false, appointment: null, loading: false });

            alert("Appointment completed and medical record created successfully!");

        } catch (error) {
            console.error("Failed to create medical record:", error);
            alert("Failed to create medical record: " + error.message);
        } finally {
            setMedicalRecordForm(prev => ({ ...prev, loading: false }));
        }
    };

    // Close medical record form
    const closeMedicalRecordForm = () => {
        if (!medicalRecordForm.loading) {
            setMedicalRecordForm({ show: false, appointment: null, loading: false });
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

            // Filter for today's appointments that are ACCEPTED or COMPLETED
            const todaysAppointments = allAppointments.filter(appointment => {
                try {
                    const appointmentDate = new Date(appointment.dateTime);
                    const isTodayAppointment = appointmentDate.toDateString() === today.toDateString();
                    const isAccepted = appointment.status && appointment.status.toLowerCase() === 'accepted';
                    const isCompleted = appointment.status && appointment.status.toLowerCase() === 'completed';

                    console.log(`Appointment ${appointment.token}:`, {
                        date: appointmentDate.toDateString(),
                        isToday: isTodayAppointment,
                        status: appointment.status,
                        isAccepted: isAccepted,
                        isCompleted: isCompleted,
                        shouldInclude: isTodayAppointment && (isAccepted || isCompleted)
                    });

                    return isTodayAppointment && (isAccepted || isCompleted);
                } catch (error) {
                    console.error("Error processing appointment:", appointment, error);
                    return false;
                }
            });

            console.log("Filtered today's accepted and completed appointments:", todaysAppointments);

            // Transform to display format
            const transformedAppointments = todaysAppointments.map((appointment, index) => ({
                id: appointment.token || index,
                patientID: appointment.patientID,
                patientName: appointment.patientName || 'Unknown Patient',
                time: formatTime(appointment.dateTime),
                reason: appointment.reason || 'No reason specified',
                status: appointment.status || 'Unknown',
                phone: appointment.patientPhone || 'Phone not available',
                email: appointment.patientEmail || 'Email not available',
                isCompleted: appointment.status && appointment.status.toLowerCase() === 'completed'
            }));

            // Sort appointments: ACCEPTED FIRST, then COMPLETED
            transformedAppointments.sort((a, b) => {
                // If 'a' is completed but 'b' is not completed, put 'a' AFTER 'b' (accepted first)
                if (a.isCompleted && !b.isCompleted) return 1;
                // If 'a' is not completed but 'b' is completed, put 'a' BEFORE 'b' (accepted first)
                if (!a.isCompleted && b.isCompleted) return -1;
                // If both have same status (both accepted or both completed), maintain original order
                return 0;
            });

            console.log("Sorted appointments (Accepted first, then Completed):", transformedAppointments);

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
                        <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">No Appointments Today</h3>
                        <p className="text-sm text-center">
                            Today's accepted and completed appointments will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className={`rounded-lg p-4 border ${
                                    appointment.isCompleted
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                }`}
                            >
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
                                        <span className={`text-xs px-3 py-1 rounded-full ${
                                            appointment.isCompleted
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        }`}>
                                            {appointment.isCompleted ? '✅ Completed' : '✅ Accepted'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reason for Visit:</strong> {appointment.reason}
                                    </p>
                                </div>

                                {/* Show completion buttons only for accepted appointments */}
                                {!appointment.isCompleted && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => quickMarkComplete(appointment.id)}
                                            disabled={updating === appointment.id}
                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaClock className="text-xs" />
                                            {updating === appointment.id ? 'Completing...' : 'Quick Complete'}
                                        </button>
                                        <button
                                            onClick={() => completeWithMedicalRecord(appointment)}
                                            disabled={updating === appointment.id}
                                            className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaNotesMedical className="text-xs" />
                                            Complete + Medical Record
                                        </button>
                                    </div>
                                )}

                                {/* Show completion status for completed appointments */}
                                {appointment.isCompleted && (
                                    <div className="text-center text-sm text-blue-600 dark:text-blue-400 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <FaClock className="inline mr-2" />
                                        This appointment has been completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Medical Record Form Modal */}
            <MedicalRecordForm
                appointment={medicalRecordForm.appointment}
                isOpen={medicalRecordForm.show}
                onClose={closeMedicalRecordForm}
                onSubmit={handleMedicalRecordSubmit}
                loading={medicalRecordForm.loading}
            />
        </div>
    );
};

export default TodaysAppointments;