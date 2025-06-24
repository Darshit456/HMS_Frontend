// File: src/pages/Dashboard/Patient/MedicalRecordsSection.jsx
import React, { useState, useEffect } from "react";
import { FaFileMedical, FaEye, FaTimes, FaUser, FaCalendarAlt, FaPrescriptionBottleAlt, FaNotesMedical, FaStethoscope } from "react-icons/fa";
import { getPatientMedicalRecords } from "../../../services/medicalRecordsApi.js";

const MedicalRecordsSection = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Function to format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Date formatting error:", error);
            return 'Invalid Date';
        }
    };

    // Function to get record type based on diagnosis or create a generic type
    const getRecordType = (diagnosis) => {
        if (!diagnosis) return 'General Consultation';

        const lowerDiagnosis = diagnosis.toLowerCase();
        if (lowerDiagnosis.includes('checkup') || lowerDiagnosis.includes('routine')) {
            return 'Routine Checkup';
        } else if (lowerDiagnosis.includes('follow') || lowerDiagnosis.includes('follow-up')) {
            return 'Follow-up Visit';
        } else if (lowerDiagnosis.includes('emergency') || lowerDiagnosis.includes('urgent')) {
            return 'Emergency Visit';
        } else if (lowerDiagnosis.includes('lab') || lowerDiagnosis.includes('test')) {
            return 'Lab Results';
        } else {
            return 'Medical Consultation';
        }
    };

    // Open record detail modal
    const openRecordDetail = (record) => {
        console.log("Opening record detail for:", record);
        setSelectedRecord(record);
        setShowDetailModal(true);
    };

    // Close record detail modal
    const closeRecordDetail = () => {
        setSelectedRecord(null);
        setShowDetailModal(false);
    };

    // Function to fetch medical records
    const fetchMedicalRecords = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching patient medical records...");
            const recordsData = await getPatientMedicalRecords();
            console.log("Raw medical records data:", recordsData);

            if (!recordsData || recordsData.length === 0) {
                setMedicalRecords([]);
                return;
            }

            // Transform the data to match enhanced UI structure
            const transformedRecords = recordsData.map((record, index) => {
                console.log(`Processing record ${index}:`, record);

                return {
                    id: record.recordID || record.RecordID || record.id || index,
                    type: getRecordType(record.diagnosis || record.Diagnosis),
                    date: formatDate(record.recordDate || record.RecordDate || record.createdAt || record.date),
                    diagnosis: record.diagnosis || record.Diagnosis || 'No diagnosis specified',
                    prescription: record.prescription || record.Prescription || 'No prescription specified',
                    notes: record.notes || record.Notes || 'No additional notes',
                    doctorName: record.doctorName || record.DoctorName || 'Dr. Unknown',
                    appointmentId: record.appointmentID || record.AppointmentID || null,
                    recordDate: record.recordDate || record.RecordDate || record.createdAt || record.date,
                    // Additional fields that might be present
                    patientID: record.patientID || record.PatientID,
                    doctorID: record.doctorID || record.DoctorID
                };
            });

            console.log("Transformed records:", transformedRecords);

            // Sort by date (newest first)
            transformedRecords.sort((a, b) => {
                const dateA = new Date(a.recordDate || '1970-01-01');
                const dateB = new Date(b.recordDate || '1970-01-01');
                return dateB - dateA;
            });

            setMedicalRecords(transformedRecords);

        } catch (err) {
            console.error("Failed to fetch medical records:", err);
            setError("Failed to load medical records. Please try again.");
            setMedicalRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch medical records on component mount
    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    // Auto-refresh every 2 minutes for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMedicalRecords();
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                        <FaFileMedical className="text-red-600 dark:text-red-300" />
                    </div>
                    Medical Records
                </h2>
                <div className="overflow-y-auto flex-1 custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading medical records...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaFileMedical className="text-red-500" /> Medical Records
                </h2>
                <div className="overflow-y-auto flex-1 custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-red-500 text-center">{error}</div>
                        <button
                            onClick={fetchMedicalRecords}
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
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                        <FaFileMedical className="text-red-600 dark:text-red-300" />
                    </div>
                    Medical Records
                    {medicalRecords.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {medicalRecords.length}
                        </span>
                    )}
                </h2>
                <div className="overflow-y-auto flex-1 custom-scroll group-hover:scroll-visible pr-2">
                    {medicalRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <div className="text-6xl mb-4 opacity-50">📋</div>
                            <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">No Medical Records</h3>
                            <p className="text-sm text-center">
                                Your medical records from doctor visits will appear here
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {medicalRecords.map((record) => (
                                <li key={record.id} className="border dark:border-gray-600 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500" onClick={() => openRecordDetail(record)}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaFileMedical className="text-red-500 text-sm" />
                                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{record.type}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
                                                <FaUser className="text-blue-500" />
                                                {record.doctorName}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <FaCalendarAlt className="text-green-500" />
                                                {record.date}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openRecordDetail(record);
                                            }}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-sm font-medium"
                                        >
                                            <FaEye className="text-xs" />
                                            View
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Diagnosis:</strong> {record.diagnosis.length > 100 ? record.diagnosis.substring(0, 100) + '...' : record.diagnosis}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Medical Record Detail Modal */}
            {showDetailModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaFileMedical className="text-2xl" />
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedRecord.type}</h2>
                                        <p className="text-red-100 text-sm">{selectedRecord.doctorName} • {selectedRecord.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeRecordDetail}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scroll">
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                        <FaCalendarAlt />
                                        Visit Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Date:</span>
                                            <p className="text-gray-800 dark:text-gray-200">{selectedRecord.date}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Doctor:</span>
                                            <p className="text-gray-800 dark:text-gray-200">{selectedRecord.doctorName}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Visit Type:</span>
                                            <p className="text-gray-800 dark:text-gray-200">{selectedRecord.type}</p>
                                        </div>
                                        {selectedRecord.appointmentId && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Appointment ID:</span>
                                                <p className="text-gray-800 dark:text-gray-200">#{selectedRecord.appointmentId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Diagnosis */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FaStethoscope className="text-red-500" />
                                        Diagnosis
                                    </label>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedRecord.diagnosis}</p>
                                    </div>
                                </div>

                                {/* Prescription */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FaPrescriptionBottleAlt className="text-green-500" />
                                        Prescription & Treatment
                                    </label>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedRecord.prescription}</p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedRecord.notes && selectedRecord.notes !== 'No additional notes' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <FaNotesMedical className="text-purple-500" />
                                            Additional Notes
                                        </label>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedRecord.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                onClick={closeRecordDetail}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
            `}</style>
        </>
    );
};

export default MedicalRecordsSection;