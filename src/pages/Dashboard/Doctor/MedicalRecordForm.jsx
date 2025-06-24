// File: src/pages/Dashboard/Doctor/MedicalRecordForm.jsx
import React, { useState } from "react";
import { FaNotesMedical, FaTimes, FaSave, FaFileAlt, FaPrescriptionBottleAlt, FaStethoscope, FaCalendarAlt } from "react-icons/fa";

const MedicalRecordForm = ({
                               appointment,
                               isOpen,
                               onClose,
                               onSubmit,
                               loading = false
                           }) => {
    const [formData, setFormData] = useState({
        diagnosis: "",
        prescription: "",
        notes: "",
        followUpRequired: false,
        followUpDate: "",
        vitalSigns: {
            bloodPressure: "",
            heartRate: "",
            temperature: "",
            weight: "",
            height: ""
        }
    });

    const [showVitalSigns, setShowVitalSigns] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVitalSignChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vitalSigns: {
                ...prev.vitalSigns,
                [field]: value
            }
        }));
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.diagnosis.trim() || !formData.prescription.trim()) {
            alert("Please fill in both Diagnosis and Prescription fields.");
            return;
        }

        // Prepare data for API
        const medicalRecordData = {
            patientID: appointment.patientID,
            doctorID: appointment.doctorID,
            appointmentID: appointment.appointmentId,
            diagnosis: formData.diagnosis,
            prescription: formData.prescription,
            notes: formData.notes,
            recordDate: new Date().toISOString()
        };

        console.log("Submitting medical record:", medicalRecordData);
        onSubmit(medicalRecordData);
    };

    const resetForm = () => {
        setFormData({
            diagnosis: "",
            prescription: "",
            notes: "",
            followUpRequired: false,
            followUpDate: "",
            vitalSigns: {
                bloodPressure: "",
                heartRate: "",
                temperature: "",
                weight: "",
                height: ""
            }
        });
        setShowVitalSigns(false);
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl animate-slideUp">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaNotesMedical className="text-2xl" />
                            <div>
                                <h2 className="text-xl font-bold">Create Medical Record</h2>
                                <p className="text-blue-100 text-sm">Patient: {appointment?.patientName}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            disabled={loading}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scroll p-6">
                    <div className="space-y-6">
                        {/* Appointment Info */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                Appointment Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Patient:</span>
                                    <p className="text-gray-800 dark:text-gray-200">{appointment?.patientName}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Date:</span>
                                    <p className="text-gray-800 dark:text-gray-200">{appointment?.date}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Reason:</span>
                                    <p className="text-gray-800 dark:text-gray-200">{appointment?.reason}</p>
                                </div>
                            </div>
                        </div>

                        {/* Primary Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Diagnosis */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaStethoscope className="text-red-500" />
                                    Diagnosis *
                                </label>
                                <textarea
                                    value={formData.diagnosis}
                                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                                    placeholder="Enter primary diagnosis and assessment..."
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>

                            {/* Prescription */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaPrescriptionBottleAlt className="text-green-500" />
                                    Prescription & Treatment *
                                </label>
                                <textarea
                                    value={formData.prescription}
                                    onChange={(e) => handleInputChange('prescription', e.target.value)}
                                    placeholder="Enter medications, dosage, and treatment plan..."
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FaFileAlt className="text-purple-500" />
                                Additional Notes & Observations
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Enter any additional notes, observations, or instructions..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Follow-up */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="checkbox"
                                    id="followUpRequired"
                                    checked={formData.followUpRequired}
                                    onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="followUpRequired" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Follow-up appointment required
                                </label>
                            </div>

                            {formData.followUpRequired && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Suggested follow-up date:
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.followUpDate}
                                        onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Vital Signs */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setShowVitalSigns(!showVitalSigns)}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <span className={`transform transition-transform ${showVitalSigns ? 'rotate-90' : ''}`}>▶</span>
                                Record Vital Signs (Optional)
                            </button>

                            {showVitalSigns && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                            Blood Pressure
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.vitalSigns.bloodPressure}
                                            onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                                            placeholder="120/80"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                            Heart Rate (bpm)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.vitalSigns.heartRate}
                                            onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                                            placeholder="72"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                            Temperature (°F)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.vitalSigns.temperature}
                                            onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                                            placeholder="98.6"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                            Weight (lbs)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.vitalSigns.weight}
                                            onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                                            placeholder="150"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                                            Height (in)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.vitalSigns.height}
                                            onChange={(e) => handleVitalSignChange('height', e.target.value)}
                                            placeholder="68"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 border-t border-gray-200 dark:border-gray-600 rounded-b-2xl flex-shrink-0">
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.diagnosis.trim() || !formData.prescription.trim()}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-semibold"
                        >
                            <FaSave className="text-lg" />
                            {loading ? 'Creating Medical Record...' : 'Save Medical Record'}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                        * Required fields must be completed to save the medical record
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Custom Purple Scrollbar */
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

                /* Smooth focus transitions */
                input:focus, textarea:focus {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }

                /* Dark mode improvements */
                @media (prefers-color-scheme: dark) {
                    input:focus, textarea:focus {
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default MedicalRecordForm;