import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaUserClock, FaPlus, FaClock, FaUser, FaCalendarAlt, FaNotesMedical, FaTimes } from "react-icons/fa";
import { IoMdDocument } from "react-icons/io";
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

            // Filter only pending appointments (strict check)
            const pendingAppointments = appointmentsData.filter(appointment =>
                appointment.status && appointment.status.toLowerCase() === 'pending'
            );

            // Transform to display format - single line format
            const transformedRequests = pendingAppointments.map(appointment => ({
                id: appointment.token,
                name: `Dr. ${appointment.doctorName}`,
                reason: appointment.reason || 'General Consultation',
                date: appointment.appointmentDateTime ? new Date(appointment.appointmentDateTime).toLocaleDateString() : 'TBD',
                status: appointment.status
            }));

            setPendingRequests(transformedRequests);
        } catch (error) {
            console.error("Failed to fetch pending requests:", error);
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
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-md h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                        <FaUserClock className="text-purple-600 dark:text-purple-300" />
                    </div>
                    Pending Requests
                    {pendingRequests.length > 0 && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingRequests.length}
                        </span>
                    )}
                </h2>
                <button
                    onClick={() => setIsRequestOpen(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <FaPlus className="text-xs" />
                    New Request
                </button>
            </div>

            {/* Requests List */}
            <div className="flex-1 overflow-y-auto max-h-64">
                {pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4">
                            <IoMdDocument className="text-3xl text-purple-500 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            No Pending Requests
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                            Your appointment requests will appear here. Click "New Request" to schedule an appointment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaUser className="text-purple-600 dark:text-purple-300 text-sm" />
                                            <span className="font-semibold text-gray-800 dark:text-white">
                                                {req.name}
                                            </span>
                                            <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs px-2 py-1 rounded-full font-medium">
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <FaNotesMedical className="text-gray-400 text-xs" />
                                                <span>{req.reason}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400 text-xs" />
                                                <span>{req.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Request status updates</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">Real-time</span>
                </div>
            </div>

            {/* Request Appointment Popup */}
            {isRequestOpen && (
                <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-96 max-w-md mx-4 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                                    <FaCalendarAlt className="text-purple-600 dark:text-purple-300" />
                                </div>
                                Request Appointment
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                    <span className="ml-3 text-gray-500 dark:text-gray-400">Loading doctors...</span>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Doctor Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <FaUser className="text-purple-500" />
                                            Select Doctor *
                                        </label>
                                        <select
                                            name="doctorID"
                                            value={formData.doctorID}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <FaNotesMedical className="text-purple-500" />
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            placeholder="Describe your symptoms or reason for visit..."
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Date and Time Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-500" />
                                                Preferred Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="appointmentDate"
                                                value={formData.appointmentDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        {/* Time */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FaClock className="text-purple-500" />
                                                Preferred Time *
                                            </label>
                                            <select
                                                name="appointmentTime"
                                                value={formData.appointmentTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loading}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaPlusCircle />
                                        Send Request
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
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