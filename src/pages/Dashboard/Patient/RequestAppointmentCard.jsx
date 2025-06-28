import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaUserClock, FaPlus, FaClock, FaUser, FaCalendarAlt, FaNotesMedical, FaTimes } from "react-icons/fa";
import { IoMdDocument } from "react-icons/io";
import { getAllDoctors, getDoctorById } from "../../../services/doctorsApi.js";
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

    // Function to fetch doctor name by ID
    const fetchDoctorName = async (doctorId) => {
        try {
            const doctor = await getDoctorById(doctorId);
            return `Dr. ${doctor.firstName} ${doctor.lastName}`;
        } catch (error) {
            console.error(`Failed to fetch doctor ${doctorId}:`, error);
            return "Dr. Unknown";
        }
    };

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

            // Transform to display format with doctor names
            const transformedRequests = await Promise.all(
                pendingAppointments.map(async (appointment) => {
                    // Fetch doctor name using doctorID
                    const doctorName = appointment.doctorID
                        ? await fetchDoctorName(appointment.doctorID)
                        : 'Dr. Unknown';

                    return {
                        id: appointment.token,
                        name: doctorName, // Now using fetched doctor name
                        reason: appointment.reason || 'General Consultation',
                        date: appointment.appointmentDateTime
                            ? new Date(appointment.appointmentDateTime).toLocaleDateString()
                            : appointment.dateTime
                                ? new Date(appointment.dateTime).toLocaleDateString()
                                : 'TBD',
                        status: appointment.status
                    };
                })
            );

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
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 h-full border border-gray-600 flex flex-col">
            <style jsx>{`
                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #8b5cf6 transparent;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #a855f7);
                    border-radius: 3px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #9333ea);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-slideIn { animation: slideIn 0.4s ease-out; }
                .animate-pulse-hover:hover { animation: pulse 0.3s ease-in-out; }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg animate-pulse">
                        <FaUserClock className="text-purple-600 dark:text-purple-300" />
                    </div>
                    Pending Requests
                    {pendingRequests.length > 0 && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            {pendingRequests.length}
                        </span>
                    )}
                </h2>
                <button
                    onClick={() => setIsRequestOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    <FaPlus className="text-xs" />
                    New Request
                </button>
            </div>

            {/* Requests List */}
            <div className="flex-1 overflow-y-auto custom-scroll">
                {pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-full mb-4 animate-pulse-hover">
                            <IoMdDocument className="text-4xl text-purple-500 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">
                            No Pending Requests
                        </h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Your appointment requests will appear here. Click "New Request" to schedule an appointment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingRequests.map((req, index) => (
                            <div
                                key={req.id}
                                className="bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 animate-slideIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-hover">
                                                <FaUser className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-white block">
                                                    {req.name}
                                                </span>
                                                <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded-full font-medium border border-orange-500/30">
                                                    {req.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-300 space-y-2 pl-13">
                                            <div className="flex items-center gap-2">
                                                <FaNotesMedical className="text-purple-400 text-xs" />
                                                <span>{req.reason}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-400 text-xs" />
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



            {/* Request Appointment Popup */}
            {isRequestOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl w-96 max-w-md mx-4 shadow-2xl border border-gray-600 animate-slideIn">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-600">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                                    <FaCalendarAlt className="text-purple-600 dark:text-purple-300" />
                                </div>
                                Request Appointment
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-400">Loading doctors...</span>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Doctor Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                            <FaUser className="text-purple-400" />
                                            Select Doctor *
                                        </label>
                                        <select
                                            name="doctorID"
                                            value={formData.doctorID}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                        <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                            <FaNotesMedical className="text-purple-400" />
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            placeholder="Describe your symptoms or reason for visit..."
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                                            required
                                        />
                                    </div>

                                    {/* Date and Time Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-400" />
                                                Preferred Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="appointmentDate"
                                                value={formData.appointmentDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                required
                                            />
                                        </div>

                                        {/* Time */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                                                <FaClock className="text-purple-400" />
                                                Preferred Time *
                                            </label>
                                            <select
                                                name="appointmentTime"
                                                value={formData.appointmentTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                        <div className="flex gap-3 p-6 border-t border-gray-600">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
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