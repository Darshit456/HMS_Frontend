import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { getAllDoctors } from "../../../services/doctorsApi.js";
import { createAppointment, getPatientAppointments } from "../../../services/appointmentApi.js";

const RequestAppointmentCard = () => {
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        doctorID: '',
        reason: '',
        appointmentDate: '',
        appointmentTime: ''
    });

    // Time slots for dropdown
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    // Fetch pending requests on component mount
    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Fetch doctors when popup opens
    useEffect(() => {
        if (isRequestOpen) {
            fetchDoctors();
        }
    }, [isRequestOpen]);

    const fetchPendingRequests = async () => {
        try {
            const appointmentsData = await getPatientAppointments();

            // Filter only pending appointments
            const pendingAppointments = appointmentsData.filter(appointment =>
                appointment.status && appointment.status.toLowerCase() === 'pending'
            );

            // Transform to display format - single line format
            const transformedRequests = pendingAppointments.map(appointment => ({
                id: appointment.token,
                name: `Appointment pending with Dr. ${appointment.doctorName}`,
                status: appointment.status
            }));

            setPendingRequests(transformedRequests);
        } catch (error) {
            console.error("Failed to fetch pending requests:", error);
            // Keep empty array if fetch fails
            setPendingRequests([]);
        }
    };

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const doctorsData = await getAllDoctors();
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            alert("Failed to load doctors. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.doctorID || !formData.reason || !formData.appointmentDate || !formData.appointmentTime) {
            alert("Please fill in all fields");
            return;
        }

        try {
            setSubmitting(true);

            // Combine date and time into ISO format
            const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

            const appointmentData = {
                doctorID: parseInt(formData.doctorID),
                reason: formData.reason,
                appointmentDateTime: appointmentDateTime
            };

            console.log("Submitting appointment:", appointmentData);

            await createAppointment(appointmentData);

            alert("Appointment request sent successfully!");

            // Reset form and close popup
            setFormData({
                doctorID: '',
                reason: '',
                appointmentDate: '',
                appointmentTime: ''
            });
            setIsRequestOpen(false);

            // Refresh pending requests
            fetchPendingRequests();

        } catch (error) {
            console.error("Failed to create appointment:", error);
            alert("Failed to send appointment request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            doctorID: '',
            reason: '',
            appointmentDate: '',
            appointmentTime: ''
        });
        setIsRequestOpen(false);
    };

    return (
        <div className="dark:bg-gray-800 dark:text-white rounded-2xl shadow-md h-full p-4 flex flex-col justify-between">
            <div className="relative group">
                <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
                <div className="overflow-y-auto max-h-40 custom-scroll group-hover:scroll-visible">
                    <ul className="space-y-2 pr-2">
                        {pendingRequests.length === 0 ? (
                            <li className="dark:bg-gray-700 p-3 rounded-md text-gray-500 dark:text-gray-400 text-center">
                                No pending requests
                            </li>
                        ) : (
                            pendingRequests.map((req) => (
                                <li key={req.id} className="dark:bg-gray-700 p-3 rounded-md">
                                    {req.name} - <span className="text-yellow-400 font-semibold">{req.status}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
            <button
                onClick={() => setIsRequestOpen(true)}
                className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
            >
                <FaPlusCircle /> Request Appointment
            </button>

            {/* Request Appointment Popup */}
            {isRequestOpen && (
                <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Request Appointment</h3>

                        {loading ? (
                            <div className="text-center py-4">
                                <div className="text-gray-500 dark:text-gray-400">Loading doctors...</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Doctor Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Select Doctor *
                                    </label>
                                    <select
                                        name="doctorID"
                                        value={formData.doctorID}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Choose a doctor...</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.doctorID} value={doctor.doctorID}>
                                                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Reason for Visit *
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        placeholder="Describe your symptoms or reason for visit..."
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        required
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Preferred Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Preferred Time *
                                    </label>
                                    <select
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Select time...</option>
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Sending..." : "Send Request"}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
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

export default RequestAppointmentCard;