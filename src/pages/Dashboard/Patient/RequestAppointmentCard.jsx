import React, { useState, useEffect } from "react";
import {
    FaPlusCircle,
    FaUserClock,
    FaPlus,
    FaClock,
    FaUser,
    FaCalendarAlt,
    FaNotesMedical,
    FaTimes,
} from "react-icons/fa";
import { IoMdDocument } from "react-icons/io";
import { getAllDoctors, getDoctorById } from "../../../services/doctorsApi.js";
import { createAppointment, getPatientAppointments } from "../../../services/appointmentApi.js";

const RequestAppointmentCard = () => {
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        doctorID: "",
        reason: "",
        appointmentDate: "",
        appointmentTime: "",
    });

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00",
    ];

    const fetchDoctorName = async (doctorId) => {
        try {
            const doctor = await getDoctorById(doctorId);
            return `Dr. ${doctor.firstName} ${doctor.lastName}`;
        } catch (error) {
            console.error(`Failed to fetch doctor ${doctorId}:`, error);
            return "Dr. Unknown";
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    useEffect(() => {
        if (isRequestOpen) {
            fetchDoctors();
        }
    }, [isRequestOpen]);

    const fetchPendingRequests = async () => {
        try {
            const appointmentsData = await getPatientAppointments();

            const pendingAppointments = appointmentsData.filter(
                (appointment) => appointment.status?.toLowerCase() === "pending"
            );

            const transformedRequests = await Promise.all(
                pendingAppointments.map(async (appointment) => {
                    const doctorName = appointment.doctorID
                        ? await fetchDoctorName(appointment.doctorID)
                        : "Dr. Unknown";

                    return {
                        id: appointment.token,
                        name: doctorName,
                        reason: appointment.reason || "General Consultation",
                        date: appointment.appointmentDateTime
                            ? new Date(appointment.appointmentDateTime).toLocaleDateString()
                            : appointment.dateTime
                                ? new Date(appointment.dateTime).toLocaleDateString()
                                : "TBD",
                        status: appointment.status,
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.doctorID || !formData.reason || !formData.appointmentDate || !formData.appointmentTime) {
            alert("Please fill in all fields");
            return;
        }

        try {
            setSubmitting(true);

            const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

            const appointmentData = {
                doctorID: parseInt(formData.doctorID),
                reason: formData.reason,
                appointmentDateTime: appointmentDateTime,
            };

            await createAppointment(appointmentData);

            alert("Appointment request sent successfully!");

            setFormData({
                doctorID: "",
                reason: "",
                appointmentDate: "",
                appointmentTime: "",
            });
            setIsRequestOpen(false);
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
            doctorID: "",
            reason: "",
            appointmentDate: "",
            appointmentTime: "",
        });
        setIsRequestOpen(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                    <FaUserClock className="text-orange-500" />
                    Pending Requests
                    {pendingRequests.length > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingRequests.length}
                        </span>
                    )}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-full mb-4">
                            <IoMdDocument className="text-4xl text-purple-500 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            No Pending Requests
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Your appointment requests will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingRequests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                        <FaUser className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-800 dark:text-white">
                                            {req.name}
                                        </span>
                                        <span className="bg-orange-500/20 text-orange-600 dark:text-orange-300 text-xs px-2 py-1 rounded-full font-medium ml-2">
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
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
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button
                    onClick={() => setIsRequestOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition transform hover:scale-105"
                >
                    <FaPlus className="text-xs" />
                    New Request
                </button>
            </div>

            {isRequestOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-96 max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                                <FaCalendarAlt className="text-purple-600" />
                                Request Appointment
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-400">Loading doctors...</span>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <FaUser className="text-purple-400" />
                                            Select Doctor *
                                        </label>
                                        <select
                                            name="doctorID"
                                            value={formData.doctorID}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <FaNotesMedical className="text-purple-400" />
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            placeholder="Describe your symptoms or reason for visit..."
                                            rows="3"
                                            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-400" />
                                                Preferred Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="appointmentDate"
                                                value={formData.appointmentDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FaClock className="text-purple-400" />
                                                Preferred Time *
                                            </label>
                                            <select
                                                name="appointmentTime"
                                                value={formData.appointmentTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

                        <div className="flex gap-3 p-6 border-t dark:border-gray-700">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loading}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 transition"
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
